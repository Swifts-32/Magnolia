export interface DccExInfo {
  version: string;
  microprocessorType: string;
  motorControllerType: string;
  buildNumber: string;
  maxCabs: number;
}

/**
 * Parses incoming command responses related to station info (<i ...>) or cab counts (<# ...>)
 */
export function processCommand(
  text: string,
  currentInfo?: DccExInfo,
): DccExInfo | undefined {
  if (text.startsWith("<i") && text.endsWith(">")) {
    const content = text.slice(1, -1).trim();

    // Split by whitespace AND filter out standalone '/' separator characters
    const parts = content.split(/\s+/).filter((p) => p !== "/");

    // Depending on firmware, parts[0] is 'iDCC-EX' (or 'i')
    // Real data starts at index 1 if parts[0] includes the command identifier
    const offset = parts[0]?.startsWith("i") ? 1 : 0;

    return {
      version: parts[offset] ?? "Unknown",
      microprocessorType: parts[offset + 1] ?? "Unknown",
      motorControllerType: parts[offset + 2] ?? "Unknown",
      buildNumber: parts[offset + 3] ?? "Unknown",
      maxCabs: currentInfo?.maxCabs ?? 0,
    };
  }

  // Example format: <# noCabs>
  if (text.startsWith("<#") && text.endsWith(">")) {
    const content = text.slice(1, -1).trim();
    const parts = content.split(/\s+/);
    const noCabsStr = parts[1] ?? parts[0]?.replace("#", "");
    const maxCabs = parseInt(noCabsStr, 10);

    if (!isNaN(maxCabs) && currentInfo) {
      return {
        ...currentInfo,
        maxCabs,
      };
    } else if (!isNaN(maxCabs)) {
      return {
        version: "Unknown",
        microprocessorType: "Unknown",
        motorControllerType: "Unknown",
        buildNumber: "Unknown",
        maxCabs,
      };
    }
  }

  return currentInfo;
}
