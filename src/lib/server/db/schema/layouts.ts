import { integer, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { relations } from "drizzle-orm";
import { TrainTable } from "./trains";

export const LayoutTable = AppSchema.table("layouts", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  position: integer("position").notNull(),
});

export const LayoutTableRelations = relations(LayoutTable, ({ many }) => ({
  trains: many(TrainTable),
}));