import { z } from "zod/v4";
import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { IProtocol, ITrainProtocol } from "./IProtocol";
import { DccEx } from "./DccEx/server/DccEx";
import { Lcc } from "./Lcc/server/Lcc";
import { Sunbeam } from "./Sunbeam/server/Sunbeam";

const protocolRegistry = {
  DccEx,
  Lcc,
  Sunbeam,
} as const;

export const connectionProtocolList = Object.keys(
  protocolRegistry,
) as (keyof typeof protocolRegistry)[];
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export type ProtocolCapability = "trains" | "sensors";

export function getProtocolName(protocol: ConnectionProtocol): string {
  const ProtocolClass = protocolRegistry[protocol];
  return ProtocolClass.protocolName ?? protocol;
}

export function protocolSupportedCapabilities(
  protocol: IProtocol,
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
  protocol: IProtocol,
): protocol is IProtocol & ITrainProtocol {
  return (protocol as any).supportsTrains === true;
}
