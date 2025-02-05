import type { Direction } from "../../../../(app)/layouts/[id]/throttle/throttle.js";
import { LayoutServerHandler } from "../../../../../lib/server/LayoutHandler.server.svelte.js";

export interface LocoSpeed {
    addr: number,
    speed: number,
    direction: Direction,
}

function isValidSpeed(data: any): data is LocoSpeed {
    return (
        typeof data.addr === "number" &&
        typeof data.speed === "number" &&
        typeof data.direction === "number"
    );
}

export const POST = async ({ request }) => {
    const body = await request.json();

    // if (isValidSpeed(body)) {
    //     if (body.speed >= 0 && body.speed <= 127) {
    //         LayoutHandler.write(`<t ${body.addr} ${body.speed} ${body.direction}>`)
    //         return new Response(JSON.stringify({ message: "Set Speed" }), { status: 201 });
    //     }
    // }
    
    return new Response(JSON.stringify({ message:  "Failed to set speed"}), { status: 401 });
}