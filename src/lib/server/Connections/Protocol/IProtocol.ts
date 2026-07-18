import type { ConnectionProtocol } from "$lib/types/Protocols";
import type { EventEmitter } from "events"

export interface IProtocol {
  protocolType: ConnectionProtocol;
  processCommand: (command: Buffer) => void;
  setEventEmitter(emitter: EventEmitter): void;
  onParsedOutput: (callback: (data: string) => void) => void;
}