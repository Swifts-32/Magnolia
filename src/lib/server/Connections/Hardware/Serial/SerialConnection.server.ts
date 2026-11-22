import type { ISerialConnection } from "../IHardware";
import type { ConnectionHardwareList } from "#lib/types/hardwareConstants.js";
import { spawn } from "node:child_process";

export class SerialConnection implements ISerialConnection {
  public path: string;
  public baudRate: number;
  public connType: ConnectionHardwareList = "Serial";

  private reader: ReturnType<typeof spawn> | null = null;
  private connected = false;

  private dataReceived: ((data: Buffer) => void) | null = null;
  public onDataReceived(callback: (data: Buffer) => void) {
    this.dataReceived = callback;
  }

  public get isConnected(): boolean {
    return this.connected;
  }

  constructor(path: string, baudRate: number) {
    this.path = path;
    this.baudRate = baudRate;
  }

  public async connect(): Promise<boolean> {
    try {
      await new Promise<void>((resolve, reject) => {
        const stty = spawn("stty", [
          "-F",
          this.path,
          this.baudRate.toString(),
          "raw",
          "-echo",
        ]);

        stty.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`stty exited ${code}`));
        });
      });

      this.reader = spawn("cat", [this.path]);
      this.connected = true;
      const reader = this.reader;

      reader.on("close", () => {
        console.log("Serial connection closed");
        this.connected = false;
        this.reader = null;
      });
      reader.on("error", (err) => {
        console.error("Serial connection error:", err);
        this.connected = false;
        this.reader = null;
      });

      if (!reader.stdout) {
        throw new Error("Failed to create stdout stream");
      }

      let buffer = "";

      reader.stdout.on("data", (chunk: Buffer) => {
        buffer += chunk.toString("utf8");

        const lines = buffer.split(/\r?\n/);

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const cleaned = line.trim();

          if (!cleaned) continue;
          this.dataReceived?.(Buffer.from(cleaned, "utf8"));
        }
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async disconnect(): Promise<boolean> {
    if (this.reader) {
      this.reader.kill();
      this.reader = null;
    }

    this.connected = false;
    return true;
  }

  public async write(data: Buffer) {
    if (!this.connected) {
      throw new Error("Serial port is not connected");
    }

    let text = data.toString("utf8");

    if (!text.endsWith("\r\n")) {
      text += "\r\n";
    }

    const proc = spawn("sh", [
      "-c",
      `printf '${text.replace(/'/g, "'\\''")}' > ${this.path}`,
    ]);

    await new Promise((resolve) => {
      proc.on("close", resolve);
    });
  }
}
