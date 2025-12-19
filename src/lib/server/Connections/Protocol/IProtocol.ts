import type { ConnectionProtocol, ConnectionType } from "$lib/client/Protocols/protocols";

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: string) => void;
}