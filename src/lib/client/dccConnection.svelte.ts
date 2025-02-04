import { toast } from "svelte-sonner";
import { ConnectionProtocols } from "./Protocols/protocols";

export class dccConnection {
    private layoutName: string;
    public isConnected: boolean = $state(false);
    public connectionProtocol = ConnectionProtocols.DCCEX;
    
    constructor(layoutName: string) {
        this.layoutName = layoutName;
    }

    async connect() {
        const res = await fetch(`/api/layout/${this.layoutName}/dcc/connect`);
        const json = await res.json();

        if (res.ok) {
            toast.success(json.message);
            this.isConnected = true;
        } else {
            toast.error(json.message);
            this.isConnected = false;
        }
    }

    async disconnect() {
        const res = await fetch(`/api/layout/${this.layoutName}/dcc/disconnect`);
        const json = await res.json();

        this.isConnected = false;
        if (res.ok) {
            toast.success(json.message);
        } else {
            toast.error(json.message);
        }
    }


    async write(data: string) {
        const res = await fetch(`/api/layout/${this.layoutName}/dcc/write?data=${data}`);
        const json = await res.json();

        if (!res.ok) {
            toast.error(json.message);
        }
    }
}