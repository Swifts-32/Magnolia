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

const POST = async ({ request }) => {
  try {
    const data = await request.json();
    if (data.layoutName == void 0) {
      return new Response(
        JSON.stringify({ message: "Missing required fields: layoutName is required" }),
        { status: 400 }
      );
    }
    LayoutServerHandler.addNewLayout(data.layoutName);
    return new Response(
      JSON.stringify({
        message: "Layout created successfully"
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Invalid request body" }),
      { status: 400 }
    );
  }
};

export { POST };
//# sourceMappingURL=_server.ts-KbBq71wY.js.map
