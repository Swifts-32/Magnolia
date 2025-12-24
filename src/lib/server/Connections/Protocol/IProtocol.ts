import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type { EventEmitter } from "events"

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: string) => void;
  setEventEmitter(emitter: EventEmitter): void;
}