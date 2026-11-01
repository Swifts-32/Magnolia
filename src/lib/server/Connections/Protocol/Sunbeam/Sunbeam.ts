import type { ConnectionProtocol } from "#lib/types/protocolConstants.ts";
import type EventEmitter from "events";
import type { IProtocol } from "../IProtocol";

export class Sunbeam implements IProtocol {
  public protocolType: ConnectionProtocol = "Sunbeam";
  public connectionId: string;

  private events: EventEmitter | null = null;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public setEventEmitter(emitter: EventEmitter): void {
    this.events = emitter;
  }

  private _onParsedOutput: ((data: string) => void) | null = null;
  public onParsedOutput(callback: (data: string) => void) {
    this._onParsedOutput = callback;
  }

  public processCommand(command: Buffer): void {
    const text = command.toString("utf8").trim();

    // console.log(`Proccessing command: ${text}`);
    this._onParsedOutput?.(text);
  }
}
