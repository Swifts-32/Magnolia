import { SerialPort, ReadlineParser } from 'serialport';
import { WindowsBinding } from '@serialport/bindings-cpp'
import type { IConnection } from "../connection";
import type { ConnectionProtocols } from '$lib/client/Protocols/protocols';

export class SerialConnection implements IConnection {

    private serialPort: SerialPort | null = null;

    public path: string;
    public baudRate: number;
    public protocol: ConnectionProtocols;

    private _onDataReceived: ((data: string) => void) | null = null;
    public onDataReceived(callback: (data: string) => void) {
        this._onDataReceived = callback;
    }

    public get isConnected(): boolean {
        return this.serialPort?.isOpen ?? false;
    };

    constructor(protocol: ConnectionProtocols, path: string, baudRate: number) {
        this.path = path;
        this.baudRate = baudRate;
        this.protocol = protocol
    }


    async connect() {
        return new Promise<string>((resolve, reject) => {

            this.serialPort = new SerialPort({
                binding: WindowsBinding,
                path: this.path,
                baudRate: this.baudRate,
                autoOpen: false
            });

            const parser = new ReadlineParser();
            this.serialPort.pipe(parser);

            parser.on('data', (data) => {
                if (this._onDataReceived) {
                    this._onDataReceived(data);
                }
            });

            this.serialPort.open((err) => {
                if (err) {
                    reject(err.message);
                }

                resolve(`Successfully opened port on ${this.path}`);
            });
        });
    }

    disconnect() {
        if (this.serialPort) {
            this.serialPort.close((err) => {
                if (err) {
                    console.log(`Error closing port on ${this.path}: ${err.message}`)
                }
                else {
                    console.log(`Successfully closed port on ${this.path}`);
                }
            });
        }
        else {
            console.log("Serial port does not exist");
        }
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
}