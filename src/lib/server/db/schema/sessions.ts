import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { UserTable } from "./users";
import type { InferSelectModel } from "drizzle-orm";

export const SessionTable = AppSchema.table("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: uuid("userId").notNull().references(() => UserTable.id),
  expiresAt: timestamp("expiresAt", { withTimezone: true, mode: "date" }).notNull(),
});

export type Session = InferSelectModel<typeof SessionTable>;