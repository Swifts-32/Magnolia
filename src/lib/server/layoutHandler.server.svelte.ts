import { ConnectionProtocols } from '$lib/client/Protocols/protocols';
import { join } from 'path';
import { Layout } from './Layout.server.svelte';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { ConnectionTypes } from '$lib/client/Protocols/protocols';
import type { ISerialConnection } from './Connections/Hardware/hardware';
import { LayoutClient, type LayoutUUID } from '$lib/client/LayoutClient.svelte';

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

        // Process signal handlers
        if (typeof process !== "undefined") {
            process.on("SIGINT", () => {
                this.cleanup();
                process.exit(0);
            });

            process.on("SIGTERM", () => {
                this.cleanup();
                process.exit(0);
            });
        }
    }

    private cleanup() {
        this.saveLayouts();
        clearInterval(this.saveInterval);
        console.log("Cleaned up LayoutServerHandler");
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
    }

    private loadSavedLayouts() {
        const filePath = join(LayoutServerHandlerClass.LAYOUTS_DIR, 'layouts.json');
        if (!existsSync(filePath)) {
            return;
        }

        try {
            const layoutsData = JSON.parse(readFileSync(filePath, 'utf-8'));

            for (const layoutData of layoutsData) {
                if (layoutData.uuid == undefined || layoutData.name == undefined || layoutData.position == undefined) {
                    console.warn(`Invalid layout data, ${layoutData.uuid} ${layoutData.name} ${layoutData.position}`);
                    return;
                }


                const layout = new Layout(layoutData.name, layoutData.uuid);
                layout.position = layoutData.position;

                // Recreate connections
                for (const conn of layoutData.connections) {
                    if (conn.uuid == undefined || conn.name == undefined || conn.protocol == undefined || conn.hardware.type == undefined) {
                        console.warn(`Invalid connection data`);
                        return;
                    }

                    switch (conn.hardware.type) {
                        case ConnectionTypes.Serial:
                            layout.createSerialConnection(
                                conn.protocol,
                                conn.hardware.config.path,
                                conn.hardware.config.baudRate,
                                conn.name
                            );
                            break;
                        case ConnectionTypes.Emulator:
                            layout.createEmulatorConnection(conn.protocol, conn.name);
                            break;
                        default:
                            console.warn(`Unknown hardware type: ${conn.hardware.type}`);
                            break;
                    }
                }


                this.layouts.set(layout.uuid, layout);
            }
            console.log(`Loaded ${this.layouts.size} layouts`);
        } catch (error) {
            console.error('Error loading layouts:', error);
        }
    }
}


export const LayoutServerHandler = new LayoutServerHandlerClass();