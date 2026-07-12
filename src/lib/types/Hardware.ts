import { z } from "zod/v4";

export const connectionTypeList = ["Serial", "Emulator", "Undefined"] as const;
export const ConnectionType = z.enum(connectionTypeList);
export type ConnectionType = z.infer<typeof ConnectionType>;

export function getConnectionHardwareName(hardwareType: ConnectionType): string {
    switch (hardwareType) {
        case "Serial":
            return "Serial";
        case "Emulator":
            return "Emulator";
        case "Undefined":
            return "Please select a connection"
        default:
            return "Unknown Connection Type";
    }
}