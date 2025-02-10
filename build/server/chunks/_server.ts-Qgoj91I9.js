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

const GET = async ({ params }) => {
  let { id, connUUID } = params;
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  let connection = layout.connections.get(connUUID);
  if (!connection) return new Response(JSON.stringify({ message: `Connection does not exist on layout: ${id}` }), { status: 406 });
  try {
    const result = await connection.connect();
    return new Response(JSON.stringify({ message: result }), { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ message: errorMessage }), { status: 400 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-Qgoj91I9.js.map
