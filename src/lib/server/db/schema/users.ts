import { uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { type InferSelectModel } from "drizzle-orm";
import { TrainTable } from "./trains";
import { relations } from "drizzle-orm/_relations";

export const UserTable = AppSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name"),
});

export const UserTableRelations = relations(UserTable, ({ many }) => ({
  trains: many(TrainTable),
}));

export type User = InferSelectModel<typeof UserTable>;
