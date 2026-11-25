import { z } from "zod/v4";
import { protocolMetadataMap } from "./protocolMetadata";

export const connectionProtocolList = Object.keys(protocolMetadataMap) as [
  ConnectionProtocol,
  ...ConnectionProtocol[],
];

export type ProtocolCapability = "trains" | "sensors";
export type ConnectionProtocol = keyof typeof protocolMetadataMap;
export const ConnectionProtocol = z.enum(connectionProtocolList);
