import { boolean, integer, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { LayoutTable as LayoutTable } from "./layouts";
import { AppSchema } from "./app";
import { type InferSelectModel } from "drizzle-orm";
import { ConnectionTable } from "./connection";
import { sensorStateList } from "#lib/types/sensors.js";
import { relations } from "drizzle-orm/_relations";
import { createSelectSchema } from "drizzle-orm/zod";
import { z } from "zod/v4";

export const sensorState = pgEnum("sensorState", sensorStateList);

export const SensorTable = AppSchema.table("sensors", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  layoutId: uuid("layoutId")
    .references(() => LayoutTable.uuid, { onDelete: "cascade" })
    .notNull(),
  connectionId: uuid("connectionId").references(() => ConnectionTable.uuid, {
    onDelete: "set null",
  }),

  address: varchar("address", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  comment: varchar("comment", { length: 255 }),

  state: sensorState("state").notNull().default("inactive"),
  inverted: boolean("inverted").notNull().default(false),
  activationDelay: integer("activationDelay").notNull().default(0),
  deactivationDelay: integer("deactivationDelay").notNull().default(0),
});

export type Sensor = InferSelectModel<typeof SensorTable>;

export const SensorTableRelations = relations(SensorTable, ({ one }) => ({
  layout: one(LayoutTable, {
    fields: [SensorTable.layoutId],
    references: [LayoutTable.uuid],
  }),
  connection: one(ConnectionTable, {
    fields: [SensorTable.connectionId],
    references: [ConnectionTable.uuid],
  }),
}));

export const SensorSelectSchema = createSelectSchema(SensorTable);
export type SensorSelect = z.infer<typeof SensorSelectSchema>;

export const SensorInsertSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  address: z.string().trim().min(1, "Address is required").max(255),
  layoutId: z.uuid(),
  id: z.uuid(),
  comment: z.string().trim().max(255).optional(),
  connectionId: z.uuid().optional(),
  inverted: z.boolean().optional(),
  activationDelay: z.number().int().min(0).optional(),
  deactivationDelay: z.number().int().min(0).optional(),
});

export type SensorInsert = z.infer<typeof SensorInsertSchema>;
