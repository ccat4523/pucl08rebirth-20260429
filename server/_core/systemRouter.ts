import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";

// 簡單的內存存儲，實際應用中應該使用數據庫
let heroImageUrl: string = "";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  getHeroImage: publicProcedure
    .query(async () => {
      return {
        imageUrl: heroImageUrl,
      };
    }),

  updateHeroImage: adminProcedure
    .input(
      z.object({
        imageUrl: z.string().min(1, "imageUrl is required"),
      })
    )
    .mutation(async ({ input }) => {
      heroImageUrl = input.imageUrl;
      return {
        success: true,
        imageUrl: heroImageUrl,
      };
    }),
});
