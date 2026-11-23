import type {
  DccExTrackPower,
  DccExTrackStates,
  TrackStatusEntry,
} from "#lib/components/Protocols/DccEx/DccExTypes.ts";

export class TrackManager {
  public static processCommand(
    text: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    if (!text.startsWith("<") || !text.endsWith(">")) return trackStatus;

    // Route based on the 2-character command prefix
    switch (text.slice(0, 2)) {
      case "<=":
        return this.processTrackManagerCommand(text, trackStatus);

      case "<p":
        return this.processPowerCommand(text, trackStatus);

      case "<j":
        return this.processCurrentCommand(text, trackStatus);

      default:
        return trackStatus;
    }
  }

  private static processPowerCommand(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    // Strip '<p' and '>' -> e.g. "1 A", "0", "1 MAIN", "1 JOIN"
    const content = command.slice(2, -1).trim();
    if (!content) return trackStatus;

    const parts = content.split(/\s+/);
    const powerArg = parts[0]; // "1" or "0"
    const target = parts[1]?.toUpperCase(); // undefined, "A"-"H", "MAIN", "PROG", or "JOIN"

    if (powerArg !== "1" && powerArg !== "0") return trackStatus;
    const powerState: DccExTrackPower = powerArg === "1" ? "ON" : "OFF";

    // 1. Global power broadcast (<p1> or <p0>): updates all configured tracks (except NONE)
    if (!target) {
      return trackStatus.map((t) =>
        t.state !== "NONE" ? { ...t, power: powerState } : t,
      );
    }

    // 2. Specific track letter (<p1 A>, <p0 B>, etc.)
    if (/^[A-H]$/.test(target)) {
      return trackStatus.map((t) =>
        t.trackletter === target ? { ...t, power: powerState } : t,
      );
    }

    // 3. Mode-based broadcast (<p1 MAIN>, <p0 PROG>, <p1 JOIN>)
    switch (target) {
      case "MAIN":
        return trackStatus.map((t) =>
          t.state === "MAIN" ||
          t.state === "MAIN_INV" ||
          t.state === "MAIN_AUTO"
            ? { ...t, power: powerState }
            : t,
        );

      case "PROG":
        return trackStatus.map((t) =>
          t.state === "PROG" ? { ...t, power: powerState } : t,
        );

      case "JOIN":
        // JOIN powers on both MAIN and PROG tracks together
        return trackStatus.map((t) =>
          t.state === "MAIN" ||
          t.state === "MAIN_INV" ||
          t.state === "MAIN_AUTO" ||
          t.state === "PROG"
            ? { ...t, power: powerState }
            : t,
        );

      default:
        return trackStatus;
    }
  }

  private static processCurrentCommand(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    const match = command.match(/\[(.*?)\]/);
    if (!match) return trackStatus;

    const values = match[1].trim().split(/\s+/).map(Number);

    // Handle live current draw broadcast: <jI [mA mB ...]>
    if (command.startsWith("<jI")) {
      return trackStatus.map((t, idx) => ({
        ...t,
        current: values[idx] ?? t.current,
      }));
    }

    // Handle max current trip limit list broadcast: <jG [mA mB ...]>
    if (command.startsWith("<jG")) {
      return trackStatus.map((t, idx) => ({
        ...t,
        maxCurrent: values[idx] ?? t.maxCurrent,
      }));
    }

    return trackStatus;
  }

  private static processTrackManagerCommand(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    const content = command.slice(2, -1).trim();
    if (content === "") return trackStatus;

    const parts = content.split(/\s+/);
    const trackletter = parts[0];
    if (!trackletter || !/^[A-H]$/.test(trackletter)) return trackStatus;

    const stateArg1 = parts[1];
    const stateArg2 = parts[2];

    let state: DccExTrackStates = "NONE";
    let cab: number | undefined = undefined;

    if (stateArg1 === "MAIN" && stateArg2 === "A") {
      state = "MAIN_AUTO";
    } else if (stateArg1) {
      state = stateArg1 === "DC_INV" ? "DCX" : (stateArg1 as DccExTrackStates);
      if (stateArg2) {
        cab = Number(stateArg2);
      }
    }

    if (state === "DC_INV") state = "DCX";

    let updatedStatus = [...trackStatus];

    if (state === "PROG") {
      updatedStatus = updatedStatus.map((t) =>
        t.trackletter !== trackletter
          ? { ...t, state: "NONE", cab: undefined, power: "OFF" as const }
          : t,
      );
    }

    const existingIndex = updatedStatus.findIndex(
      (t) => t.trackletter === trackletter,
    );

    if (existingIndex >= 0) {
      updatedStatus = updatedStatus.map((t, idx) =>
        idx === existingIndex ? { ...t, state, cab, power: "OFF" as const } : t,
      );
    } else {
      updatedStatus.push({
        trackletter,
        state,
        power: "OFF",
        cab,
        current: 0,
        maxCurrent: 0,
      });
    }

    return updatedStatus;
  }
}
