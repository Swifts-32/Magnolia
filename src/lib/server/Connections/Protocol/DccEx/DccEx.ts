import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type { IProtocol } from "../IProtocol";
import { DccExLocoManager } from "./DccExLoco";
import type EventEmitter from "events";

export type DccExTrackStates = "PROG" | "MAIN" | "MAIN_INV" | "MAIN_AUTO" | "DC" | "DCX" | "DC_INV" | "NONE";
export type DccExTrackPower = "ON" | "OFF" | "UNKNOWN";

export class DccEx implements IProtocol {
  public protocolType: ConnectionProtocol = "DccEx";
  public connectionId: string;

  public locoManager: DccExLocoManager = new DccExLocoManager();

  private events: EventEmitter | null = null;

  public setEventEmitter(emitter: EventEmitter): void {
    this.events = emitter;
  }

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public trackStatus: {
    trackletter: string, // A -> H
    state: DccExTrackStates,
    power: DccExTrackPower,
    cab?: number,
    current?: number,
    maxCurrent?: number,
  }[] = [];

  public processCommand(command: string) {
    console.log(`Processing DCC EX command: ${command}`);

    // Loco broadcasts: <l cab reg speedByte functMap>
    if (command.startsWith("<l")) {
      this.locoManager.handleLocoBroadcast(command);
      
      this.events?.emit("update", {
        connectionId: this.connectionId,
        type: "locos",
      })
      return;
    }

    // Track manager messages 
    if (command.startsWith("<=")) {
      this.processTrackManagerCommands(command);

      this.events?.emit("update", {
        connectionId: this.connectionId,
        type: "tracks",
      });
      return;
    }

    // Power broadcasts 
    if (command.startsWith("<p")) {
      this.processPowerBroadcast(command);

      this.events?.emit("update", {
        connectionId: this.connectionId,
        type: "power",
      });
      return;
    }

    // Current readings 
    if (command.startsWith("<jI")) {
      this.processCurrentList(command);
      this.events?.emit("update", {
        connectionId: this.connectionId,
        type: "currents",
      });
      return;
    }

    // Max current readings
    if (command.startsWith("<jG")) {
      this.processMaxCurrentList(command);
      this.events?.emit("update", {
        connectionId: this.connectionId,
        type: "currents",
      });
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
        power: "UNKNOWN",
        cab,
        current: 0,
        maxCurrent: 0,
      });
    }
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
    // <p1 PROG>
    // <p1 JOIN>

    const content = command.slice(2, -1).trim();
    const parts = content.split(/\s+/);

    const onOff = parts[0]; // "0" or "1"
    const track = parts[1]; // A–H, MAIN, PROG, JOIN, or undefined

    let power: DccExTrackPower =
      onOff === "1" ? "ON" :
        onOff === "0" ? "OFF" :
          "UNKNOWN";

    // -------------------------------
    // CASE 1: <p0> or <p1> (all tracks)
    // -------------------------------
    if (!track) {
      this.trackStatus = this.trackStatus.map(t => ({
        ...t,
        power
      }));

      return;
    }

    // -------------------------------
    // CASE 2: <p1 A> (single track A–H)
    // -------------------------------
    if (/^[A-H]$/.test(track)) {
      const t = this.trackStatus.find(x => x.trackletter === track);
      if (t) t.power = power;

      return;
    }

    // -------------------------------
    // CASE 3: MAIN / PROG / JOIN
    // These do NOT map to A–H directly.
    // They affect the *logical* track groups.
    // -------------------------------
    if (track === "MAIN" || track === "PROG" || track === "JOIN") {
      // MAIN and PROG are logical groups, not A–H outputs.
      // JOIN means MAIN and PROG are tied together.

      // You may want to store this separately:
      // e.g. this.mainProgPower = { power, mode: track }

      return;
    }

    console.warn("Unknown power broadcast:", command);
  }

  // ------------------------------- 
  // CURRENT LIST (<jI [...]>) 
  // ------------------------------- 
  private processCurrentList(command: string) {
    // Example: <jI [123 456 789]> 
    const match = command.match(/\[(.*?)\]/);
    if (!match) return;

    const values = match[1].trim().split(/\s+/).map(Number);

    values.forEach((value, index) => {
      const trackletter = String.fromCharCode(65 + index); // A=65 
      const t = this.trackStatus.find(x => x.trackletter === trackletter);
      if (t) t.current = value;
    });
  }

  // ------------------------------- 
  // MAX CURRENT LIST (<jG [...]>)
  // ------------------------------- 
  private processMaxCurrentList(command: string) {
    // Example: <jG [500 500 500]> 
    const match = command.match(/\[(.*?)\]/);
    if (!match) return;

    const values = match[1].trim().split(/\s+/).map(Number);

    values.forEach((value, index) => {
      const trackletter = String.fromCharCode(65 + index);
      const t = this.trackStatus.find(x => x.trackletter === trackletter);
      if (t) t.maxCurrent = value;
    });
  }
}