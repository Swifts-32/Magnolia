import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { ITrainProtocol } from "./IProtocol";
import type { BaseProtocol } from "./BaseProtocol";
import type { ConnectionProtocol, ProtocolCapability } from "./protocolTypes";
import { protocolMetadataMap } from "./protocolMetadata";

export function getProtocolName(protocol: ConnectionProtocol): string {
  return protocolMetadataMap[protocol]?.protocolName ?? protocol;
}

export function protocolSupportedHardware(
  protocol: ConnectionProtocol,
  hardware: ConnectionHardwareList,
): boolean {
  const metadata = protocolMetadataMap[protocol];
  return metadata.allowedHardware.some((x) => x === hardware);
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

/**
 * Type guard that checks both the static configuration and ensures
 * the protocol object actually implements ITrainProtocol.
 */
export function isTrainCapableProtocol(
  protocol: BaseProtocol,
): protocol is BaseProtocol & ITrainProtocol {
  return (protocol as any).supportsTrains === true;
}
