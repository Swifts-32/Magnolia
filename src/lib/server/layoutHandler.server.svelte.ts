import { join } from 'path';
import { Layout } from './Layout.server.svelte';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { type LayoutUUID } from '$lib/client/LayoutClient.svelte';


class LayoutServerHandlerClass {
  public layouts: Map<LayoutUUID, Layout> = new Map();

  private static LAYOUTS_DIR = 'data/layouts';
  private saveInterval: ReturnType<typeof setInterval>;


  constructor() {
    this.loadSavedLayouts();

    // Auto save layoutsa
    this.saveInterval = setInterval(() => {
      this.saveLayouts();
    }, 5 * (60 * 1000)); // 5 minutes
  }

  public shutdown() {
    this.saveLayouts();
    clearInterval(this.saveInterval);
    console.log("Shutting down LayoutServerHandler");
  }

  public addNewLayout(name: string): Layout {
    const layoutUUID = crypto.randomUUID();
    let layout = new Layout(name, layoutUUID);

    this.layouts.set(layoutUUID, layout);
    this.saveLayouts();

    return layout;
  }

  public saveLayouts() {
    if (!existsSync(LayoutServerHandlerClass.LAYOUTS_DIR)) {
      mkdirSync(LayoutServerHandlerClass.LAYOUTS_DIR, { recursive: true });
    }

    const layoutsData = Array.from(this.layouts.values()).map(layout => layout.toJSON());

    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, 'layouts.json');
    writeFileSync(filePath, JSON.stringify(layoutsData, null, 2));

    console.log(`Saved ${this.layouts.size} layouts`);
  }

  private loadSavedLayouts() {
    const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, 'layouts.json');
    if (!existsSync(filePath)) {
      return;
    }

    try {
      const layoutsData = JSON.parse(readFileSync(filePath, 'utf-8'));

      for (const layoutData of layoutsData) {

        const layout = Layout.fromJSON(layoutData);
        if (layout) {
          this.layouts.set(layout.uuid, layout);
        }
      }

      console.log(`Loaded ${this.layouts.size} layouts`);
    } catch (error) {
      console.log('Error loading layouts:', error);
    }
  }
}


export const LayoutServerHandler = new LayoutServerHandlerClass();