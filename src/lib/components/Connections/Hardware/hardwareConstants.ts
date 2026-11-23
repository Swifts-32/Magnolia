import { z } from "zod/v4";

export const connectionTypeList = ["Serial", "Emulator", "WebServer"] as const;
export const ConnectionHardwareList = z.enum(connectionTypeList);
export type ConnectionHardwareList = z.infer<typeof ConnectionHardwareList>;

export function getConnectionHardwareName(
  hardwareType: ConnectionHardwareList,
): string {
  switch (hardwareType) {
    case "Serial":
      return "Serial";
    case "Emulator":
      return "Emulator";
    case "WebServer":
      return "Web Server";

    default:
      return "Unknown Connection Type";
  }
}

const SerialHardwareSchema = z.object({
  type: z.literal("Serial"),
  path: z.string().min(1, "Path is required"),
  baudRate: z.number().int().positive("Baud rate must be a valid number"),
});

const WebServerHardwareSchema = z.object({
  type: z.literal("WebServer"),
  baseUrl: z.url("Must be a valid URL"),
  headers: z.record(z.string(), z.string()).optional(),
});

const EmulatorHardwareSchema = z.object({
  type: z.literal("Emulator"),
});

export const HardwareSchema = z.discriminatedUnion("type", [
  SerialHardwareSchema,
  WebServerHardwareSchema,
  EmulatorHardwareSchema,
]);

export type ConnectionHardware = z.infer<typeof HardwareSchema>;
