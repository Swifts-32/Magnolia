declare module "bun-serialport" {
  export class SerialPort {
    constructor(options: {
      path: string;
      baudRate: number;
      autoOpen?: boolean;
    });
    isOpen: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    write(data: Uint8Array | string): Promise<void>;
    pipe<T extends NodeJS.WritableStream>(destination: T): T;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export function list(): Promise<
    Array<{
      path: string;
      manufacturer?: string;
      serialNumber?: string;
      pnpId?: string;
      locationId?: string;
      vendorId?: string;
      productId?: string;
      friendlyName?: string;
    }>
  >;

  export function readlineParser(options?: { delimiter?: string }): any;
}
