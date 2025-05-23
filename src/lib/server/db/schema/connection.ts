import { uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";

export const ConnectionTable = AppSchema.table("connections", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});