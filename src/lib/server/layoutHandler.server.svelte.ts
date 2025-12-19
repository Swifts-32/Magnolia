import { Layout, type LayoutServerJsonWeb } from './Layout.server.svelte';
import { type LayoutUUID } from '$lib/client/LayoutClient.svelte';
import { SvelteMap } from 'svelte/reactivity';

export interface LayoutServerHandlerWebJson {
  layouts: LayoutServerJsonWeb[];
}

class LayoutServerHandlerClass {
  // public layouts: SvelteMap<LayoutUUID, Layout> = new SvelteMap();
  // private streamControllers: Set<ReadableStreamDefaultController> = new Set();

  // constructor() {
  // }

  // public createStream(): ReadableStream {
  //   let streamController: ReadableStreamDefaultController;

  //   return new ReadableStream({
  //     start: (controller) => {
  //       streamController = controller;
  //       this.streamControllers.add(controller);
  //     },
  //     cancel: (reason) => {
  //       this.streamControllers.delete(streamController);
  //     }
  //   });
  // }

  // public sendMessage(event: string, data: string) {
  //   this.streamControllers.forEach(controller => controller.enqueue(`event: ${event}\ndata: ${data}\n\n`));
  // }

  // public addNewLayout(name: string, uuid?: LayoutUUID, position: number = 0): Layout {
  //   const id = uuid ?? crypto.randomUUID();

  //   const layout = new Layout(name, id);
  //   layout.position = position

  //   this.layouts.set(layout.uuid, layout);

  //   return layout;
  // }

  // public deleteLayout(uuid: LayoutUUID) {
  //   console.log(`Deleting layout ${uuid}`);

  //   this.layouts.delete(uuid);
  // }

  // public getLayout(uuid: LayoutUUID): Layout | undefined {
  //   return this.layouts.get(uuid);
  // }

  // public toWebJson(): string {

  //   const data: LayoutServerHandlerWebJson = {
  //     layouts: Array.from(this.layouts.values()).map(layout => layout.toJSON()),
  //   }

  //   return JSON.stringify(data, null, 2);
  // }
}


export const LayoutServerHandler = new LayoutServerHandlerClass();