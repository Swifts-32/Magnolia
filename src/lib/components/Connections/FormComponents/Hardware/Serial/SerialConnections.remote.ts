import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { list } from "bun-serialport";

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
    const ports = await list();

    const formattedPorts: SerialPortInfo[] = ports.map((p) => ({
      path: p.path,
      manufacturer: p.manufacturer,
      serialNumber: p.serialNumber,
      pnpId: p.pnpId,
      locationId: p.locationId,
      vendorId: p.vendorId,
      productId: p.productId,
      friendlyName: p.friendlyName,
    }));

    return formattedPorts;
  } catch (e) {
    error(500, `Failed to list serial ports: ${e}`);
  }
});
