import { z } from "zod/v4";

// Connection Protocol
export const connectionProtocolList = ["DccEx", "Lcc"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export const connectionTypeList = ["Serial", "Emulator"] as const;
export const ConnectionType = z.enum(connectionTypeList);
export type ConnectionType = z.infer<typeof ConnectionType>;

export function getProtocolName(protocol: ConnectionProtocol): string {
  switch (protocol) {
    case "DccEx":
      return "DCC EX";
    case "Lcc":
      return "LCC";
    default:
      return "Unknown";
  }
}

export function getConnectionTypeName(connType: ConnectionType): string {
  switch (connType) {
    case "Serial":
      return "Serial";
    case "Emulator":
      return "Emulator";
    default:
      return "Unknown Connection Type";
  }
}