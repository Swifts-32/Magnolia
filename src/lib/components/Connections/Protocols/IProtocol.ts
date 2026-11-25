import type { TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "../Connection.server";
import type { ConnectionHardwareList } from "../Hardware/hardwareConstants";
import type { BaseProtocol } from "./BaseProtocol";
import type { ConnectionProtocol } from "./protocolConstants";

// This interface defines what the STATIC side of a protocol class must look like
export interface IProtocolClassStatic {
  readonly protocolType: ConnectionProtocol;
  readonly protocolName: string;
  readonly allowedHardware: readonly ConnectionHardwareList[];
  new (connectionId: string): BaseProtocol; // Enforces the constructor
}

export interface ITrainProtocol {
  readonly supportsTrains: true;
  eStop(connection: Connection): void;
  setMotion(train: Train, connection: Connection, motion: TrainMotion): void;
}
