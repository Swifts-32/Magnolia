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
    return new Response(JSON.stringify({ message: `${id} is not a valid layout.` }), { status: 404 });
  }
  try {
    const data = await request.json();
    if (data.address === void 0 || data.name === void 0 || data.connUUID === void 0 || data.uuid === void 0) {
      return new Response(
        JSON.stringify({ message: "Missing required fields: address, name, connUUID, and uuid are required" }),
        { status: 400 }
      );
    }
    const newConn = layout.connections.get(data.connUUID);
    if (!newConn) {
      return new Response(JSON.stringify({ message: `Connection with uuid ${data.connUUID} not found` }), { status: 404 });
    }
    let train = layout.getTrain(data.uuid);
    if (!train) {
      return new Response(JSON.stringify({ message: `Train with uuid ${data.uuid} not found` }), { status: 404 });
    }
    train.address = data.address;
    train.name = data.name;
    train.connUUID = data.connUUID;
    if (data.functions) {
    }
    newConn.trains.set(train.uuid, train);
    LayoutServerHandler.saveLayouts();
    return new Response(
      JSON.stringify({
        message: `Train updated successfully on layout: ${layout.name}`
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Invalid request body: ${error}` }),
      { status: 400 }
    );
  }
};

export { POST };
//# sourceMappingURL=_server.ts-C3Rm9aC-.js.map
