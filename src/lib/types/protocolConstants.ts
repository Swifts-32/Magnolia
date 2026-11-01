import { z } from "zod/v4";
import type { ConnectionHardwareList } from "./hardwareConstants";

export const connectionProtocolList = ["DccEx", "Lcc", "Sunbeam"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export function getProtocolName(protocol: ConnectionProtocol): string {
  switch (protocol) {
    case "DccEx":
      return "DCC EX";
    case "Lcc":
      return "LCC";
    case "Sunbeam":
      return "Sunbeam";
    default:
      return "Unknown Protocol";
  }
}

export const protocolAllowedHardware: Record<
  ConnectionProtocol,
  readonly ConnectionHardwareList[]
> = {
  Sunbeam: ["WebServer"],
  DccEx: ["Serial", "Emulator"],
  Lcc: ["Serial"],
};
