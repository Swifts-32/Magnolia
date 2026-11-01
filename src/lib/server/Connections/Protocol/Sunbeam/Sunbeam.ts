import type { ConnectionProtocol } from "#lib/types/protocolConstants.ts";
import type EventEmitter from "events";
import type { IProtocol } from "../IProtocol";
import { getLayoutSensors } from "#lib/client/Sensors.remote.ts";
import { SensorTable } from "#lib/server/db/schema/sensors.ts";
import { db } from "#lib/server/db/index.ts";
import { and, eq } from "drizzle-orm";

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

  public async processCommand(command: Buffer): Promise<void> {
    const text = command.toString("utf8").trim();
    this._onParsedOutput?.(text);

    try {
      const data = JSON.parse(text);

      // Check if the incoming SSE event is a sensor state update
      // Adjust the condition keys (e.g., data.type, data.address, data.state)
      // to match your Sunbeam hardware's exact JSON payload structure.
      if (data && data.address && data.state) {
        const address = String(data.address);
        const state = data.state as "active" | "inactive" | "unknown";

        // Update the sensor in the database matching this connection and address
        await db
          .update(SensorTable)
          .set({ state })
          .where(
            and(
              eq(SensorTable.connectionId, this.connectionId),
              eq(SensorTable.address, address),
            ),
          );
      }
    } catch (err) {
      console.error("Error processing Sunbeam command: ", err);
    }
  }
}
