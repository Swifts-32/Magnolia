import type { ConnectionHardwareList } from "#lib/types/hardwareConstants.js";

export interface IHardware {
  connType: ConnectionHardwareList;

  isConnected: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;

  onDataReceived: (callback: (data: Buffer) => void) => void;
  write: (data: Buffer) => void;
}

export interface ISerialConnection extends IHardware {
  path: string;
  baudRate: number;
}

export interface IEmulatorConnection extends IHardware {}

export interface IWebServerConnection extends IHardware {
  baseUrl: string;
  headers?: Record<string, string>;
}
