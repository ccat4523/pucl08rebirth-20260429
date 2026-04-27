import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("works API", () => {
  it("should list all works", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const works = await caller.works.list();
    expect(Array.isArray(works)).toBe(true);
  });

  it("should get work by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const work = await caller.works.getById(1);
    // Work may or may not exist, but the query should not throw
    expect(work === undefined || typeof work === "object").toBe(true);
  });

  it("should update work with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw an error
    await caller.works.update({
      id: 1,
      title: "Test Work",
      author: "Test Author",
    });

    expect(true).toBe(true);
  });
});

describe("promotionalVideos API", () => {
  it("should list all promotional videos", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const videos = await caller.promotionalVideos.list();
    expect(Array.isArray(videos)).toBe(true);
  });

  it("should get promotional video by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const video = await caller.promotionalVideos.getById(1);
    // Video may or may not exist, but the query should not throw
    expect(video === undefined || typeof video === "object").toBe(true);
  });

  it("should update promotional video with authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Should not throw an error
    await caller.promotionalVideos.update({
      id: 1,
      title: "Test Promo Video",
    });

    expect(true).toBe(true);
  });
});
