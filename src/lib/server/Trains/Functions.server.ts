import type { TrainFunctionIcons, TrainFunctionModes } from "$lib/types/Trains/Functions/Functions";
import type { TrainUuid } from "$lib/types/Trains/Train";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { TrainFunctionTable } from "../db/schema/trains";

export class ServerTrainFunctions {
  public value: string; // E.g. 1 for F1 or 1123.2434.35 LCC.
  public trainUuid: TrainUuid;

  public name: string = "New Function"; // User friendly name
  public icon: TrainFunctionIcons = "Text";
  public mode: TrainFunctionModes = "Toggle";
  public visible: boolean = true;
  public position: number = 0;
  public state: boolean = false;

  constructor(value: string, trainUuid: TrainUuid) {
    this.value = value;
    this.trainUuid = trainUuid;
  }

  public toJson(): string {
    return JSON.stringify({
      value: this.value,
      trainUuid: this.trainUuid,
      name: this.name,
      icon: this.icon,
      mode: this.mode,
      visible: this.visible,
      position: this.position,
      state: this.state,
    });
  }

  public static fromJson(json: any): ServerTrainFunctions | null {
    const value = json.value;
    const trainUuid = json.trainUuid;

    if (!value || !trainUuid) return null;

    const serverTrainFunctions = new ServerTrainFunctions(value, trainUuid);

    serverTrainFunctions.name = json.name;
    serverTrainFunctions.icon = json.icon;
    serverTrainFunctions.mode = json.mode;
    serverTrainFunctions.visible = json.visible;
    serverTrainFunctions.position = json.position;
    serverTrainFunctions.state = json.state;

    return serverTrainFunctions;
  }

  public static async getFunctionsFromDb(trainId: TrainUuid): Promise<Map<string, ServerTrainFunctions>> {
    const dbFuncts = await db.select().from(TrainFunctionTable).where(eq(TrainFunctionTable.trainUuid, trainId));

    const functs: Map<string, ServerTrainFunctions> = new Map();
    
    dbFuncts.forEach(dbFunct => {
      const funct = new ServerTrainFunctions(dbFunct.functValue, dbFunct.trainUuid as TrainUuid);
      funct.icon = dbFunct.icon;
      funct.mode = dbFunct.mode;
      funct.name = dbFunct.name;
      funct.position = dbFunct.position;
      funct.state = dbFunct.state;
      funct.visible = dbFunct.visible;

      functs.set(funct.value, funct);
    })

    return functs;
  }
}

