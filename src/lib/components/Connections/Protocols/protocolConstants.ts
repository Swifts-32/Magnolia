import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { ITrainProtocol } from "./IProtocol";
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
  protocol: ConnectionProtocol,
  capability: ProtocolCapability,
): boolean {
  const metadata = protocolMetadataMap[protocol];
  return metadata.capabilities.some((x) => x === capability);
}

/**
 * Type guard that checks both the static configuration and ensures
 * the protocol object actually implements ITrainProtocol.
 */
export function isTrainCapableProtocol(
  protocol: ConnectionProtocol,
): protocol is ConnectionProtocol & ITrainProtocol {
  const metadata = protocolMetadataMap[protocol];
  return metadata.capabilities.some((x) => x === "trains");
}
