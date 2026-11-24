import { z } from "zod/v4";
import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { IProtocol, ITrainProtocol } from "./IProtocol";

export const connectionProtocolList = ["DccEx", "Lcc", "Sunbeam"] as const;
export const ConnectionProtocol = z.enum(connectionProtocolList);
export type ConnectionProtocol = z.infer<typeof ConnectionProtocol>;

export const protocolCapabilityList = [
  "trains",
  "sensors",
  "turnouts",
] as const;
export type ProtocolCapability = (typeof protocolCapabilityList)[number];

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

export const protocolCapabilities: Record<
  ConnectionProtocol,
  readonly ProtocolCapability[]
> = {
  DccEx: ["trains"],
  Lcc: ["sensors", "turnouts"],
  Sunbeam: ["sensors"],
};

export function protocolSupportedCapabilities(
  protocol: ConnectionProtocol,
  capability: ProtocolCapability,
): boolean {
  return protocolCapabilities[protocol]?.includes(capability) ?? false;
}

export function protocolSupportedHardware(
  protocol: ConnectionProtocol,
  capability: ConnectionHardwareList,
): boolean {
  return protocolAllowedHardware[protocol]?.includes(capability) ?? false;
}

/**
 * Type guard that checks both the static configuration and ensures
 * the protocol object actually implements ITrainProtocol.
 */
export function isTrainCapableProtocol(
  protocol: IProtocol,
): protocol is IProtocol & ITrainProtocol {
  // Check your existing capability registry
  const supported = protocolSupportedCapabilities(
    protocol.protocolType,
    "trains",
  );

  // Optional runtime safety check to make sure methods actually exist on the class instance
  const hasMethods =
    typeof (protocol as any).setMotion === "function" &&
    typeof (protocol as any).eStop === "function";

  return supported && hasMethods;
}
