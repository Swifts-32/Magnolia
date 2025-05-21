import { pgSchema } from "drizzle-orm/pg-core";

export const AppSchema = pgSchema("app");


export const SettingsTable = AppSchema.table("settings", {

})