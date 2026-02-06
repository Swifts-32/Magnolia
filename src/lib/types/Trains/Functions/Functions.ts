import { z } from "zod/v4";

export const TrainFunctionModesList = ["Toggle", "Select"] as const;
export const TrainFunctionModes = z.enum(TrainFunctionModesList);
export type TrainFunctionModes = z.infer<typeof TrainFunctionModes>;

export const TrainFunctionIconsList = ["Speaker", "Light1", "Light2", "Bell", "Text"] as const;
export const TrainFunctionIcons = z.enum(TrainFunctionIconsList);
export type TrainFunctionIcons = z.infer<typeof TrainFunctionIcons>;


