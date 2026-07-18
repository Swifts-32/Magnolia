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

  public async unloadConnection(id: string) {
    const connection = this.connections.get(id);
    if (!connection) throw new Error("Connection not found");

    const result = await connection.disconnect();
    if (!result) throw new Error("Failed to disconnect connection");

    this.connections.delete(id);
    return connection;
  }

  public async getConnection(id: string): Promise<Connection | undefined> {
    if (!this.connections.has(id)) {
      await this.loadConnection(id);
    }

    return this.connections.get(id);
  }

}

export const App = new app();