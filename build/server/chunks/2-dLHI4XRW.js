import 'clsx';
import './Toaster.svelte_svelte_type_style_lang-Sa_-j74j.js';
import { r as redirect } from './index-DyoisQP2.js';
import { l as layoutClientHandler } from './LayoutClientHandler.svelte-BywpuRZh.js';
import './index2-DmlwT2z5.js';
import './utils-DYrZMOqC.js';
import './protocols-BWs_B1An.js';
import './Train.svelte-B8RiRVnW.js';

const load = async ({ params, fetch }) => {
  const { id } = params;
  const layout = layoutClientHandler.layouts.get(id);
  if (!layout) return redirect(300, "/");
  return {
    layout
  };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-D8BhNE0s.js')).default;
const universal_id = "src/routes/(app)/layouts/[id]/+layout.ts";
const imports = ["_app/immutable/nodes/2.DMZe0SOx.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/DmDfgG_S.js","_app/immutable/chunks/CIzyzYsA.js","_app/immutable/chunks/BQDrT_Pn.js","_app/immutable/chunks/BVi195v7.js","_app/immutable/chunks/CekLRRhF.js","_app/immutable/chunks/B90CZVMX.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/chunks/4t8cb8os.js","_app/immutable/chunks/Di4jkbpq.js","_app/immutable/chunks/KduNdR7G.js","_app/immutable/chunks/DI1YOLlF.js","_app/immutable/chunks/Ju6TuQuu.js","_app/immutable/chunks/DGakJ3CQ.js","_app/immutable/chunks/Daqh6qSC.js","_app/immutable/chunks/DgJlwljB.js","_app/immutable/chunks/uXg6scDQ.js","_app/immutable/chunks/D6FAmVVh.js","_app/immutable/chunks/CaVVGEQw.js","_app/immutable/chunks/turd0-fJ.js","_app/immutable/chunks/D3TSM_gX.js"];
const stylesheets = ["_app/immutable/assets/Train.DKF17Rty.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=2-dLHI4XRW.js.map
