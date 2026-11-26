export type DccExDirection = "forward" | "reverse";

export interface DccExLoco {
  cab: number;
  speedByte: number;
  speed: number; // decoded 0–127, -1 = emergency stop
  direction: DccExDirection;
  functMap: number; // bitmask
}

export function handleLocoBroadcast(line: string): DccExLoco | undefined {
  if (!line.startsWith("<l") || !line.endsWith(">")) return;

  const content = line.slice(2, -1).trim();
  const parts = content.split(/\s+/);

  if (parts.length < 4) return;

  const cab = Number(parts[0]);
  const speedByte = Number(parts[2]);
  const functMap = Number(parts[3]);

  if (isNaN(cab) || isNaN(speedByte) || isNaN(functMap)) return;

  const { speed, direction } = decodeSpeedByte(speedByte);

  const loco: DccExLoco = {
    cab,
    speedByte,
    speed,
    direction,
    functMap,
  };

  return loco;
}

function decodeSpeedByte(speedByte: number): {
  speed: number;
  direction: DccExDirection;
} {
  const isForward = speedByte >= 128;
  const direction: DccExDirection = isForward ? "forward" : "reverse";

  if (speedByte === 1 || speedByte === 129) {
    return { speed: -1, direction: speedByte < 128 ? "reverse" : "forward" };
  }

  // Emergency stop check (1 for reverse, 129 for forward)
  if (speedByte === 1 || speedByte === 129) {
    return { speed: -1, direction };
  }

  if (speedByte === 0) {
    return { speed: 0, direction: "reverse" };
  }

  // Stop check (0 for reverse, 128 for forward)
  if (speedByte === 0 || speedByte === 128) {
    return { speed: 0, direction };
  }

  // Mathematical offset for speeds 1–126
  // Reverse: 2–127 maps to 1–126 (offset by 1)
  // Forward: 130–255 maps to 1–126 (offset by 129)
  const speed = isForward ? speedByte - 129 : speedByte - 1;

  return { speed: Math.max(0, speed), direction };
}
