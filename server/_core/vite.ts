import express from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: express.Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      // 動態 OG 標籤處理
      const workMatch = url.match(/\/work\/(\d+)/);
      if (workMatch) {
        const workId = workMatch[1];
        const ogTitle = `第 ${workId} 組作品 - 蛻生`;
        const ogDescription = `靜宜大學中國文學系第八屆畢業展覽作品展示`;
        const ogImage = `https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hands_butterfly-82t2QECvULcYdbgUGVUnLa.webp`;
        const ogUrl = `https://pumc18light-wwoiuccx.manus.space${url.split('?')[0]}?v=2`;

        // 替換 OG 標籤
        template = template.replace(
          /property="og:title" content="[^"]*"/,
          `property="og:title" content="${ogTitle}"`
        );
        template = template.replace(
          /property="og:description" content="[^"]*"/,
          `property="og:description" content="${ogDescription}"`
        );
        template = template.replace(
          /property="og:image" content="[^"]*"/,
          `property="og:image" content="${ogImage}"`
        );
        template = template.replace(
          /property="og:url" content="[^"]*"/,
          `property="og:url" content="${ogUrl}"`
        );
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: express.Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
