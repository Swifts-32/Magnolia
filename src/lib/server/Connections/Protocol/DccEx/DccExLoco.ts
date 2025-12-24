export type DccExDirection = "forward" | "reverse";

export interface DccExLocoState {
  cab: number;
  speedByte: number;
  speed: number; // decoded 0–127, -1 = emergency stop (for our API)
  direction: DccExDirection;
  functMap: number; // bitmask
}

export class DccExLocoManager {
  // private sendCommand: SendCommandFn;
  private locos = new Map<number, DccExLocoState>();

  // Public API -----------------------

  public getLoco(cab: number): DccExLocoState | undefined {
    return this.locos.get(cab);
  }

  public getAllLocos(): DccExLocoState[] {
    return [...this.locos.values()];
  }

  // Parse <l cab reg speedByte functMap>
  public handleLocoBroadcast(line: string) {
    // Expect something like: <l 3 0 140 1>
    if (!line.startsWith("<l") || !line.endsWith(">")) return;

    const content = line.slice(2, -1).trim();
    const parts = content.split(/\s+/);

    if (parts.length < 4) return;

    const cab = Number(parts[0]);
    // const reg = parts[1]; // unused, kept for legacy
    const speedByte = Number(parts[2]);
    const functMap = Number(parts[3]);

    const { speed, direction } = this.decodeSpeedByte(speedByte);

    const existing = this.locos.get(cab);
    const loco: DccExLocoState = {
      cab,
      speedByte,
      speed,
      direction,
      functMap
    };

    this.locos.set(cab, loco);
  }

  // <t cab> - request deliberate update
  // public async requestCabUpdate(cab: number) {
  //   await this.sendCommand(`<t ${cab}>`);
  // }


  // <F cab funct state> - functions on/off
  // public async setFunction(
  //   cab: number,
  //   funct: number,
  //   state: 0 | 1
  // ) {
  //   await this.sendCommand(`<F ${cab} ${funct} ${state}>`);
  // }

  // // <f cab byte1 [byte2]> - legacy
  // public async legacyFunction(
  //   cab: number,
  //   byte1: number,
  //   byte2?: number
  // ) {
  //   const cmd = byte2 != null
  //     ? `<f ${cab} ${byte1} ${byte2}>`
  //     : `<f ${cab} ${byte1}>`;

  //   await this.sendCommand(cmd);
  // }

  // // <- [cab]> - remove one or all locos from reminders
  // public async removeLoco(cab?: number) {
  //   if (cab == null) {
  //     await this.sendCommand(`<->`);
  //     this.locos.clear();
  //   } else {
  //     await this.sendCommand(`<- ${cab}>`);
  //     this.locos.delete(cab);
  //   }
  // }

  // // <D speedsteps>
  // public async setSpeedSteps(mode: "SPEED28" | "SPEED128") {
  //   await this.sendCommand(`<D ${mode}>`);
  // }

  // // <m [type] | [cab acceleration [deceleration]]>
  // public async setMomentumMode(type: "LINEAR" | "POWER") {
  //   await this.sendCommand(`<m ${type}>`);
  // }

  // public async setLocoMomentum(
  //   cab: number,
  //   acceleration: number,
  //   deceleration?: number
  // ) {
  //   const cmd = deceleration != null
  //     ? `<m ${cab} ${acceleration} ${deceleration}>`
  //     : `<m ${cab} ${acceleration}>`;

  //   await this.sendCommand(cmd);
  // }

  // Helpers --------------------------

  private decodeSpeedByte(speedByte: number): {
    speed: number; // 0–127, -1 = emergency stop
    direction: DccExDirection;
  } {
    // From docs:
    // reverse: 2–127 = speed 1–126, 0 = stop, 1 = emergency stop
    // forward: 130–255 = speed 1–126, 128 = stop, 129 = emergency stop

    if (speedByte === 1 || speedByte === 129) {
      return { speed: -1, direction: speedByte < 128 ? "reverse" : "forward" };
    }

    if (speedByte === 0) {
      return { speed: 0, direction: "reverse" };
    }

    if (speedByte === 128) {
      return { speed: 0, direction: "forward" };
    }

    if (speedByte >= 2 && speedByte <= 127) {
      return { speed: speedByte - 1, direction: "reverse" };
    }

    if (speedByte >= 130 && speedByte <= 255) {
      return { speed: speedByte - 129, direction: "forward" };
    }

    // Fallback – shouldn't happen if firmware behaves
    return { speed: 0, direction: "forward" };
  }
}

