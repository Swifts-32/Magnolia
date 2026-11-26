import {
  handleLocoBroadcast as processLocoCommand,
  type DccExLoco,
} from "./modules/DccExLocoManager";
import type { ITrainProtocol } from "../../IProtocol";
import type { TrackStatusEntry } from "../DccExTypes";
import {
  processCurrentCommand,
  processPowerCommand,
  processTrackManagerCommand,
} from "./modules/DccExTrackManager";
import type { TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "#lib/components/Connections/Connection.server.ts";
import { BaseProtocol } from "../../BaseProtocol";
import {
  processCommand as processInfoCommand,
  type DccExInfo,
} from "./modules/DccExInfoManager";
import type { ConnectionProtocol } from "../../protocolTypes";

export class DccEx extends BaseProtocol implements ITrainProtocol {
  public protocolType: ConnectionProtocol = "DccEx";
  public locos = new Map<number, DccExLoco>();
  public trackStatus: TrackStatusEntry[] = [];
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
      const loco = processLocoCommand(text);
      if (loco) {
        this.locos.set(loco.cab, loco);
        updated = true;
      }
    } else if (text.startsWith("<=")) {
      this.trackStatus = processTrackManagerCommand(text, this.trackStatus);
      updated = true;
    } else if (text.startsWith("<p")) {
      this.trackStatus = processPowerCommand(text, this.trackStatus);
      updated = true;
    } else if (text.startsWith("<j")) {
      this.trackStatus = processCurrentCommand(text, this.trackStatus);
      updated = true;
    } else if (text.startsWith("<i") || text.startsWith("<#")) {
      this.info = processInfoCommand(text, this.info);
      updated = true;
    }

    if (updated) {
      this.notifyListeners();
    }
  }
}
