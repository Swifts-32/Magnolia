import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { ITrainProtocol } from "./IProtocol";
import type { ConnectionProtocol, ProtocolCapability } from "./protocolTypes";
import { protocolMetadataMap } from "./protocolMetadata";
import type { BaseProtocol } from "./BaseProtocol";

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

export function isTrainCapableProtocol(
  protocol: BaseProtocol,
): protocol is BaseProtocol & ITrainProtocol {
  if (!protocol) return false;

  // Automatically scales to any new protocol defined in metadataMap
  const metadata = protocolMetadataMap[protocol.protocolType];
  return metadata?.capabilities?.includes("trains") ?? false;
}
