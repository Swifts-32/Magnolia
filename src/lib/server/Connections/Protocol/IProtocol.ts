import type { ConnectionProtocol, ConnectionType } from "$lib/client/Connections/Protocols/protocols";

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: string) => void;
}