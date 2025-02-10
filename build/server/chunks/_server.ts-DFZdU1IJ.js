import { C as ConnectionTypes } from './protocols-BWs_B1An.js';
import { L as LayoutServerHandler, E as EmulatorConnection, S as SerialConnection } from './layoutHandler.server.svelte-CPQsJ-Rr.js';
import 'clsx';
import 'path';
import 'url';
import 'serialport';
import 'module';
import 'fs';
import './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import './index2-DmlwT2z5.js';
import './utils-DYrZMOqC.js';

const POST = async ({ request, params }) => {
  const { id, connUUID } = params;
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) {
    return new Response(
      JSON.stringify({ message: `${id} is not a valid layout.` }),
      { status: 404 }
    );
  }
  let connection = layout.connections.get(connUUID);
  if (!connection) {
    return new Response(
      JSON.stringify({ message: `Connection ${connUUID} not found.` }),
      { status: 404 }
    );
  }
  try {
    const data = await request.json();
    if (data.connName) connection.name = data.connName;
    if (data.protocol) connection.protocol = data.protocol;
    switch (data.connType) {
      case ConnectionTypes.Serial: {
        if (data.serialPath === void 0 || data.serialBaudRate === void 0) {
          return new Response(
            JSON.stringify({ message: `Invalid serial connection: Path is: ${data.serialPath} or Baud Rate is: ${data.serialBaudRate}` }),
            { status: 400 }
          );
        }
        connection.hardware = new SerialConnection(data.serialPath, data.serialBaudRate);
        break;
      }
      case ConnectionTypes.Emulator: {
        connection.hardware = new EmulatorConnection();
        break;
      }
      default:
        return new Response(
          JSON.stringify({ message: `Invalid connection type: ${data.connType}` }),
          { status: 400 }
        );
    }
    layout.connections.set(connUUID, connection);
    LayoutServerHandler.saveLayouts();
    return new Response(
      JSON.stringify({
        message: "Connection updated successfully",
        connection
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Invalid request body" }),
      { status: 400 }
    );
  }
};

export { POST };
//# sourceMappingURL=_server.ts-DFZdU1IJ.js.map
