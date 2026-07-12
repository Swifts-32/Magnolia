import { boolean, integer, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { LayoutTable as LayoutTable } from "./layouts";
import { AppSchema } from "./app";
import { relations, type InferSelectModel } from "drizzle-orm";
import { ConnectionTable } from "./connection";
import { SensorStateList } from "$lib/types/Sensors";

export const sensorState = pgEnum("sensorState", SensorStateList);

export const SensorTable = AppSchema.table("sensors", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  layoutId: uuid("layoutId").references(() => LayoutTable.uuid, { onDelete: "cascade" }).notNull(),
  connectionId: uuid("connectionId").references(() => ConnectionTable.uuid, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),
  state: sensorState("state").notNull(),
  inverted: boolean("inverted").notNull().default(false),
  activationDelay: integer("activationDelay").notNull().default(0),
  deactivationDelay: integer("activationDelay").notNull().default(0),
});

export type Sensor = InferSelectModel<typeof SensorTable>;

export const SensorTableRelations = relations(SensorTable, ({ one, many }) => ({
  layout: one(LayoutTable, {
    fields: [SensorTable.layoutId],
    references: [LayoutTable.uuid],
  }),
  // userControlling: one(UserTable, {
  //   fields: [TrainTable.userControllingId],
  //   references: [UserTable.id],
  // }),
  // functions: many(TrainFunctionTable),
}));


// Train Function
// export const TrainFunctionTable = AppSchema.table("function", {
//   functValue: varchar("value").notNull(),
//   trainUuid: uuid("trainId").references(() => TrainTable.uuid, { onDelete: "cascade" }).notNull(),

//   name: varchar("name", { length: 255 }).notNull().default("New Function"),
//   icon: TrainFunctionIcon("icon").default("Text").notNull(),
//   mode: TrainFunctionMode("mode").default("Toggle").notNull(),

//   visible: boolean("visible").default(true).notNull(),
//   position: integer("position").default(0).notNull(),
//   state: boolean("state").default(false).notNull(),
// },
//   (table) => [
//     primaryKey({ columns: [table.functValue, table.trainUuid] })
//   ]
// )

// export type TrainFunction = InferSelectModel<typeof TrainFunctionTable>;

// export const TrainFunctionTableRelations = relations(TrainFunctionTable, ({ one }) => ({
//   train: one(TrainTable, {
//     fields: [TrainFunctionTable.trainUuid],
//     references: [TrainTable.uuid],
//   }),
// }));