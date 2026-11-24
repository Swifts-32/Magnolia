import type { ConnectionProtocol } from "#lib/components/Connections/Protocols/protocolConstants.js";
import type { TrainMotion, TrainUuid } from "#lib/components/Trains/Trains.ts";
import type { Train } from "#lib/server/db/schema/trains.ts";
import type { Connection } from "../Connection.server";

export interface IProtocol {
  protocolType: ConnectionProtocol;
  connectionId: string;
  processCommand: (command: Buffer) => void;
  onUpdate(callback: () => void): () => void;
  onParsedOutput: (callback: (data: string) => void) => void;
}

export interface ITrainProtocol {
  eStop(connection: Connection): void;
  setMotion(train: Train, connection: Connection, motion: TrainMotion): void;
}
