import { z } from "zod/v4";

// Connection Protocol
export const connectionProtocolList = ["DccEx", "Lcc"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export const connectionTypeList = ["Serial", "Emulator", "Wifi", "Undefined"] as const;
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

export function getConnectionHardwareName(hardwareType: ConnectionType): string {
  switch (hardwareType) {
    case "Serial":
      return "Serial";
    case "Emulator":
      return "Emulator";
    case "Wifi":
      return "Wifi";
    case "Undefined":
      return "Please select a connection"
    default:
      return "Unknown Connection Type";
  }
}