import type { ConnectionProtocol } from "#lib/types/Protocols.js";
import type { EventEmitter } from "events"

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: Buffer) => void;
  setEventEmitter(emitter: EventEmitter): void;
  onParsedOutput: (callback: (data: string) => void) => void;
}
