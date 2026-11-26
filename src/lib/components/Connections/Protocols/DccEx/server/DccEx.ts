import { DccExLocoManager } from "./modules/DccExLoco";
import type { ITrainProtocol } from "../../IProtocol";
import type { TrackStatusEntry } from "../DccExTypes";
import { TrackManager } from "./modules/DccExTrackManager";
import type { TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "#lib/components/Connections/Connection.server.ts";
import { BaseProtocol } from "../../BaseProtocol";
import { DccExInfoManager, type DccExInfo } from "./modules/DccExInfoManager";

export class DccEx extends BaseProtocol implements ITrainProtocol {
  public locoManager: DccExLocoManager = new DccExLocoManager();
  public trackStatus: TrackStatusEntry[] = [];
  public infoManager: DccExInfoManager = new DccExInfoManager();

  public info: DccExInfo | undefined;

  constructor(connectionId: string) {
    super(connectionId);
  }

  public setFunction(
    train: Train,
    connection: Connection,
    value: string,
    state: boolean,
  ): void {
    connection.write(Buffer.from(`<F ${train.address} ${value} ${state}>`));
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

  public processCommand(command: Buffer) {
    const text = command.toString("utf8").trim();
    this.triggerParsedOutput(text);

    let updated = false;

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
    } else if (text.startsWith("<i") || text.startsWith("<#")) {
      this.info = this.infoManager.processCommand(text, this.info);
      updated = true;
    }

    if (updated) {
      this.notifyListeners();
    }
  }
}
