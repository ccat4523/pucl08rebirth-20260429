import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getWorks, getWorkById, upsertWork, getPromotionalVideos, getPromotionalVideoById, upsertPromotionalVideo } from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  works: router({
    list: publicProcedure.query(() => getWorks()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getWorkById(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number().optional(),
        workNumber: z.number().optional(),
        title: z.string().optional(),
        author: z.string().optional(),
        image1Url: z.string().optional(),
        image1Key: z.string().optional(),
        image2Url: z.string().optional(),
        image2Key: z.string().optional(),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
      }))
      .mutation(({ input }) => upsertWork(input as any)),
  }),

  promotionalVideos: router({
    list: publicProcedure.query(() => getPromotionalVideos()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getPromotionalVideoById(input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number().optional(),
        videoNumber: z.number().optional(),
        title: z.string().optional(),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
      }))
      .mutation(({ input }) => upsertPromotionalVideo(input as any)),
  }),
});

export type AppRouter = typeof appRouter;
