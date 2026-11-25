import type { TrainMotion } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "../Connection.server";
import type { BaseProtocol } from "./BaseProtocol";

// This interface defines what the STATIC side of a protocol class must look like
export interface IProtocolClassStatic {
  new (connectionId: string): BaseProtocol; // Enforces the constructor
}

export interface ITrainProtocol {
  eStop(connection: Connection): void;
  setMotion(train: Train, connection: Connection, motion: TrainMotion): void;
  setFunction(
    train: Train,
    connection: Connection,
    value: string,
    state: boolean,
  ): void;
}
