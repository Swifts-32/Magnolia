import { ReadlineParser, SerialPort } from 'serialport';
import type { ISerialConnection } from "../IHardware";
import { createRequire } from 'module';
import type { ConnectionType } from '$lib/types/Hardware';

const require = createRequire(import.meta.url);
const { autoDetect } = require('@serialport/bindings-cpp');

export class SerialConnection implements ISerialConnection {
	private serialPort: SerialPort | null = null;

	public path: string;
	public baudRate: number;
	public connType: ConnectionType = "Serial";

	private dataReceived: ((data: Buffer) => void) | null = null;
	public onDataReceived(callback: (data: Buffer) => void) {
		this.dataReceived = callback;
	}

	public get isConnected(): boolean {
		return this.serialPort?.isOpen ?? false;
	};

	constructor(path: string, baudRate: number) {
		this.path = path;
		this.baudRate = baudRate;
	}

	public async connect(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {

			this.serialPort = new SerialPort({
				binding: autoDetect(),
				path: this.path,
				baudRate: this.baudRate,
				autoOpen: false
			});

			try {
				const parser = this.serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

				parser.on('data', (line: string) => {
					if (this.dataReceived) {
						this.dataReceived(Buffer.from(line.trim()));
					}
				});
			}
			catch (e) {
				reject("Error creating pipe");
			}


			this.serialPort.open((err) => {
				if (err) {
					reject(`Failed to open port on ${this.path}: ${err.message}`);
				}

				resolve(true);
			});
		});
	}

	public disconnect(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			if (this.serialPort) {
				this.serialPort.close((err) => {
					if (err) {
						reject(err.message);
					}

					resolve(true);
				});
			}
			else {
				reject("Serial port does not exist");
			}
		});
	}


	write(data: Buffer) {
		if (this.serialPort?.isOpen) {
			this.serialPort.write(data, (err) => {
				if (err) {
					console.log("Write error: ", err.message);
				}
			});
		}
		else {
			console.log("Port is not open.")
		}
	}
}