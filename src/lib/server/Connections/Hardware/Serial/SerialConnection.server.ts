import { SerialPort, ReadlineParser } from 'serialport';
import type { HardwareClass } from "../hardware";
import { ConnectionTypes } from '$lib/client/Protocols/protocols';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { autoDetect } = require('@serialport/bindings-cpp');

export class SerialConnection implements HardwareClass {


	private serialPort: SerialPort | null = null;

	public path: string;
	public baudRate: number;
	public connType: ConnectionTypes.Serial = ConnectionTypes.Serial;

	private dataReceived: ((data: string) => void) | null = null;
	public onDataReceived(callback: (data: string) => void) {
		this.dataReceived = callback;
	}

	public get isConnected(): boolean {
		return this.serialPort?.isOpen ?? false;
	};

	constructor(path: string, baudRate: number) {
		this.path = path;
		this.baudRate = baudRate;
	}

	async connect(): Promise<string> {
		return new Promise<string>((resolve, reject) => {

			this.serialPort = new SerialPort({
				binding: autoDetect(),
				path: this.path,
				baudRate: this.baudRate,
				autoOpen: false

			});

			const parser = new ReadlineParser();
			this.serialPort.pipe(parser);

			parser.on('data', (data) => {
				console.log("Serial Rx: ", data);
				if (this.dataReceived) {
					console.log("Data received callback");
					this.dataReceived(data as string);
				}
			});

			this.serialPort.open((err) => {
				if (err) {
					reject(`Failed to open port on ${this.path}: ${err.message}`);
				}

				resolve(`Successfully opened port on ${this.path}`);
			});
		});
	}

	disconnect(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (this.serialPort) {
				this.serialPort.close((err) => {
					if (err) {
						reject(err.message);
					}

					resolve(`Successfully closed port on ${this.path}`);
				});
			}
			else {
				reject("Serial port does not exist");
			}
		});
	}


	write(data: string) {
		if (this.serialPort?.isOpen) {
			console.log("Serial Tx: ", data);

			this.serialPort.write(data, (err) => {
				if (err) {
					console.log("Write error: ", err.message);
				}
			});
		}
		else {
			console.log("Port is not open. Connecting...")
			this.connect();
		}
	}

	toJson() {
		return JSON.stringify({
			path: this.path,
			baudRate: this.baudRate,
			connType: this.connType
		});
	}
}