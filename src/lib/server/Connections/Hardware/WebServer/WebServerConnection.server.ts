import type { ConnectionHardwareList } from "#lib/types/hardwareConstants.js";
import type { IWebServerConnection } from "../IHardware";

export class WebServerConnection implements IWebServerConnection {
  public baseUrl: string;
  public headers: Record<string, string>;
  public connType: ConnectionHardwareList = "WebServer";

  private abortController: AbortController | null = null;
  private connected: boolean = false;

  private dataReceived: ((data: Buffer) => void) | null = null;
  public onDataReceived(callback: (data: Buffer) => void) {
    this.dataReceived = callback;
  }

  public get isConnected(): boolean {
    return this.connected;
  }

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Strip trailing slash
    this.headers = headers;
  }

  public async connect(): Promise<boolean> {
    if (this.connected) return true;

    try {
      console.log(
        `Attempting to connect to Sunbeam server at: ${this.baseUrl}/blocks`,
      );

      const response = await fetch(`${this.baseUrl}/blocks`, {
        method: "GET",
        headers: { ...this.headers },
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      this.abortController = new AbortController();
      this.listenToStream(this.abortController.signal);

      this.connected = true;
      return true;
    } catch (error: any) {
      console.error("WebServer connection failed with error:", error);
      // console.error("Connection failed:", error.message);
      this.connected = false;
      return false;
    }
  }

  private async listenToStream(signal: AbortSignal) {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        headers: {
          Accept: "text/event-stream",
          ...this.headers,
        },
        signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to connect to SSE stream: ${response.statusText}`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataContent = line.replace("data:", "").trim();
            if (this.dataReceived && dataContent) {
              this.dataReceived(Buffer.from(dataContent, "utf-8"));
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("SSE connection error:", error.message);
        this.connected = false;
      }
    }
  }

  public async disconnect(): Promise<boolean> {
    if (!this.connected) {
      throw new Error("Web server connection is not active");
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.connected = false;
    return true;
  }

  /**
   * Performs an HTTP GET request to the web server.
   * Automatically parses JSON responses if the content-type matches.
   */
  public async get(endpoint: string = ""): Promise<any> {
    try {
      const url = endpoint
        ? `${this.baseUrl}/${endpoint.replace(/^\//, "")}`
        : this.baseUrl;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          ...this.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return await response.text();
    } catch (err: any) {
      console.error("GET request error:", err.message);
      throw err;
    }
  }

  /**
   * Performs an HTTP POST request to send binary data (`Buffer`) to the web server.
   */
  public async write(data: Buffer): Promise<void> {
    if (!this.connected) {
      console.log("Port is not open.");
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          ...this.headers,
        },
        // Cast via unknown to cleanly bypass conflicting Node/DOM fetch body overloads
        body: data as unknown as BodyInit,
      });

      if (!response.ok) {
        console.log("Write error: HTTP status", response.status);
      }
    } catch (err: any) {
      console.log("Write error: ", err.message);
    }
  }
}
