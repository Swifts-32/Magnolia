import { uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { relations, type InferSelectModel } from "drizzle-orm";
import { TrainTable } from "./trains";

export const UserTable = AppSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name"),
});

export const UserTableRelations = relations(UserTable, ({ many }) => ({
  trains: many(TrainTable),
}));

export type User = InferSelectModel<typeof UserTable>;