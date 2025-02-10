import { L as LayoutServerHandler } from './layoutHandler.server.svelte-CPQsJ-Rr.js';
import 'clsx';
import 'path';
import 'url';
import 'serialport';
import './protocols-BWs_B1An.js';
import 'module';
import 'fs';
import './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import './index2-DmlwT2z5.js';
import './utils-DYrZMOqC.js';

const GET = async ({ params, url }) => {
  let { id, connUUID } = params;
  let data = url.searchParams.get("data");
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) {
    return new Response(JSON.stringify({ message: `Layout doesn't exist on ${id}` }), { status: 404 });
  }
  const connection = layout.connections.get(connUUID);
  if (!connection) {
    return new Response(JSON.stringify({ message: `Connection does not exist on layout: ${id}` }), { status: 406 });
  } else if (!connection.hardware.isConnected) {
    return new Response(JSON.stringify({ message: `Connection ${connection.name} is not connected on layout ${id}` }), { status: 406 });
  } else if (!data) {
    return new Response(JSON.stringify({ message: `No data to write to ${id} on connection ${connection.name}` }), { status: 401 });
  }
  connection.write(data);
  return new Response(JSON.stringify({ message: `Sent: ${data} to ${id} on connection ${connection.name}` }), { status: 200 });
};

export { GET };
//# sourceMappingURL=_server.ts-uGS84qVY.js.map
