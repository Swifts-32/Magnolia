import type { DccExTrackPower, TrackStatusEntry } from "./DccExTrackManager";

export class DccExPowerManager {
  public processPowerBroadcast(
    command: string,
    trackStatus: TrackStatusEntry[],
  ): TrackStatusEntry[] {
    const content = command.slice(2, -1).trim();
    const parts = content.split(/\s+/);

    const onOff = parts[0];
    const track = parts[1];

    let power: DccExTrackPower =
      onOff === "1" ? "ON" : onOff === "0" ? "OFF" : "UNKNOWN";

    if (!track) {
      return trackStatus.map((t) => ({ ...t, power }));
    }

    if (/^[A-H]$/.test(track)) {
      return trackStatus.map((t) =>
        t.trackletter === track ? { ...t, power } : t,
      );
    }

    return trackStatus;
  }
}
