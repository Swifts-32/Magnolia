import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Layout, type LayoutServerJsonWeb } from './Layout.server.svelte';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { type LayoutUUID } from '$lib/client/LayoutClient.svelte';
import { SvelteMap } from 'svelte/reactivity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface LayoutServerHandlerWebJson {
  layouts: LayoutServerJsonWeb[];
}

class LayoutServerHandlerClass {
  public layouts: SvelteMap<LayoutUUID, Layout> = new SvelteMap();
  private streamControllers: Set<ReadableStreamDefaultController> = new Set();

  private static LAYOUTS_DIR = join(process.cwd(), `data`);
  private saveInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.loadSavedLayouts();

    // Auto save layoutsa
    this.saveInterval = setInterval(() => {
      this.saveLayouts();

      this.layouts.values().forEach((l) => l.loadTrainsFromServer())
    }, 5 * (60 * 1000)); // 5 minutes
  }

  public createStream(): ReadableStream {
    let streamController: ReadableStreamDefaultController;

    return new ReadableStream({
      start: (controller) => {
        streamController = controller;
        this.streamControllers.add(controller);
      },
      cancel: (reason) => {
        this.streamControllers.delete(streamController);
      }
    });
  }

  public sendClientMessage(event: string, data: string) {
    this.streamControllers.forEach(controller => controller.enqueue(`event: ${event}\ndata: ${data}\n\n`));
  }

  public shutdown() {
    this.saveLayouts();
    clearInterval(this.saveInterval);
  }

  public addNewLayout(name: string, uuid?: LayoutUUID, position: number = 0): Layout {
    const id = uuid ?? crypto.randomUUID();

    const layout = new Layout(name, id);
    layout.position = position

    this.layouts.set(layout.uuid, layout);
    this.saveLayouts();

    return layout;
  }

  public saveLayouts() {
    if (!existsSync(LayoutServerHandlerClass.LAYOUTS_DIR)) {
      mkdirSync(LayoutServerHandlerClass.LAYOUTS_DIR, { recursive: true });
    }

    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, 'layouts.json');
    writeFileSync(filePath, this.toSaveJson(), 'utf-8');

    // Notify clients
    this.sendClientMessage('Update', "Layouts");
    console.log(`Saved ${this.layouts.size} layouts`);
  }

  private loadSavedLayouts() {
    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, 'layouts.json');
    if (!existsSync(filePath)) return;

    try {
      const layoutHandlerJson = JSON.parse(readFileSync(filePath, 'utf-8'));

      for (const layoutJson of layoutHandlerJson.layouts) {
        const layout = Layout.fromJSON(layoutJson);

        if (layout) {
          this.layouts.set(layout.uuid, layout);
        }
      }

      console.log(`Loaded ${this.layouts.size} layouts`);
    } catch (error) {
      console.log('Error loading layouts:', error);
    }
  }

  public deleteLayout(uuid: LayoutUUID) {
    console.log(`Deleting layout ${uuid}`);

    this.layouts.delete(uuid);
    this.saveLayouts();
  }

  public getLayout(uuid: LayoutUUID): Layout | undefined {
    return this.layouts.get(uuid);
  }

  public toWebJson(): string {

    const data: LayoutServerHandlerWebJson = {
      layouts: Array.from(this.layouts.values()).map(layout => layout.toJSON()),
    }

    return JSON.stringify(data, null, 2);
  }

  public toSaveJson(): string {

    const data: LayoutServerHandlerWebJson = {
      layouts: Array.from(this.layouts.values()).map(layout => layout.toJSON()),
    }

    return JSON.stringify(data, null, 2);
  }
}


export const LayoutServerHandler = new LayoutServerHandlerClass();