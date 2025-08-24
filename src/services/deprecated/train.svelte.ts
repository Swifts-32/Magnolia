import type { ConnectionUUID } from "$lib/client/LayoutClient.svelte";

enum Direction {
    forward = 0,
    reverse = 1,
}

export type FunctionModes = "toggle" | "select"

export enum FunctionIcons {
    "Speaker",
    "Light1",
    "Light2",
    "Bell",
    "text",
}

export class Funct {
    id: number;
    icon: FunctionIcons;
    mode: FunctionModes;
    visible: boolean = true;

    state: boolean = $state(false);

    constructor(id: number, icon: FunctionIcons, mode: FunctionModes) {
        this.id = id;
        this.mode = mode;
        this.icon = icon;

        this.state = false;
    }


    toJSON() {
        return {
            id: this.id,
            icon: this.icon,
            mode: this.mode,
            visible: this.visible,
        };
    }
}


export class Train {
    functions: Map<number, Funct> = new Map();

    public name: string;
    public addr: number;
    public speed: number = $state(0);
    public connectionUUID: ConnectionUUID;
    public direction: Direction = $state(Direction.forward);


    constructor(id: number, name: string, connectionUUID: ConnectionUUID) {
        this.addr = id;
        this.name = name;
        this.connectionUUID = connectionUUID;


        for (let i = 0; i <= 28; i++) {
            this.addFunction(i, "toggle", FunctionIcons.text);
        }
    }

    addFunction(id: number, mode: FunctionModes, icon: FunctionIcons) {
        this.functions.set(id, new Funct(id, icon, mode))
    }

    removeFunction(id: number) {
        this.functions.delete(id);
    }


    //---------------------------------------------------
    setFunction(id: number, state: boolean) {
        let funct = this.functions.get(id);
        if (!funct) return;
        funct.state = state;
    }
}