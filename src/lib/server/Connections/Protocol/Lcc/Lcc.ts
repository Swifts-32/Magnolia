// src/lib/server/Protocols/Lcc/Lcc.ts
import type { ConnectionProtocol } from "$lib/types/Protocols";
import type EventEmitter from "events";
import type { IProtocol } from "../IProtocol";
import { App } from "$lib/server/App.server";
import { encode } from "punycode";

export interface LccNode {
  id: string;
  manufacturer?: string;
  model?: string;
  hwVersion?: string;
  swVersion?: string;
  userName?: string;
  description?: string;
  lastSeen: number;

  cdi?: string;
  cdiLoaded?: boolean;
}

export class Lcc implements IProtocol {
  public protocolType: ConnectionProtocol = "Lcc";
  public connectionId: string;

  private events: EventEmitter | null = null;

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

  // public requestCdi(nodeId: string, address = 0) {
  //   const dest = this.nodeIdStringToBuffer(nodeId);

  //   // Memory Configuration Protocol: Read
  //   // MTI 0x0D00 = Read Request
  //   const mti = 0x0D00;

  //   const payload = Buffer.alloc(6);
  //   payload.writeUInt8(0xFF, 0); // Space = 0xFF (CDI)
  //   payload.writeUInt32BE(address, 1) // Address
  //   payload.writeUInt8(64, 5) // Length = 64 bytes per chunk

  //   const frame = this.buildFrame(mti, this.MY_NODE_ID, dest, payload);
  //   this.sendSlip(frame);
  // }

  // ------------------------------------------------------------
  // 🔥 SLIP ENCODE/DECODE
  // ------------------------------------------------------------
  private async sendSlip(frame: Buffer) {
    const encoded = Buffer.concat([
      Buffer.from([0xc0]),
      this.encodeSlip(frame),
      Buffer.from([0xc0])
    ]);

    const connection = await App.getConnection(this.connectionId);
    if (!connection) return this.log("Connection not found");

    if (!(connection.protocol instanceof Lcc))
      return this.log("LCC connection is not an instance of Lcc");

    connection.write(encoded);
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

    if (mti === 0x0170 || mti === 0x0171) {
      // Verified Node ID
      this.handleVerifiedNode(srcId, src);
      return;
    } else if (mti === 0x0a08) {
      // SNIP Reply
      this.handleSnipReply(frame, srcId);
      return;
    }
    else if ((mti & 0xFF00) === 0x1C00) {
      this.handleDatagram(frame, srcId);
      return;
    }
    //else if (mti === 0x0D01) {
    // Memory Config Protocol: Read Reply (0x0D01)
    // this.handleMemoryReadReply(frame, srcId);
    //  return;
    // }
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

  // private handleMemoryReadReply(frame: Buffer, srcId: string) {
  //   const node = this.nodes.get(srcId);
  //   if (!node) return;

  //   const payload = frame.subarray(16);
  //   const space = payload.readUInt8(0);
  //   const address = payload.readUInt32BE(1);
  //   const data = payload.subarray(5);

  //   if (space !== 0xFF) return; // Not CDI

  //   const text = data.toString("utf8");

  //   if (!node.cdi) node.cdi = "";

  //   // Append chunk
  //   node.cdi += text;

  //   // Check for terminating null
  //   if (data.includes(0x00)) {
  //     node.cdi = node.cdi.replace(/\x00/g, "");
  //     node.cdiLoaded = true;
  //     this.log(`[LCC] CDI loaded for ${srcId}`);
  //     this.emitNodes();
  //     return;
  //   }

  //   // Request next chunk
  //   this.requestCdi(srcId, address + data.length);
  // }

  // ------------------------------------------------------------
  // 🔥 FRAME BUILDER
  // ------------------------------------------------------------
  // private buildFrame(mti: number, src: Buffer, dest?: Buffer, data?: Buffer): Buffer {
  //   const mtiBuf = Buffer.alloc(2);
  //   mtiBuf.writeUInt16BE(mti, 0);

  //   const lenBuf = Buffer.alloc(2);
  //   lenBuf.writeUInt16BE(data?.length ?? 0, 0);

  //   return Buffer.concat([
  //     mtiBuf,
  //     src,
  //     ...(dest ? [dest] : []),
  //     lenBuf,
  //     data ?? Buffer.alloc(0)
  //   ]);
  // }

  private buildFrame(mti: number, src: Buffer, dest: Buffer | undefined, data: Buffer): Buffer {
    // MTI
    const mtiBuf = Buffer.alloc(2);
    mtiBuf.writeUInt16BE(mti, 0);

    // Validate node IDs
    if (src.length !== 6) throw new Error(`SRC must be 6 bytes, got ${src.length}`);
    if (dest && dest.length !== 6) throw new Error(`DEST must be 6 bytes, got ${dest.length}`);

    // Data length
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16BE(data.length, 0);

    // Build frame in correct order
    const parts = [mtiBuf, src];

    if (dest) parts.push(dest);

    parts.push(lenBuf, data);

    return Buffer.concat(parts);
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

  private handleDatagram(frame: Buffer, srcId: string) {
    if (frame.length < 16) return;

    const dest = this.nodeIdBufferToString(frame.subarray(8, 14));
    const dataLen = frame.readUInt16BE(14);
    const data = frame.subarray(16, 16 + dataLen);

    // Memory Config datagrams always start with Content ID 0x20
    if (data[0] !== 0x20) return;

    const cmd = data[1];

    // Read Reply (0x50–0x57)
    if (cmd >= 0x50 && cmd <= 0x57) {
      this.handleMcReadReply(srcId, data.subarray(1));
    }
  }

  private handleMcReadReply(srcId: string, payload: Buffer) {
    const addr = payload.readUInt32BE(1);
    const space = payload[5];
    const data = payload.subarray(6);

    const node = this.nodes.get(srcId);
    if (!node) return;
    
    if (space !== 0xFF) return; // CDI only
    
    if (!node.cdi) node.cdi = "";
    node.cdi += data.toString("utf8");
    
    // TODO not beinf called
    if (data.includes(0x00)) {
      console.log("5");
      node.cdi = node.cdi.replace(/\x00/g, "");
      node.cdiLoaded = true;
      this.log(`[LCC] CDI loaded for ${srcId}`);
      this.emitNodes();
      return;
    }

    // Request next block
    this.requestCdiDatagram(srcId, addr + data.length);
  }

  private requestCdiDatagram(nodeId: string, address: number) {
    const dest = this.nodeIdStringToBuffer(nodeId);

    const payload = Buffer.alloc(7);
    payload[0] = 0x40; // READ
    payload.writeUInt32BE(address, 1);
    payload[5] = 0xFF; // CDI space
    payload[6] = 64;   // length

    const contentId = Buffer.from([0x20]);
    const data = Buffer.concat([contentId, payload]);

    const frame = this.buildFrame(0x1C48, this.MY_NODE_ID, dest, data);
    this.sendSlip(frame);
  }

  public requestCdi(nodeId: string) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.cdi = "";
      node.cdiLoaded = false;
    }
    this.requestCdiDatagram(nodeId, 0);
  }

}
