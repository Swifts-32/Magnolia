import { z } from "zod/v4";

export const sensorStateList = ["active", "inactive", "unknown"] as const;
export const SensorState = z.enum(sensorStateList);
export type SensorState = z.infer<typeof SensorState>;
