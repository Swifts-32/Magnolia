import { ConnectionTypes } from "$lib/client/Protocols/protocols";
import type { IServerSideEventsConnection } from "../hardware";

export class ServerSideEventsConnection implements IServerSideEventsConnection {
  public connType: ConnectionTypes.SSE;
  public isConnected: boolean;
  private eventSource: EventSource | null = null;

  constructor() {
    this.connType = ConnectionTypes.SSE;
    this.isConnected = false;
  }

  connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve("Already connected");
        return;
      }

      this.eventSource = new EventSource("/api/sse");

      this.eventSource.onopen = () => {
        this.isConnected = true;
        resolve("Connected to SSE");
      };

      this.eventSource.onerror = (error) => {
        this.isConnected = false;
        reject("Error connecting to SSE: " + error);
      };
    });
  }

  disconnect(): Promise<string> {
    return new Promise((resolve) => {
      if (this.eventSource) {
        this.eventSource.close();
        this.isConnected = false;
        resolve("Disconnected from SSE");
      } else {
        resolve("No active SSE connection to disconnect");
      }
    });
  }

  write(data: string): void {
    // SSE is a one-way connection, so we don't need to implement this
    console.warn("Write operation not supported for SSE");
  }

  onDataReceived(callback: (data: string) => void): void {
    if (this.eventSource) {
      this.eventSource.onmessage = (event) => {
        callback(event.data);
      };
    } else {
      console.warn("No active SSE connection to receive data");
    }
  }

  toJSON(): { connType: ConnectionTypes.SSE } {
    return { connType: this.connType };
  }
}