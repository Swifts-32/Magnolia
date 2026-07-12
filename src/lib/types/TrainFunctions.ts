import { boolean, number, z } from "zod/v4";

export const TrainFunctionModesList = ["Toggle", "Select"] as const;
export const TrainFunctionModes = z.enum(TrainFunctionModesList);
export type TrainFunctionModes = z.infer<typeof TrainFunctionModes>;

export const TrainFunctionIconsList = ["Speaker", "Light1", "Light2", "Bell", "Text"] as const;
export const TrainFunctionIcons = z.enum(TrainFunctionIconsList);
export type TrainFunctionIcons = z.infer<typeof TrainFunctionIcons>;

export const TrainFunctionKey = z.object({
    value: z.string(),
    trainId: z.uuid(),
});
export type TrainFunctionKey = z.infer<typeof TrainFunctionKey>;

export const TrainFunction = z.object({
  value: z.string(),
  trainId: z.uuid(),
  name: z.string().trim().max(255),
  icon: TrainFunctionIcons.default("Text"),
  mode: TrainFunctionModes.default("Toggle"),
  visible: boolean().default(true),
  position: number().min(0).default(0),
  state: boolean().default(false),
  id: z.string().optional(),
});
export type TrainFunction = z.infer<typeof TrainFunction>;

