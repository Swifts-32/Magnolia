import type { ConnectionProtocol } from "#lib/types/protocolConstants.js";
import type { EventEmitter } from "events";

export interface IProtocol {
  protocolType: ConnectionProtocol;
  connectionId: string;
  processCommand: (command: Buffer) => void;
  setEventEmitter(emitter: EventEmitter): void;
  onParsedOutput: (callback: (data: string) => void) => void;
}
