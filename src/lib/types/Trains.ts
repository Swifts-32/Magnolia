import { z } from "zod/v4";

export type TrainUuid = `${string}-${string}-${string}-${string}-${string}`;
export type TrainAddress = string; // e.g.Dcc - 120 or LCC - 12.334.62.8

export const TrainDirectionsList = ["Forward", "Reverse", "Unknown"] as const;
export const TrainDirection = z.enum(TrainDirectionsList);
export type TrainDirection = z.infer<typeof TrainDirection>;

export const TrainMotion = z.object({
    trainId: z.uuid(),
    speed: z.number(),
    direction: TrainDirection,
});
export type TrainMotion = z.infer<typeof TrainMotion>;
