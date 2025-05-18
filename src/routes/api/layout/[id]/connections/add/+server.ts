import type { LayoutUUID } from "$lib/client/LayoutClient.svelte.js";
import { ConnectionTypes } from "$lib/client/Protocols/protocols";
import { Connection } from "$lib/server/Connections/connection.svelte.js";
import { EmulatorConnection } from "$lib/server/Connections/Hardware/Emulator/Emulator.server.js";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte";

export const POST = async ({ request, params }) => {
  const { id } = params;

  const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);
  if (!layout) {
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  }

  try {
    const data = await request.json();

    const connName = data.connName;
    const protocol = data.protocol;
    const connType = data.connType;

    // Validate required fields
    if (!connName || !protocol || !connType) {
      return new Response(
        JSON.stringify({ message: 'Failed to crate connection - Undefined fields: connName, protocol, and/or connType' }),
        { status: 400 }
      );
    }

    const connection: Connection = new Connection(crypto.randomUUID(), data.connName, data.protocol, new EmulatorConnection())

    switch (data.connType) {
      case ConnectionTypes.Serial:
        const serialPath = data.serialPath;
        const serialBaudRate = data.serialBaudRate;

        if (!serialPath || !serialBaudRate) {
          return new Response(JSON.stringify({ message: 'Missing required fields: serialPath and serialBaudRate are required for serial connections' }), { status: 400 });
        }

        connection.addHardware(new SerialConnection(serialPath, serialBaudRate));
        break;

      default:
        return new Response(JSON.stringify({ message: 'Invalid connection type' }), { status: 400 });
    }

    layout.createConnection(connection);
    LayoutServerHandler.saveLayouts();

    return new Response(
      JSON.stringify({
        message: `Connection created successfully on layout: ${layout.name}`,
        connUUID: connection.uuid
      }),

      { status: 201 }

    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Invalid request body: ${error}` }),
      { status: 400 }
    );

  }
}