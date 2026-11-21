import type { ISerialConnection } from "../IHardware";
import type { ConnectionHardwareList } from "#lib/types/hardwareConstants.js";
import { SerialPort, readlineParser } from "bun-serialport";

export class SerialConnection implements ISerialConnection {
  private serialPort: SerialPort | null = null;

  public path: string;
  public baudRate: number;
  public connType: ConnectionHardwareList = "Serial";

  private dataReceived: ((data: Buffer) => void) | null = null;
  public onDataReceived(callback: (data: Buffer) => void) {
    this.dataReceived = callback;
  }

  public get isConnected(): boolean {
    return this.serialPort?.isOpen ?? false;
  }

  constructor(path: string, baudRate: number) {
    this.path = path;
    this.baudRate = baudRate;
  }

  public async connect(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.serialPort = new SerialPort({
          path: this.path,
          baudRate: this.baudRate,
          autoOpen: false,
        });

        const lines = this.serialPort.pipe(readlineParser());

        lines.on("data", (line: string) => {
          if (this.dataReceived) {
            this.dataReceived(Buffer.from(line.trim()));
          }
        });

        this.serialPort
          .open()
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            reject(`Failed to open port on ${this.path}: ${err.message}`);
          });
      } catch (e) {
        reject(`Error creating serial connection: ${e}`);
      }
    });
  }

  public disconnect(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.serialPort && this.serialPort.isOpen) {
        this.serialPort
          .close()
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            reject(err.message);
          });
      } else {
        reject("Serial port does not exist or is already closed");
      }
    });
  }

  public async write(data: Buffer) {
    if (this.serialPort?.isOpen) {
      try {
        await this.serialPort.write(data);
      } catch (err: any) {
        console.log("Write error: ", err?.message);
      }
    } else {
      console.log("Port is not open.");
    }
  }
}
