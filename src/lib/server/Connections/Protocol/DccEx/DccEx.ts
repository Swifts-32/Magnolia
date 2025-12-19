import type { ConnectionProtocol } from "$lib/client/Protocols/protocols";
import type { IProtocol } from "../IProtocol";

export type DccExTrackStates = "PROG" | "MAIN" | "MAIN_INV" | "MAIN_AUTO" | "DC" | "DCX" | "DC_INV" | "NONE";

export class DccEx implements IProtocol {
  public protocolType: ConnectionProtocol = "DccEx";

  public trackStatus: {
    trackletter: string, // A -> H
    state: DccExTrackStates,
    cab?: number,
  }[] = [];

  public processCommand(command: string) {
    console.log(`Processing DCC EX command: ${command}`);
  }
}