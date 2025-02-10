const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.-LF7qyy5.js",app:"_app/immutable/entry/app.GR5gRmcR.js",imports:["_app/immutable/entry/start.-LF7qyy5.js","_app/immutable/chunks/DGakJ3CQ.js","_app/immutable/chunks/CIzyzYsA.js","_app/immutable/chunks/BVi195v7.js","_app/immutable/chunks/CYgJF_JY.js","_app/immutable/chunks/Daqh6qSC.js","_app/immutable/entry/app.GR5gRmcR.js","_app/immutable/chunks/4t8cb8os.js","_app/immutable/chunks/CIzyzYsA.js","_app/immutable/chunks/CekLRRhF.js","_app/immutable/chunks/Bg9kRutz.js","_app/immutable/chunks/DmDfgG_S.js","_app/immutable/chunks/BQDrT_Pn.js","_app/immutable/chunks/BVi195v7.js","_app/immutable/chunks/DHf6IZAl.js","_app/immutable/chunks/uXg6scDQ.js","_app/immutable/chunks/Di4jkbpq.js","_app/immutable/chunks/D6FAmVVh.js","_app/immutable/chunks/DI1YOLlF.js","_app/immutable/chunks/C03E0Swq.js","_app/immutable/chunks/Daqh6qSC.js"],stylesheets:["_app/immutable/assets/Train.DKF17Rty.css"],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CmidVVOP.js')),
			__memo(() => import('./chunks/1-dFGjmKiD.js')),
			__memo(() => import('./chunks/2-dLHI4XRW.js')),
			__memo(() => import('./chunks/3-D3Zj84WQ.js')),
			__memo(() => import('./chunks/4-mOV3XEzG.js')),
			__memo(() => import('./chunks/5-CXb3V8jR.js')),
			__memo(() => import('./chunks/6-CsnrQYzu.js')),
			__memo(() => import('./chunks/7-CaWcemXf.js')),
			__memo(() => import('./chunks/8-B7dVIzSi.js')),
			__memo(() => import('./chunks/9-D6Xglegg.js')),
			__memo(() => import('./chunks/10-CeHAeJ4i.js')),
			__memo(() => import('./chunks/11-aEVSLmLi.js')),
			__memo(() => import('./chunks/12-C1TwmoJu.js')),
			__memo(() => import('./chunks/13-DwdOYiYh.js')),
			__memo(() => import('./chunks/14-D1-sPY_B.js')),
			__memo(() => import('./chunks/15-BStzlnbr.js'))
		],
		routes: [
			{
				id: "/(home)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/api/connections/serial/list",
				pattern: /^\/api\/connections\/serial\/list\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DmEonNgg.js'))
			},
			{
				id: "/api/layout",
				pattern: /^\/api\/layout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CBF2zL2X.js'))
			},
			{
				id: "/api/layout/add",
				pattern: /^\/api\/layout\/add\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-KbBq71wY.js'))
			},
			{
				id: "/api/layout/[id]",
				pattern: /^\/api\/layout\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DaOvBnz3.js'))
			},
			{
				id: "/api/layout/[id]/connections",
				pattern: /^\/api\/layout\/([^/]+?)\/connections\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CxULsUlf.js'))
			},
			{
				id: "/api/layout/[id]/connections/add",
				pattern: /^\/api\/layout\/([^/]+?)\/connections\/add\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-knmg6r7I.js'))
			},
			{
				id: "/api/layout/[id]/edit",
				pattern: /^\/api\/layout\/([^/]+?)\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-ouVnlnwI.js'))
			},
			{
				id: "/api/layout/[id]/stream",
				pattern: /^\/api\/layout\/([^/]+?)\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DcfuvMuY.js'))
			},
			{
				id: "/api/layout/[id]/trains",
				pattern: /^\/api\/layout\/([^/]+?)\/trains\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-z45GYAbO.js'))
			},
			{
				id: "/api/layout/[id]/trains/add",
				pattern: /^\/api\/layout\/([^/]+?)\/trains\/add\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-C1RDkzS0.js'))
			},
			{
				id: "/api/layout/[id]/trains/delete",
				pattern: /^\/api\/layout\/([^/]+?)\/trains\/delete\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D-I0quBT.js'))
			},
			{
				id: "/api/layout/[id]/trains/edit",
				pattern: /^\/api\/layout\/([^/]+?)\/trains\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-C3Rm9aC-.js'))
			},
			{
				id: "/api/layout/[id]/[connUUID]/connect",
				pattern: /^\/api\/layout\/([^/]+?)\/([^/]+?)\/connect\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"connUUID","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Qgoj91I9.js'))
			},
			{
				id: "/api/layout/[id]/[connUUID]/disconnect",
				pattern: /^\/api\/layout\/([^/]+?)\/([^/]+?)\/disconnect\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"connUUID","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DN1w3JuQ.js'))
			},
			{
				id: "/api/layout/[id]/[connUUID]/edit",
				pattern: /^\/api\/layout\/([^/]+?)\/([^/]+?)\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"connUUID","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DFZdU1IJ.js'))
			},
			{
				id: "/api/layout/[id]/[connUUID]/write",
				pattern: /^\/api\/layout\/([^/]+?)\/([^/]+?)\/write\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"connUUID","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-uGS84qVY.js'))
			},
			{
				id: "/(app)/layouts/[id]",
				pattern: /^\/layouts\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/panel",
				pattern: /^\/layouts\/([^/]+?)\/panel\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/panel/edit",
				pattern: /^\/layouts\/([^/]+?)\/panel\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/panel/operate",
				pattern: /^\/layouts\/([^/]+?)\/panel\/operate\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/settings",
				pattern: /^\/layouts\/([^/]+?)\/settings\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/settings/connections",
				pattern: /^\/layouts\/([^/]+?)\/settings\/connections\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/settings/trains",
				pattern: /^\/layouts\/([^/]+?)\/settings\/trains\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,4,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(app)/layouts/[id]/throttle",
				pattern: /^\/layouts\/([^/]+?)\/throttle\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(home)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 15 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
