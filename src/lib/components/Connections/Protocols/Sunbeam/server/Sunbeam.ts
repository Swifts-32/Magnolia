import { SensorTable } from "#lib/server/db/schema/sensors.ts";
import { db } from "#lib/server/db/index.ts";
import { and, eq } from "drizzle-orm";
import type { SunbeamBlockStatus } from "#lib/components/Connections/Protocols/Sunbeam/SunbeamTypes.ts";
import { BaseProtocol } from "../../BaseProtocol";
import type { ConnectionProtocol } from "../../protocolTypes";

export class Sunbeam extends BaseProtocol {
  public protocolType: ConnectionProtocol = "Sunbeam";

  constructor(connectionId: string) {
    super(connectionId);
  }

  public async processCommand(command: Buffer): Promise<void> {
    const text = command.toString("utf8").trim();
    this.triggerParsedOutput(text);

    try {
      const data = JSON.parse(text);

      if (data && data.address && data.state) {
        const address = String(data.address);
        const state = data.state as SunbeamBlockStatus;

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

        // Notify registered live listeners that a sensor update occurred
        this.notifyListeners();
      }
    } catch (err) {
      console.error("Error processing Sunbeam command: ", err);
    }
  }
}
