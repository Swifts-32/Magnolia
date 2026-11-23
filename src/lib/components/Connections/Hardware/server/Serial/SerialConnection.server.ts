import type { ISerialConnection } from "../IHardware";
import type { ConnectionHardwareList } from "#lib/components/Connections/Hardware/hardwareConstants.js";
import { spawn } from "node:child_process";
import { open, writeFile, type FileHandle } from "node:fs/promises";
import { createReadStream, type ReadStream } from "node:fs";

export class SerialConnection implements ISerialConnection {
  public path: string;
  public baudRate: number;
  public connType: ConnectionHardwareList = "Serial";

  private readStream: ReadStream | null = null;
  private connected = false;
  private isDisconnecting = false;

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
    if (this.connected) return true;

    try {
      // 1. Configure serial port with 'clocal' (ignores modem control lines / Carrier Detect)
      // and 'cread' (enables receiver) so the port doesn't immediately drop.
      await new Promise<void>((resolve, reject) => {
        const stty = spawn("stty", [
          "-F",
          this.path,
          this.baudRate.toString(),
          "raw",
          "-echo",
          "clocal",
          "cread",
        ]);

        let sttyError = "";
        stty.stderr.on("data", (chunk) => {
          sttyError += chunk.toString();
        });

        stty.on("close", (code) => {
          if (code === 0) resolve();
          else
            reject(
              new Error(`stty exited with code ${code}: ${sttyError.trim()}`),
            );
        });
      });

      // 2. Open read stream directly using Node fs instead of spawning 'cat'
      this.readStream = createReadStream(this.path, {
        highWaterMark: 64 * 1024,
      });
      this.connected = true;
      this.isDisconnecting = false;

      const stream = this.readStream;

      stream.on("close", () => {
        if (!this.isDisconnecting) {
          console.warn("Serial connection unexpectedly closed");
        }
        this.cleanup();
      });

      stream.on("error", (err) => {
        console.error("Serial read stream error:", err);
        this.cleanup();
      });

      let buffer = Buffer.alloc(0);

      stream.on("data", (chunk: string | Buffer) => {
        const chunkBuf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        buffer = Buffer.concat([buffer, chunkBuf]);

        // Process line by line safely using buffer indexOf
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.subarray(0, newlineIndex);
          buffer = buffer.subarray(newlineIndex + 1);

          // Clean trailing \r if present
          let cleanLine = line;
          if (
            cleanLine.length > 0 &&
            cleanLine[cleanLine.length - 1] === 0x0d
          ) {
            cleanLine = cleanLine.subarray(0, cleanLine.length - 1);
          }

          if (cleanLine.length > 0) {
            this.dataReceived?.(Buffer.from(cleanLine));
          }
        }
      });

      return true;
    } catch (err) {
      console.error("Failed to connect to serial port:", err);
      this.cleanup();
      return false;
    }
  }

  public async disconnect(): Promise<boolean> {
    this.isDisconnecting = true;
    this.cleanup();
    return true;
  }

  public async write(data: Buffer): Promise<void> {
    if (!this.connected) {
      throw new Error("Serial port is not connected");
    }

    try {
      let payload = data;
      if (payload.length === 0 || payload[payload.length - 1] !== 0x0a) {
        payload = Buffer.concat([payload, Buffer.from("\r\n", "utf8")]);
      }

      await writeFile(this.path, payload);
    } catch (err) {
      console.error("Failed to write to serial port:", err);
      this.cleanup();
      throw new Error(`Serial write failed: ${(err as Error).message}`);
    }
  }

  private cleanup() {
    this.connected = false;
    if (this.readStream) {
      try {
        this.readStream.destroy();
      } catch {
        // Ignore if already destroyed
      }
      this.readStream = null;
    }
  }
}
