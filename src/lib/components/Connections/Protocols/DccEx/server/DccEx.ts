import { DccExLocoManager } from "./modules/DccExLoco";
import type { ConnectionProtocol } from "#lib/components/Connections/Protocols/protocolConstants.js";
import type { ITrainProtocol } from "../../IProtocol";
import type { TrackStatusEntry } from "../DccExTypes";
import { TrackManager } from "./modules/DccExTrackManager";
import type { TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "#lib/components/Connections/Connection.server.ts";
import type { ConnectionHardwareList } from "#lib/components/Connections/Hardware/hardwareConstants.ts";
import { BaseProtocol } from "../../BaseProtocol";

export class DccEx extends BaseProtocol implements ITrainProtocol {
  public static readonly protocolType: ConnectionProtocol = "DccEx";
  public static readonly protocolName = "DCC EX";
  public static readonly allowedHardware: readonly ConnectionHardwareList[] = [
    "Serial",
    "Emulator",
  ];

  public protocolType: ConnectionProtocol = DccEx.protocolType;
  public readonly supportsTrains = true;

  public locoManager: DccExLocoManager = new DccExLocoManager();
  public trackStatus: TrackStatusEntry[] = [];

  constructor(connectionId: string) {
    super(connectionId);
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
