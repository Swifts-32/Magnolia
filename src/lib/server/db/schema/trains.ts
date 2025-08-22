import { boolean, integer, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { LayoutTable as LayoutTable } from "./layouts";
import { AppSchema } from "./app";
import { TrainFunctionIconsList, TrainFunctionModesList } from "../../../types/Trains/Functions/Functions";
import { relations } from "drizzle-orm";
import { UserTable } from "./users";
import { ConnectionTable } from "./connection";
import { z } from "zod/v4";

export const TrainDirection = pgEnum("trainDirection", ["Forward", "Reverse", "Unknown"]);
export const TrainFunctionIcon = pgEnum("trainFunctionIcon", TrainFunctionIconsList);
export const TrainFunctionMode = pgEnum("trainFunctionMode", TrainFunctionModesList);

// Train
export const TrainTable = AppSchema.table("trains", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  layoutUuid: uuid("layoutId").references(() => LayoutTable.uuid, { onDelete: "cascade" }).notNull(),
  address: varchar("address").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),
  connectionUuid: uuid("connectionId").references(() => ConnectionTable.uuid, { onDelete: "set null" }),

  direction: TrainDirection("direction").default("Unknown").notNull(),
  speed: integer("speed").notNull().default(0),
  userControllingId: uuid("userControllingId").references(() => UserTable.id, { onDelete: "set null" }),
});

export const trainSchema = z.object({
  uuid: z.uuid(),
  layoutUuid: z.uuid(),
  address: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
  comment: z.string().trim().min(1).max(255),
  connectionUuid: z.uuid(),
  direction: z.enum(["Forward", "Reverse", "Unkown"]),
  speed: z.number(),
  userControllingId: uuid(),
});

export const TrainTableRelations = relations(TrainTable, ({ one, many }) => ({
  layout: one(LayoutTable, {
    fields: [TrainTable.layoutUuid],
    references: [LayoutTable.uuid],
  }),
  userControlling: one(UserTable, {
    fields: [TrainTable.userControllingId],
    references: [UserTable.id],
  }),
  functions: many(TrainFunctionTable),
}));


// Train Function
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

export const TrainFunctionTableRelations = relations(TrainFunctionTable, ({ one }) => ({
  train: one(TrainTable, {
    fields: [TrainFunctionTable.trainUuid],
    references: [TrainTable.uuid],
  }),
}));