import type { ConnectionUUID, LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { ConnectionType } from "$lib/client/Protocols/protocols";
import { EmulatorConnection } from "$lib/server/Connections/Hardware/Emulator/Emulator.server.js";
import { SerialConnection } from "$lib/server/Connections/Hardware/Serial/SerialConnection.server.js";
import { LayoutServerHandler } from "$lib/server/layoutHandler.server.svelte.js";

export const POST = async ({ request, params }) => {
  const { id, connUUID } = params;
  const layout = LayoutServerHandler.layouts.get(id as LayoutUUID);

  if (!layout) {
    return new Response(
      JSON.stringify({ message: `${id} is not a valid layout.` }),
      { status: 404 }
    );
  }

  let connection = layout.connections.get(connUUID as ConnectionUUID);
  if (!connection) {
    return new Response(
      JSON.stringify({ message: `Connection ${connUUID} not found.` }),
      { status: 404 }
    );
  }

  try {
    const data = await request.json();

    // Update basic connection properties
    if (data.connName) connection.name = data.connName;
    if (data.protocol) connection.protocol = data.protocol;

    // Update type-specific properties
    switch (data.connType) {
      case ConnectionType.Serial: {
        if (data.serialPath === undefined || data.serialBaudRate === undefined) {
          return new Response(
            JSON.stringify({ message: `Invalid serial connection: Path is: ${data.serialPath} or Baud Rate is: ${data.serialBaudRate}` }),
            { status: 400 }

          );

        }

        connection.addHardware(new SerialConnection(data.serialPath, data.serialBaudRate));
        break;
      }

      case ConnectionType.Emulator: {
        connection.addHardware(new EmulatorConnection());
        break;
      }

      default:
        return new Response(
          JSON.stringify({ message: `Invalid connection type: ${data.connType}` }),
          { status: 400 }
        );
    }

    // Update the connection in the layout
    layout.updateConnection(connection);

    return new Response(
      JSON.stringify({
        message: 'Connection updated successfully',
        connection
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Invalid request body' }),
      { status: 400 }
    );
  }
};
