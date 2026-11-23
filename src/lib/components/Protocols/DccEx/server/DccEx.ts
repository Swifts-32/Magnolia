import { DccExLocoManager } from "./modules/DccExLoco";
import type { ConnectionProtocol } from "#lib/types/protocolConstants.js";
import type { IProtocol } from "../../../../server/Connections/Protocol/IProtocol";
import {
  DccExTrackManager,
  type TrackStatusEntry,
} from "./modules/DccExTrackManager";
import { DccExPowerManager } from "./modules/DccExPowerManager";
import { DccExCurrentManager } from "./modules/DccExCurrentManager";

export class DccEx implements IProtocol {
  public protocolType: ConnectionProtocol = "DccEx";
  public connectionId: string;

  public locoManager: DccExLocoManager = new DccExLocoManager();
  private trackManager = new DccExTrackManager();
  private powerManager = new DccExPowerManager();
  private currentManager = new DccExCurrentManager();

  private updateListeners: (() => void)[] = [];
  private _onParsedOutput: ((data: string) => void) | null = null;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public get trackStatus(): TrackStatusEntry[] {
    return this.trackManager.trackStatus;
  }

  public onUpdate(callback: () => void): () => void {
    this.updateListeners.push(callback);
    return () => {
      this.updateListeners = this.updateListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  private notifyListeners() {
    for (const cb of this.updateListeners) {
      cb();
    }
  }

  public onParsedOutput(callback: (data: string) => void) {
    this._onParsedOutput = callback;
  }

  public processCommand(command: Buffer) {
    const text = command.toString("utf8").trim();

    // console.log(`Processing DCC EX command: ${text}`);
    this._onParsedOutput?.(text);

    let updated = false;

    if (text.startsWith("<l")) {
      this.locoManager.handleLocoBroadcast(text);
      updated = true;
    } else if (text.startsWith("<=")) {
      this.trackManager.processTrackCommand(text);
      updated = true;
    } else if (text.startsWith("<p")) {
      const content = text.slice(2, -1).trim();
      const parts = content.split(/\s+/);
      this.trackManager.updatePower(parts[0], parts[1]);
      updated = true;
    } else if (text.startsWith("<jI")) {
      const match = text.match(/\[(.*?)\]/);
      if (match) {
        const values = match[1].trim().split(/\s+/).map(Number);
        this.trackManager.updateCurrents(values);
        updated = true;
      }
    } else if (text.startsWith("<jG")) {
      const match = text.match(/\[(.*?)\]/);
      if (match) {
        const values = match[1].trim().split(/\s+/).map(Number);
        this.trackManager.updateMaxCurrents(values);
        updated = true;
      }
    }

    if (updated) {
      this.notifyListeners();
    }
  }
}
