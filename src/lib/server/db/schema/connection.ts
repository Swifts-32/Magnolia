import { boolean, jsonb, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { LayoutTable } from "./layouts";
import { connectionProtocolList } from "#lib/types/protocolConstants.js";
import type { InferSelectModel } from "drizzle-orm";
import {
  connectionTypeList,
  type ConnectionHardware,
} from "#lib/types/hardwareConstants.js";

export const ConnectionProtocolEnum = pgEnum(
  "connectionProtocol",
  connectionProtocolList,
);
export const ConnectionTypeEnum = pgEnum("connectionType", connectionTypeList);

export const ConnectionTable = AppSchema.table("connections", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  layoutUuid: uuid("layoutId")
    .references(() => LayoutTable.uuid)
    .notNull(),
  isConnected: boolean("isConnected").notNull().default(false),
  protocol: ConnectionProtocolEnum("protocol").notNull().default("DccEx"),
  hardware: jsonb("hardware").$type<ConnectionHardware>().notNull(),
});

export type Connection = InferSelectModel<typeof ConnectionTable>;
