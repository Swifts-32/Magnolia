import { pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { AppSchema } from "./app";
import { LayoutTable } from "./layouts";
import { connectionProtocolList, connectionTypeList } from "../../../client/Protocols/protocols";
import type { InferSelectModel } from "drizzle-orm";

export const ConnectionProtocolEnum = pgEnum("connectionProtocol", connectionProtocolList);
export const ConnectionTypeEnum = pgEnum("connectionType", connectionTypeList);

export const ConnectionTable = AppSchema.table("connections", {
  uuid: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  layoutUuid: uuid("layoutId").references(() => LayoutTable.uuid).notNull(),
  protocol: ConnectionProtocolEnum("protocol").notNull().default("DccEx"),
  hardware: ConnectionTypeEnum("type").notNull().default("Emulator"),
});

export type Connection = InferSelectModel<typeof ConnectionTable>;
