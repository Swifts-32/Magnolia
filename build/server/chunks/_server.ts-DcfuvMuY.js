import { L as LayoutServerHandler } from './layoutHandler.server.svelte-CPQsJ-Rr.js';
import './index-DyoisQP2.js';
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
  const { id } = params;
  if (!id) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  let layout = LayoutServerHandler.layouts.get(id);
  if (!layout) return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  return new Response(layout.createStream(), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-DcfuvMuY.js.map
