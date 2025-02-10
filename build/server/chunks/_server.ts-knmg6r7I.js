import { C as ConnectionTypes } from './protocols-BWs_B1An.js';
import { L as LayoutServerHandler } from './layoutHandler.server.svelte-CPQsJ-Rr.js';
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
  const { id } = params;
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) {
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  }
  try {
    const data = await request.json();
    if (data.connName === void 0 || data.protocol === void 0 || data.connType === void 0) {
      return new Response(
        JSON.stringify({ message: "Missing required fields: connName, protocol, and connType are required" }),
        { status: 400 }
      );
    }
    let connection;
    switch (data.connType) {
      case ConnectionTypes.Emulator:
        connection = layout.createEmulatorConnection(data.protocol, data.connName);
        break;
      case ConnectionTypes.Serial:
        if (data.serialPath === void 0 || data.serialBaudRate === void 0) {
          return new Response(JSON.stringify({ message: "Missing required fields: serialPath and serialBaudRate are required for serial connections" }), { status: 400 });
        }
        connection = layout.createSerialConnection(data.protocol, data.path, data.baudRate, data.connName);
        break;
      default:
        return new Response(JSON.stringify({ message: "Invalid connection type" }), { status: 400 });
    }
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
};

export { POST };
//# sourceMappingURL=_server.ts-knmg6r7I.js.map
