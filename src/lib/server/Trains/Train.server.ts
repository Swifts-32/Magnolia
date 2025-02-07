import type { FunctionIcons, FunctionModes } from "../../../services/train.svelte";
import { ServerTrainFunctions } from "./Functions.server";

export class ServerTrain {
    public address: number;
    public name: string;
    public functions: Map<number, ServerTrainFunctions> = new Map();

    constructor(address: number, name: string, s: string) {
        this.address = address;
        this.name = name;
    }
    
    addFunction(id: number, icon: FunctionIcons, mode: FunctionModes) {
        this.functions.set(id, new ServerTrainFunctions(id, icon, mode));
    }
    
    toJSON() {
        return {
            address: this.address,
            name: this.name,
            functions: Array.from(this.functions.entries()).map(([id, funct]) => funct.toJSON()),
        };
    }

}