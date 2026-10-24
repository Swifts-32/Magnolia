import { boolean, jsonb, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { LayoutTable } from "./layouts";
import { connectionProtocolList } from "#lib/types/Protocols.js";
import type { InferSelectModel } from "drizzle-orm";
import { connectionTypeList } from "#lib/types/Hardware.js";
import type { ConnectionHardwareType } from "#lib/client/Connections.remote.js";

export const ConnectionProtocolEnum = pgEnum("connectionProtocol", connectionProtocolList);
export const ConnectionTypeEnum = pgEnum("connectionType", connectionTypeList);

export const ConnectionTable = AppSchema.table("connections", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  layoutUuid: uuid("layoutId").references(() => LayoutTable.uuid).notNull(),
  isConnected: boolean("isConnected").notNull().default(false),
  protocol: ConnectionProtocolEnum("protocol").notNull().default("DccEx"),
  hardware: jsonb("hardware").$type<ConnectionHardwareType>().notNull(),
});

export type Connection = InferSelectModel<typeof ConnectionTable>;
