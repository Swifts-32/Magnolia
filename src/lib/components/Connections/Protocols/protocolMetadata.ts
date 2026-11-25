import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { ProtocolCapability } from "./protocolTypes";

export interface ProtocolMetadata {
  readonly protocolName: string;
  readonly allowedHardware: readonly ConnectionHardwareList[];
  readonly capabilities: readonly ProtocolCapability[];
}

// Single source of truth for UI and shared logic
export const protocolMetadataMap = {
  DccEx: {
    protocolName: "DCC-EX",
    allowedHardware: ["Serial", "Emulator"],
    capabilities: ["trains"],
  },
  Lcc: {
    protocolName: "LCC",
    allowedHardware: ["Serial"],
    capabilities: ["sensors"],
  },
  Sunbeam: {
    protocolName: "Sunbeam",
    allowedHardware: ["WebServer"],
    capabilities: ["sensors"],
  },
} as const;
