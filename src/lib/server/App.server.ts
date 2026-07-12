import { eq } from "drizzle-orm";
import { Connection } from "./Connections/Connection.server";
import { db } from "./db";
import { ConnectionTable } from "./db/schema/connection";

class app {
  private connections: Map<string, Connection> = new Map();

  public async loadConnection(id: string) {
    const connections = await db.select().from(ConnectionTable).where(eq(ConnectionTable.uuid, id));;
    const connection = connections[0];

    const appConnection = new Connection(connection.uuid, connection.name, connection.hardware, connection.protocol, connection.layoutUuid);
    this.connections.set(appConnection.id, appConnection);
  }

  public async unloadConnection(id: string): Promise<boolean> {
    const connection = this.connections.get(id);
    if (!connection) return true;

    const result = await connection.disconnect();
    console.log(`Disconnected Connection: ${result}`);

    return this.connections.delete(id);
  }

  public async getConnection(id: string): Promise<Connection | undefined> {
    if (!this.connections.has(id)) {
      await this.loadConnection(id);
    }

    return this.connections.get(id);
  }

}

export const App = new app();