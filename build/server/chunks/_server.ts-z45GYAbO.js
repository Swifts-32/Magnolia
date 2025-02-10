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
  let { id } = params;
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) {
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  }
  const connections = Array.from(layout.connections.values());
  const trains = connections.flatMap((conn) => Array.from(conn.trains.values()).map((train) => train.toJSON()));
  return new Response(JSON.stringify({ message: trains }), { status: 200 });
};

export { GET };
//# sourceMappingURL=_server.ts-z45GYAbO.js.map
