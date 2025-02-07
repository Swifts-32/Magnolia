import type { FunctionIcons, FunctionModes } from "../../../services/train.svelte";

export class ServerTrainFunctions {
    id: number;
    icon: FunctionIcons;
    mode: FunctionModes;
    visible: boolean = true;

    constructor(id: number, icon: FunctionIcons, mode: FunctionModes) {
        this.id = id;
        this.mode = mode;
        this.icon = icon;
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

