import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Works table for storing student artwork
 */
export const works = mysqlTable("works", {
  id: int("id").autoincrement().primaryKey(),
  workNumber: int("workNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull().default("作品"),
  author: varchar("author", { length: 255 }).notNull().default("創作者"),
  image1Url: text("image1Url"),
  image1Key: varchar("image1Key", { length: 255 }),
  image2Url: text("image2Url"),
  image2Key: varchar("image2Key", { length: 255 }),
  videoUrl: text("videoUrl"),
  videoKey: varchar("videoKey", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Work = typeof works.$inferSelect;
export type InsertWork = typeof works.$inferInsert;

/**
 * Promotional videos table
 */
export const promotionalVideos = mysqlTable("promotionalVideos", {
  id: int("id").autoincrement().primaryKey(),
  videoNumber: int("videoNumber").notNull(),
  title: varchar("title", { length: 255 }).notNull().default("宣傳片"),
  videoUrl: text("videoUrl"),
  videoKey: varchar("videoKey", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PromotionalVideo = typeof promotionalVideos.$inferSelect;
export type InsertPromotionalVideo = typeof promotionalVideos.$inferInsert;