import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { storagePut } from "../storage";
import multer from "multer";
import type { Request as ExpressRequest } from "express";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  // File upload endpoint
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
  
  app.post('/api/upload', upload.single('file'), async (req: ExpressRequest & { file?: Express.Multer.File }, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }
      
      const fileType = req.body.type || 'file';
      const fileKey = `uploads/${fileType}/${Date.now()}-${req.file.originalname}`;
      
      const { url, key } = await storagePut(fileKey, req.file.buffer as Buffer, req.file.mimetype);
      
      res.json({ url, key });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}/`);
    console.log(`✓ API endpoint: http://localhost:${port}/api/trpc`);
    console.log(`✓ Upload endpoint: http://localhost:${port}/api/upload`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
