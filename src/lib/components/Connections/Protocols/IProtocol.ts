import type { ConnectionProtocol } from "#lib/components/Connections/Protocols/protocolConstants.js";

export interface IProtocol {
  protocolType: ConnectionProtocol;
  connectionId: string;
  processCommand: (command: Buffer) => void;
  onUpdate(callback: () => void): () => void;
  onParsedOutput: (callback: (data: string) => void) => void;
}
