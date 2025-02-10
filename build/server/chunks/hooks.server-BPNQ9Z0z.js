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

const init = async () => {
  process.on("sveltekit:shutdown", async (reason) => {
    console.log("Shutting down server:", reason);
    LayoutServerHandler.shutdown();
  });
};

export { init };
//# sourceMappingURL=hooks.server-BPNQ9Z0z.js.map
