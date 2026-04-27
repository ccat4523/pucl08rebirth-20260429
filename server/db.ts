import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, works, promotionalVideos, InsertWork, InsertPromotionalVideo } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Works queries
export async function getWorks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(works).orderBy(works.workNumber);
}

export async function getWorkById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(works).where(eq(works.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertWork(work: InsertWork & { id?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (work.id) {
    await db.update(works).set(work).where(eq(works.id, work.id));
  } else {
    await db.insert(works).values(work);
  }
}

// Promotional videos queries
export async function getPromotionalVideos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(promotionalVideos).orderBy(promotionalVideos.videoNumber);
}

export async function getPromotionalVideoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(promotionalVideos).where(eq(promotionalVideos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertPromotionalVideo(video: InsertPromotionalVideo & { id?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (video.id) {
    await db.update(promotionalVideos).set(video).where(eq(promotionalVideos.id, video.id));
  } else {
    await db.insert(promotionalVideos).values(video);
  }
}
