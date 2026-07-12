import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import type { InferSelectModel } from "drizzle-orm";

export const SessionTable = AppSchema.table("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type Session = InferSelectModel<typeof SessionTable>;