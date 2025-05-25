import { ConnectionType } from "$lib/client/Protocols/protocols";
import type { HardwareClass } from "../hardware";


export class EmulatorConnection implements HardwareClass {
  public isConnected: boolean = false;
  public connType: ConnectionType = "Emulator";


  private dataReceived: ((data: string) => void) | null = null;
  public onDataReceived(callback: (data: string) => void) {
    this.dataReceived = callback;
  }


  connect(): Promise<string> {
    this.isConnected = true;
    return Promise.resolve("Connected to Emulator");
  }


  disconnect(): Promise<string> {
    this.isConnected = false;
    return Promise.resolve("Disconnected from Emulator");
  }

  write(command: string) {
    if (this.dataReceived) {

      command = command.trim();

      switch (true) {
        // ✅ Power Control: Turn Power On/Off
        case /^<0>$/.test(command): // Power Off
          this.dataReceived("<p0>"); // DCC-EX Response: Power OFF
          break;
        case /^<1>$/.test(command): // Power On
          this.dataReceived("<p1>"); // DCC-EX Response: Power ON
          break;

        /**
         * Train Throttle Control: <t cab speed dir>
         * cab: DCC Address of decoder
         * speed: 0-127 or -1 for emergency stop
         * dir: 1 = forward OR 0 = reverse
         **/
        // Example: <t 3 30 1> (Train 3 at Speed 30, Direction 1=Forward)
        case /^<t (\d+) (-1|\d|\d{2}|1[012][0-9]) ([01])>$/.test(command): {
          const match = command.match(/^<t (\d+) (-1|\d|\d{2}|1[012][0-9]) ([01])>$/);
          if (match) {
            const cab = parseInt(match[1]); // Loco ID
            const speed = parseInt(match[2]); // Speed (0-127, -1 = Emergency Stop)
            const direction = parseInt(match[3]); // 1 = Forward, 0 = Reverse

            // Convert speed to DCC speedByte format
            let speedByte = 0;
            if (speed === -1) {
              speedByte = direction === 1 ? 129 : 1; // 129 (Forward Emergency Stop), 1 (Reverse Emergency Stop)
            } else if (speed === 0) {
              speedByte = direction === 1 ? 128 : 0; // 128 (Forward Stop), 0 (Reverse Stop)
            } else {
              speedByte = direction === 1 ? 130 + speed - 1 : 2 + speed - 1; // Speed encoding
            }

            // Function Map (Placeholder: Assuming default function map = 0)
            const functionMap = 0;

            this.dataReceived(`<l ${cab} 0 ${speedByte} ${functionMap}>`);
          }
          break;
        }

        // Train Function Control: <F cab funcID state>
        case /<F (\d+) (\d|[0-6][0-8]) ([01])>/.test(command): {
          const match = command.match(/<F (\d+) (\d|[0-6][0-8]) ([01])>/);
          if (match) {
            const cab = match[1];
            const functionID = match[2] as unknown as number;
            const state = match[3];

            this.dataReceived(`<l ${cab} 0 56 ${state === "1" ? 1 << functionID : 0}>`);
          }
          break;
        }

        // ✅ Get Power Status: <q> (Returns <p1> for ON, <p0> for OFF)
        case /^<q>$/.test(command):
          this.dataReceived("<p1>"); // Example Response: Power is ON
          break;

        // ✅ Get Loco Information: <L>
        case /^<L>$/.test(command):
          this.dataReceived("<l 3 0 50 0>"); // Example Response: Loco 3, SpeedByte 50, FunctionMap 0
          break;

        // ✅ Get DCC-EX Status: <s>
        case /^<s>$/.test(command):
          this.dataReceived("<s DCC-EX 5.1 READY>"); // Example Response: DCC-EX Version 5.1, READY
          break;

        // ✅ Default Case: Unknown Command
        default:
          this.dataReceived("<X Unknown Command>" + command); // DCC-EX convention: <X Error Message>
          break;
      }
    }
  }

  toJson() {
    return JSON.stringify({
      connType: this.connType
    });
  }
}