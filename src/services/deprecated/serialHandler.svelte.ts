interface Navigator {
  serial: {
    requestPort: () => Promise<SerialPort>;
    getPorts: () => Promise<SerialPort[]>;
  };
}

interface SerialPort {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

export class SerialHandler {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

  connected: boolean = $state(false);

  async connect(): Promise<void> {
    // USB VendorIds - https://devicehunt.com/view/type/usb/vendor/0483/device/8259
    const filters = [
      { usbVendorId: 0x483, usbProductId: 0x3752 }, // STM | STLINK/V2.1
    ];

    // if ("serial" in navigator) {
    //   try {
    //     this.port = await (navigator as any).serial.requestPort({ filters });

    //     if (this.port == null) throw "Port was null";
    //     await this.port.open({ baudRate: 115200 });

    //     // Setup reader
    //     if (this.port.readable) {
    //       this.reader = this.port.readable.getReader();
    //     }
    //     // Setup writer
    //     if (this.port.writable) {
    //       this.writer = this.port.writable.getWriter();
    //     }

    //     this.connected = true;
    //   } catch (err) {
    //     this.connected = false;
    //     console.log("Failed to open serial port", err);
    //   }
    // } else {
    //   this.connected = false;
    //   console.error(
    //     "Web serial doesn't seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info."
    //   );
    // }

    this.connected = true;
  }

  public async readSerial(): Promise<string | null> {
    if (!this.reader) {
      console.error("Reader not available. Make sure to call connect() first.");
      return null;
    }

    try {
      while (true) {
        const { value, done } = await this.reader.read();

        // Reader has been canceled or closed
        if (done) {
          this.reader.releaseLock();
          this.reader = null;
          return null;
        }

        // Convert Uint8Array to string
        const textDecoder = new TextDecoder();
        return value ? textDecoder.decode(value) : null;
      }
    } catch (err) {
      console.error("Error while reading from serial port:", err);
    }
    console.log("Serial exiting");
    return null;
  }

  async writeSerial(data: string): Promise<void> {
    if (!this.writer) {
      console.error("Writer not available. Make sure to call connect() first.");
      return;
    }

    try {
      const textEncoder = new TextEncoder();
      const encodedData = textEncoder.encode(data);

      await this.writer.write(encodedData);
      console.log("Write:", data);
    } catch (error) {
      console.error(`Error writing to serial port: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Reader
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }

      // Writer
      if (this.writer) {
        await this.writer.close();
        this.writer.releaseLock();
        this.writer = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      this.connected = false;
    } catch (error) {
      this.connected = false;
      console.error("Failed to disconnect from the serial device:", error);
    }
  }
}
