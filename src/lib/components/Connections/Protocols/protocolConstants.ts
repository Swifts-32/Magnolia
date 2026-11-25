import { z } from "zod/v4";
import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { IProtocolClassStatic, ITrainProtocol } from "./IProtocol";
import { DccEx } from "./DccEx/server/DccEx";
import { Lcc } from "./Lcc/server/Lcc";
import { Sunbeam } from "./Sunbeam/server/Sunbeam";
import type { BaseProtocol } from "./BaseProtocol";

export const connectionProtocolList = ["DccEx", "Lcc", "Sunbeam"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export type ProtocolCapability = "trains" | "sensors";

const protocolRegistry = {
  DccEx,
  Lcc,
  Sunbeam,
} as const satisfies Record<string, IProtocolClassStatic>;

export function getProtocolName(protocol: ConnectionProtocol): string {
  const ProtocolClass = protocolRegistry[protocol];
  return ProtocolClass.protocolName ?? protocol;
}

export function protocolSupportedCapabilities(
  protocol: BaseProtocol,
  capability: ProtocolCapability,
): boolean {
  switch (capability) {
    case "trains":
      return (protocol as any).supportsTrains === true;
    case "sensors":
      return (protocol as any).supportsSensors === true;
    default:
      console.error("Unsupported protocol capability");
      return false;
  }
}

export function protocolSupportedHardware(
  protocol: ConnectionProtocol,
  hardware: ConnectionHardwareList,
): boolean {
  const ProtocolClass = protocolRegistry[protocol];
  return ProtocolClass.allowedHardware?.includes(hardware) ?? false;
}

/**
 * Type guard that checks both the static configuration and ensures
 * the protocol object actually implements ITrainProtocol.
 */
export function isTrainCapableProtocol(
  protocol: BaseProtocol,
): protocol is BaseProtocol & ITrainProtocol {
  return (protocol as any).supportsTrains === true;
}
