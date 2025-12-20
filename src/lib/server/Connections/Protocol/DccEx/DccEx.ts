import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type { IProtocol } from "../IProtocol";
import { getTracksStatus } from "$lib/client/Connections/Protocols/DccEx.remote";
import { DccExLocoManager } from "./DccExLoco";

export type DccExTrackStates = "PROG" | "MAIN" | "MAIN_INV" | "MAIN_AUTO" | "DC" | "DCX" | "DC_INV" | "NONE";

export class DccEx implements IProtocol {
  public protocolType: ConnectionProtocol = "DccEx";
  public connectionId: string;

  public locoManager: DccExLocoManager = new DccExLocoManager();

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public trackStatus: {
    trackletter: string, // A -> H
    state: DccExTrackStates,
    cab?: number,
    power?: boolean,
    current?: number,
    maxCurrent?: number,
  }[] = [];

  public processCommand(command: string) {
    console.log(`Processing DCC EX command: ${command}`);

    // Loco broadcasts: <l cab reg speedByte functMap>
    if (command.startsWith("<l")) {
      this.locoManager.handleLocoBroadcast(command);
      return;
    }

    // Track manager messages 
    if (command.startsWith("<=")) {
      this.processTrackManagerCommands(command);
      getTracksStatus(this.connectionId).refresh();
      return;
    }

    // Power broadcasts 
    if (command.startsWith("<p")) {
      this.processPowerBroadcast(command);
      return;
    }

    // Current readings 
    if (command.startsWith("<jI")) {
      this.processCurrentList(command);
      return;
    }

    // Max current readings
    if (command.startsWith("<jG")) {
      this.processMaxCurrentList(command);
      return;
    }

  }

  private async processTrackManagerCommands(command: string) {
    if (!command.startsWith("<=") || !command.endsWith(">")) return;

    const content = command.slice(2, -1).trim(); // Strip <= and >
    const parts = content.split(/\s+/); // Split by spaces

    const trackletter = parts[0];
    let state = parts[1] as DccExTrackStates;
    const cab = parts[2] ? Number(parts[2]) : undefined;

    // Special rules from DCC-EX docs
    if (state === "DC_INV") state = "DCX";

    // If PROG is set, all other tracks must be NONE
    if (state === "PROG") {
      this.trackStatus = this.trackStatus.map(t =>
        t.trackletter !== trackletter
          ? { ...t, state: "NONE", cab: undefined }
          : t
      );
    }

    // Find existing track entry
    const existing = this.trackStatus.find(t => t.trackletter === trackletter);

    if (existing) {
      existing.state = state;
      existing.cab = cab;
    } else {
      this.trackStatus.push({
        trackletter,
        state,
        cab,
        power: false,
        current: 0,
        maxCurrent: 0,
      });
    }

    console.log("Updated track status:", this.trackStatus);
  }

  // ------------------------------- 
  // POWER BROADCASTS (<pOnOFF>)
  // -------------------------------
  private processPowerBroadcast(command: string) {
    // Examples: 
    // <p0>
    // <p1>
    // <p1 A>
    // <p1 MAIN> 
    // <p1 JOIN> 

    const content = command.slice(2, -1).trim();
    const parts = content.split(/\s+/);

    const on = parts[0] === "1";
    const track = parts[1]; // A–H, MAIN, PROG, JOIN, or undefined

    if (!track) {
      // Apply to all tracks 
      this.trackStatus = this.trackStatus.map(t => ({ ...t, power: on }));
    } else {
      const t = this.trackStatus.find(x => x.trackletter === track);
      if (t) t.power = on;
    }

    console.log("Power updated:", this.trackStatus);
  }

  // ------------------------------- 
  // CURRENT LIST (<jI [...]>) 
  // ------------------------------- 
  private processCurrentList(command: string) {
    // Example: <jI [123 456 789]> 
    const match = command.match(/ \[(.*?)\] /);
    if (!match) return;

    const values = match[1].trim().split(/\s+/).map(Number);

    values.forEach((value, index) => {
      const trackletter = String.fromCharCode(65 + index); // A=65 
      const t = this.trackStatus.find(x => x.trackletter === trackletter);
      if (t) t.current = value;
    });

    console.log("Currents updated", this.trackStatus);
  }

  // ------------------------------- 
  // MAX CURRENT LIST (<jG [...]>)
  // ------------------------------- 
  private processMaxCurrentList(command: string) {
    // Example: <jG [500 500 500]> 
    const match = command.match(/ \[(.*?)\] /);
    if (!match) return;

    const values = match[1].trim().split(/\s+/).map(Number);

    values.forEach((value, index) => {
      const trackletter = String.fromCharCode(65 + index);
      const t = this.trackStatus.find(x => x.trackletter === trackletter);
      if (t) t.maxCurrent = value;
    });

    console.log("Max currents updated:", this.trackStatus);
  }
}