import type { ConnectionProtocol } from "#lib/components/Connections/Protocols/protocolConstants.ts";
import type { IProtocol } from "../../IProtocol";
import { SensorTable } from "#lib/server/db/schema/sensors.ts";
import { db } from "#lib/server/db/index.ts";
import { and, eq } from "drizzle-orm";
import type { SunbeamBlockStatus } from "#lib/components/Connections/Protocols/Sunbeam/SunbeamTypes.ts";
import type { ConnectionHardwareList } from "#lib/components/Connections/Hardware/hardwareConstants.ts";

export class Sunbeam implements IProtocol {
  public protocolType: ConnectionProtocol = "Sunbeam";
  public connectionId: string;

  public static readonly protocolType: ConnectionProtocol = "Sunbeam";
  public static readonly protocolName = "Sunbeam";
  public static readonly allowedHardware: readonly ConnectionHardwareList[] = [
    "WebServer",
  ];

  private updateListeners: (() => void)[] = [];

  constructor(connectionId: string) {
    this.connectionId = connectionId;
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

  private _onParsedOutput: ((data: string) => void) | null = null;
  public onParsedOutput(callback: (data: string) => void) {
    this._onParsedOutput = callback;
  }

  public async processCommand(command: Buffer): Promise<void> {
    const text = command.toString("utf8").trim();
    this._onParsedOutput?.(text);

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
