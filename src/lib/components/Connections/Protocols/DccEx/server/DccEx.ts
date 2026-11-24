import { DccExLocoManager } from "./modules/DccExLoco";
import type { ConnectionProtocol } from "#lib/components/Connections/Protocols/protocolConstants.js";
import type { IProtocol, ITrainProtocol } from "../../IProtocol";
import type { TrackStatusEntry } from "../DccExTypes";
import { TrackManager } from "./modules/DccExTrackManager";
import type { TrainUuid, TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "#lib/components/Connections/Connection.server.ts";

export class DccEx implements IProtocol, ITrainProtocol {
  public protocolType: ConnectionProtocol = "DccEx";
  public connectionId: string;

  public locoManager: DccExLocoManager = new DccExLocoManager();
  public trackStatus: TrackStatusEntry[] = [];

  private updateListeners: (() => void)[] = [];
  private _onParsedOutput: ((data: string) => void) | null = null;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public eStop(connection: Connection): void {
    connection.write(Buffer.from(`<!>`));
  }

  public setMotion(train: Train, connection: Connection, motion: TrainMotion) {
    const dirBit = motion.direction === "Forward" ? 1 : 0;
    connection.write(
      Buffer.from(`<t ${train.address} ${train.speed} ${dirBit}>`),
    );
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
    this._onParsedOutput?.(text);

    let updated = false;

    // Extract prefix type (e.g., matching text like "<=", "<p", "<l", "<jI")
    if (text.startsWith("<l")) {
      this.locoManager.handleLocoBroadcast(text);
      updated = true;
    } else if (
      text.startsWith("<=") ||
      text.startsWith("<p") ||
      text.startsWith("<j")
    ) {
      this.trackStatus = TrackManager.processCommand(text, this.trackStatus);
      updated = true;
    }

    if (updated) {
      this.notifyListeners();
    }
  }
}
