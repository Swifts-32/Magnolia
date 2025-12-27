// src/lib/server/Protocols/Lcc/Lcc.ts
import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type EventEmitter from "events";
import type { IProtocol } from "../IProtocol";

export interface LccNode {
  id: string;
  manufacturer?: string;
  model?: string;
  hwVersion?: string;
  swVersion?: string;
  userName?: string;
  description?: string;
  lastSeen: number;
}

export class Lcc implements IProtocol {
  public protocolType: ConnectionProtocol = "Lcc";
  public connectionId: string;

  private events: EventEmitter | null = null;

  // Serial write callback (injected by connection manager)
  private write: ((data: Buffer) => void) | null = null;

  // SLIP state
  private inSlip = false;
  private slipBuffer: number[] = [];

  // Node list
  public nodes: Map<string, LccNode> = new Map();

  // Logging
  public logBuffer: string[] = [];
  private readonly maxLogLines = 200;

  // Our node ID
  private readonly MY_NODE_ID = Buffer.from([0x05, 0x01, 0x01, 0x01, 0x01, 0x01]);

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public setEventEmitter(emitter: EventEmitter): void {
    this.events = emitter;
  }

  public setWriteCallback(write: (data: Buffer) => void): void {
    this.write = write;
  }

  // ------------------------------------------------------------
  // 🔥 MAIN ENTRY POINT — called by serial connection
  // ------------------------------------------------------------
  public processCommand(data: Buffer): void {
    console.log(`Proccessing command: ${data}`);

    for (const byte of data) {
      if (byte === 0xc0) {
        // SLIP END
        if (this.inSlip && this.slipBuffer.length > 0) {
          const frame = this.decodeSlip(Buffer.from(this.slipBuffer));
          this.handleLccFrame(frame);
        }
        this.slipBuffer = [];
        this.inSlip = true;
        continue;
      }

      if (this.inSlip) {
        this.slipBuffer.push(byte);
      } else {
        this.handleEspLogByte(byte);
      }
    }
  }

  // ------------------------------------------------------------
  // OUTGOING COMMANDS (called by UI)
  // ------------------------------------------------------------
  public sendInfoRequest(): void {
    const frame = this.buildFrame(0x0490, this.MY_NODE_ID, undefined, Buffer.alloc(0));
    this.sendSlip(frame);
  }

  public sendSnipRequest(nodeId: string): void {
    const dest = this.nodeIdStringToBuffer(nodeId);
    const frame = this.buildFrame(0x0de8, this.MY_NODE_ID, dest, Buffer.alloc(0));
    this.sendSlip(frame);
  }

  public sendSnipAll(): void {
    for (const node of this.nodes.values()) {
      this.sendSnipRequest(node.id);
    }
  }

  public sendVerifiedNodeIdRequest(): void {
    const frame = this.buildFrame(0x0170, this.MY_NODE_ID, undefined, Buffer.alloc(0));
    this.sendSlip(frame);
  }

  // ------------------------------------------------------------
  // 🔥 SLIP ENCODE/DECODE
  // ------------------------------------------------------------
  private sendSlip(frame: Buffer): void {
    if (!this.write) return;

    const encoded = Buffer.concat([
      Buffer.from([0xc0]),
      this.encodeSlip(frame),
      Buffer.from([0xc0])
    ]);

    this.write(encoded);
  }

  private encodeSlip(buf: Buffer): Buffer {
    const out: number[] = [];
    for (const b of buf) {
      if (b === 0xc0) out.push(0xdb, 0xdc);
      else if (b === 0xdb) out.push(0xdb, 0xdd);
      else out.push(b);
    }
    return Buffer.from(out);
  }

  private decodeSlip(buf: Buffer): Buffer {
    const out: number[] = [];
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] === 0xdb) {
        if (buf[i + 1] === 0xdc) { out.push(0xc0); i++; continue; }
        if (buf[i + 1] === 0xdd) { out.push(0xdb); i++; continue; }
      }
      out.push(buf[i]);
    }
    return Buffer.from(out);
  }

  // ------------------------------------------------------------
  // 🔥 LCC FRAME PARSING
  // ------------------------------------------------------------
  private handleLccFrame(frame: Buffer): void {
    if (frame.length < 8) return;

    const mti = frame.readUInt16BE(0);
    const src = frame.subarray(2, 8);
    const srcId = this.nodeIdBufferToString(src);

    this.log(`[LCC] MTI=0x${mti.toString(16)} From=${srcId}`);

    // Verified Node ID
    if (mti === 0x0170 || mti === 0x0171) {
      this.handleVerifiedNode(srcId, src);
      return;
    }

    // SNIP Reply
    if (mti === 0x0a08) {
      this.handleSnipReply(frame, srcId);
      return;
    }
  }

  private handleVerifiedNode(srcId: string, srcBuf: Buffer): void {
    const now = Date.now();
    const isNew = !this.nodes.has(srcId);

    const existing = this.nodes.get(srcId);
    this.nodes.set(srcId, {
      id: srcId,
      manufacturer: existing?.manufacturer,
      model: existing?.model,
      hwVersion: existing?.hwVersion,
      swVersion: existing?.swVersion,
      userName: existing?.userName,
      description: existing?.description,
      lastSeen: now
    });

    if (isNew) {
      this.log(`[LCC] New node discovered: ${srcId}`);
      // Auto SNIP request
      const frame = this.buildFrame(0x0de8, this.MY_NODE_ID, srcBuf, Buffer.alloc(0));
      this.sendSlip(frame);
    }

    this.emitNodes();
  }

  private handleSnipReply(frame: Buffer, srcId: string): void {
    if (frame.length <= 16) return;

    const payload = frame.subarray(16);
    let idx = 0;

    const readStrings = (count: number): string[] => {
      const arr: string[] = [];
      for (let i = 0; i < count; i++) {
        const end = payload.indexOf(0x00, idx);
        if (end === -1) break;
        arr.push(payload.subarray(idx, end).toString("utf8"));
        idx = end + 1;
      }
      return arr;
    };

    const mfgCount = payload[idx++];
    const mfg = readStrings(mfgCount);

    const userCount = payload[idx++];
    const user = readStrings(userCount);

    const node = this.nodes.get(srcId);
    this.nodes.set(srcId, {
      id: srcId,
      manufacturer: mfg[0],
      model: mfg[1],
      hwVersion: mfg[2],
      swVersion: mfg[3],
      userName: user[0],
      description: user[1],
      lastSeen: node?.lastSeen ?? Date.now()
    });

    this.log(`[LCC] SNIP updated for ${srcId}`);
    this.emitNodes();
  }

  // ------------------------------------------------------------
  // 🔥 FRAME BUILDER
  // ------------------------------------------------------------
  private buildFrame(mti: number, src: Buffer, dest?: Buffer, data?: Buffer): Buffer {
    const mtiBuf = Buffer.alloc(2);
    mtiBuf.writeUInt16BE(mti, 0);

    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16BE(data?.length ?? 0, 0);

    return Buffer.concat([
      mtiBuf,
      src,
      ...(dest ? [dest] : []),
      lenBuf,
      data ?? Buffer.alloc(0)
    ]);
  }

  // ------------------------------------------------------------
  // 🔥 ESP LOG HANDLING
  // ------------------------------------------------------------
  private textAccum: number[] = [];

  private handleEspLogByte(byte: number): void {
    if (byte === 0x0a || byte === 0x0d) {
      if (this.textAccum.length > 0) {
        const line = Buffer.from(this.textAccum).toString("utf8");
        this.log(`[ESP] ${line}`);
        this.textAccum = [];
      }
    } else {
      this.textAccum.push(byte);
    }
  }

  // ------------------------------------------------------------
  // 🔥 HELPERS
  // ------------------------------------------------------------
  private nodeIdBufferToString(buf: Buffer): string {
    return [...buf].map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(":");
  }

  private nodeIdStringToBuffer(id: string): Buffer {
    return Buffer.from(id.replace(/:/g, ""), "hex");
  }

  private log(msg: string): void {
    this.logBuffer.push(msg);
    if (this.logBuffer.length > this.maxLogLines)
      this.logBuffer.splice(0, this.logBuffer.length - this.maxLogLines);

    this.events?.emit("update", {
      connectionId: this.connectionId,
      type: "lcc_log",
      log: msg
    });
  }

  private emitNodes(): void {
    this.events?.emit("update", {
      connectionId: this.connectionId,
      type: "lcc_nodes"
    });
  }

  public getNodesSnapshot(): LccNode[] {
    return [...this.nodes.values()];
  }

  public getLogSnapshot(): string[] {
    return [...this.logBuffer];
  }
}
