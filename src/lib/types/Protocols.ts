import { z } from "zod/v4";

export const connectionProtocolList = ["DccEx", "Lcc"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export function getProtocolName(protocol: ConnectionProtocol): string {
    switch (protocol) {
        case "DccEx":
            return "DCC EX";
        case "Lcc":
            return "LCC";
        default:
            return "Unknown Protocol";
    }
}