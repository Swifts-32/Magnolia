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

const POST = async ({ request, params }) => {
  const { id } = params;
  const layout = LayoutServerHandler.layouts.get(id);
  if (!layout) {
    return new Response(
      JSON.stringify({ message: `${id} is not a valid layout.` }),
      { status: 404 }
    );
  }
  try {
    const data = await request.json();
    if (data.layoutName) layout.name = data.layoutName;
    LayoutServerHandler.saveLayouts();
    return new Response(
      JSON.stringify({
        message: "Layout updated successfully",
        layout
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
//# sourceMappingURL=_server.ts-ouVnlnwI.js.map
