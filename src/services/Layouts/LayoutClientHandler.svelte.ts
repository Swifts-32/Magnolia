import { LayoutClient, type Connections, type ConnectionUUID, type LayoutUUID } from "$lib/client/LayoutClient.svelte";
import { DccEx } from "$lib/client/Protocols/DccEx/DccEx.svelte";
import type { ConnectionTypes } from "$lib/client/Protocols/protocols";
import { ConnectionProtocols } from "$lib/client/Protocols/protocols";

class LayoutClientHandler {
    public layouts: Map<LayoutUUID, LayoutClient> = $state(new Map());

    public async refreshLayouts() {
        const json = await fetch("/api/layout").then(res => res.json());
        const layouts = json.map(([uuid, config]: [LayoutUUID, any]) => ({ uuid, config }));


        for (const layout of layouts) {
            if (!this.layouts.has(layout.uuid)) {
                // Layout does not exist, create it
                const layoutClient = await LayoutClient.create(layout.uuid, fetch);
                this.layouts.set(layout.uuid, layoutClient);
            } else {
                // Layout exists, update it
                let layoutClient = this.layouts.get(layout.uuid);
                if (!layoutClient) {

                    console.error(`Layout client not found for layout ${layout.uuid}`);
                    continue;
                }
                // TODO: Add in an update function for connections



                const res = await fetch(`/api/layout/${layout.uuid}/connections`);
                const json = await res.json();

                const serverConnections: {
                    key: ConnectionUUID,
                    protocol: ConnectionProtocols,
                    connName: string,
                    connType: ConnectionTypes,
                }[] = Array.isArray(json.message) ? json.message : [];

                let connections: Map<ConnectionUUID, Connections> = new Map();

                serverConnections.forEach((e) => {
                    let conn: Connections | null = null;

                    switch (e.protocol) {
                        case ConnectionProtocols.DCCEX:
                            conn = new DccEx(layout.uuid, e.key, e.connName, e.connType);
                            break;
                        case ConnectionProtocols.LCC:
                            console.log("No LCC connection availvle");

                            break;
                        default:
                            break;
                    }

                    if (conn) {
                        connections.set(e.key, conn);
                    }

                });

                layoutClient.connections = connections;
                await layoutClient.fetchTrains();

            }
        }
    }
}



export const layoutClientHandler = new LayoutClientHandler();