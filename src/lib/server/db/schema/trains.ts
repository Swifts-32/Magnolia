import {
  boolean,
  integer,
  pgEnum,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { LayoutTable as LayoutTable } from "./layouts";
import { AppSchema } from "./app";
import { relations, type InferSelectModel } from "drizzle-orm";
import { UserTable } from "./users";
import { ConnectionTable } from "./connection";
import {
  TrainFunctionIconsList,
  TrainFunctionModesList,
} from "#lib/types/TrainFunctions.js";
import { TrainDirectionsList } from "#lib/types/Trains.js";

export const TrainDirection = pgEnum("trainDirection", TrainDirectionsList);
export const TrainFunctionIcon = pgEnum(
  "trainFunctionIcon",
  TrainFunctionIconsList,
);
export const TrainFunctionMode = pgEnum(
  "trainFunctionMode",
  TrainFunctionModesList,
);

// Train
export const TrainTable = AppSchema.table("trains", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  layoutUuid: uuid("layoutId")
    .references(() => LayoutTable.uuid, { onDelete: "cascade" })
    .notNull(),
  address: varchar("address").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),
  connectionUuid: uuid("connectionId").references(() => ConnectionTable.uuid, {
    onDelete: "set null",
  }),

  direction: TrainDirection("direction").default("Unknown").notNull(),
  speed: integer("speed").notNull().default(0),
  userControllingId: uuid("userControllingId").references(() => UserTable.id, {
    onDelete: "set null",
  }),
});

export type Train = InferSelectModel<typeof TrainTable>;

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
  id: uuid("id").primaryKey().defaultRandom().notNull(),

  value: varchar("value").notNull(),
  trainId: uuid("trainId")
    .references(() => TrainTable.uuid, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 255 }).notNull().default("New Function"),
  icon: TrainFunctionIcon("icon").default("Text").notNull(),
  mode: TrainFunctionMode("mode").default("Toggle").notNull(),

  visible: boolean("visible").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  state: boolean("state").default(false).notNull(),
});

export type TrainFunction = InferSelectModel<typeof TrainFunctionTable>;

export const TrainFunctionTableRelations = relations(
  TrainFunctionTable,
  ({ one }) => ({
    train: one(TrainTable, {
      fields: [TrainFunctionTable.trainId],
      references: [TrainTable.uuid],
    }),
  }),
);
