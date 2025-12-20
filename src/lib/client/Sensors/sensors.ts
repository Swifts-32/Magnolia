import { z } from "zod/v4";

export const SensorStateList = ["Active", "Inactive", "Unknown"] as const;
export const SensorState = z.enum(SensorStateList);
export type SensorState = z.infer<typeof SensorState>;