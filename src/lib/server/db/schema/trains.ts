import { boolean, integer, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { LayoutTable as LayoutTable } from "./layouts";
import { AppSchema } from "./app";
import { TrainFunctionIconsList, TrainFunctionModesList } from "../../../types/Trains/Functions/Functions";
import { relations } from "drizzle-orm";

export const TrainDirection = pgEnum("trainDirection", ["Forward", "Reverse", "Unknown"]);
export const TrainFunctionIcon = pgEnum("trainFunctionIcon", TrainFunctionIconsList);
export const TrainFunctionMode = pgEnum("trainFunctionMode", TrainFunctionModesList);


// TODO add onUpdate and onDelte functions to regerences

export const TrainTable = AppSchema.table("trains", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  layoutUuid: uuid("layoutId").references(() => LayoutTable.uuid, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),

  direction: TrainDirection("direction").default("Unknown").notNull(),
})

export const TrainFunctionTable = AppSchema.table("function", {
  value: varchar("value").primaryKey().notNull(),
  trainUuid: uuid("trainId").references(() => TrainTable.uuid, { onDelete: "cascade" }).notNull(),

  name: varchar("name").default("New Function").notNull(),
  icon: TrainFunctionIcon("icon").default("Text").notNull(),
  mode: TrainFunctionMode("mode").default("Toggle").notNull(),

  visible: boolean("visible").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  state: boolean("state").default(false).notNull(),
})

// Relations
export const TrainTableRelations = relations(TrainTable, ({ one, many }) => ({
  layout: one(LayoutTable, {
    fields: [TrainTable.layoutUuid],
    references: [LayoutTable.uuid],
  }),
  functions: many(TrainFunctionTable),
}));

export const TrainFunctionTableRelations = relations(TrainFunctionTable, ({ one }) => ({
  train: one(TrainTable, {
    fields: [TrainFunctionTable.trainUuid],
    references: [TrainTable.uuid],
  }),
}));