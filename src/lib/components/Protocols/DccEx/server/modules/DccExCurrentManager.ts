import type { TrackStatusEntry } from "./DccExTrackManager";

export class DccExCurrentManager {
  public processCurrentList(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    const match = command.match(/\[(.*?)\]/);
    if (!match) return trackStatus;

    const values = match[1].trim().split(/\s+/).map(Number);

    return trackStatus.map((t, index) => {
      // Find matching index based on trackletter (A=0, B=1, etc.)
      const expectedIndex = t.trackletter.charCodeAt(0) - 65;
      if (values[expectedIndex] !== undefined) {
        return { ...t, current: values[expectedIndex] };
      }
      return t;
    });
  }

  public processMaxCurrentList(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    const match = command.match(/\[(.*?)\]/);
    if (!match) return trackStatus;

    const values = match[1].trim().split(/\s+/).map(Number);

    return trackStatus.map((t, index) => {
      const expectedIndex = t.trackletter.charCodeAt(0) - 65;
      if (values[expectedIndex] !== undefined) {
        return { ...t, maxCurrent: values[expectedIndex] };
      }
      return t;
    });
  }
}
