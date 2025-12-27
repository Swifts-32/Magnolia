import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type { EventEmitter } from "events"

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: Buffer) => void;
  setEventEmitter(emitter: EventEmitter): void;
}