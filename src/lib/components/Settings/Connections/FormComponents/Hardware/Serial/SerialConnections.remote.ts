import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import { SerialPort } from 'serialport';

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  vendorId?: string;
  productId?: string;
  friendlyName?: string;
  isCustom?: boolean; // Track custom ports
}


export const getSerialPorts = query(async () => {

  try {
    const ports: SerialPortInfo[] = await SerialPort.list();
    return ports;
  } catch (e) {
    error(500, `Failed to list serial ports: ${e}`);
  }
});