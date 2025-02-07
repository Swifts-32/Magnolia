import { ConnectionProtocols } from '$lib/client/Protocols/protocols';
import { join } from 'path';
import { Layout } from './Layout.server.svelte';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { ConnectionTypes } from '$lib/client/Protocols/protocols';
import type { ISerialConnection } from './Connections/Hardware/hardware';
import type { LayoutUUID } from '$lib/client/LayoutClient.svelte';

class LayoutServerHandlerClass {
    public layouts: Map<LayoutUUID, Layout> = new Map();

    private static LAYOUTS_DIR = 'data/layouts';
    private saveInterval: ReturnType<typeof setInterval>;


    constructor() {
        this.loadSavedLayouts();

        //TODO Remove adding default layout
        if (this.layouts.size === 0) {
            this.createDefaultLayout("L1", 3);
            this.createDefaultLayout("L2", 2);
            console.log(`Server: Created default layouts`);
        }
        else {
            console.log(`Server: Loaded ${this.layouts.size} layouts`);
        }


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




    private createDefaultLayout(name: string, noOfConnections: number) {

        let layout = this.addNewLayout(name);
        for (let i = 0; i < noOfConnections; i++) {
            layout.createEmulatorConnection(ConnectionProtocols.DCCEX, `Emulator ${i + 1}`);
        }

        console.log(`Created Default Layout ${name}`);
    }


    addNewLayout(name: string): Layout {
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

        const layoutsData = Array.from(this.layouts.entries()).map(([name, layout]) => ({
            name: layout.name,
            position: layout.position,
            uuid: layout.uuid,
            connections: Array.from(layout.connections.entries()).map(([uuid, connection]) => {
                const baseConfig = {
                    uuid,
                    name: connection.name,
                    protocol: connection.protocol,
                    hardware: {
                        type: connection.hardware.connType,
                    }
                };

                // Add hardware-specific configuration
                switch (connection.hardware.connType) {
                    case ConnectionTypes.Serial:
                        const hardware = connection.hardware as ISerialConnection;
                        return {
                            ...baseConfig,
                            hardware: {
                                ...baseConfig.hardware,
                                path: hardware.path,
                                baudRate: hardware.baudRate,
                            }
                        };
                    default:

                        return baseConfig;


                }

            })
        }));


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