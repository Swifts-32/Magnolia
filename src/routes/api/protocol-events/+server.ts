import { protocolEvents } from "$lib/server/events";

export const GET = () => {
  let send: ((data: any) => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      send = (data: any) => {
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
          // Controller is closed — ignore
        }
      };

      protocolEvents.on("update", send);
    },

    cancel() {
      if (send) {
        protocolEvents.off("update", send);
        send = null;
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
};
