// protocols/DccEx/server/modules/DccExInfoManager.ts

export interface DccExInfo {
  version: string;
  microprocessorType: string;
  motorControllerType: string;
  buildNumber: string;
  maxCabs: number;
}

export class DccExInfoManager {
  public info: DccExInfo | undefined;

  /**
   * Parses incoming command responses related to station info (<i ...>) or cab counts (<# ...>)
   */
  public processCommand(
    text: string,
    currentInfo?: DccExInfo,
  ): DccExInfo | undefined {
    // Example format: <i version microprocessorType motorControllerType buildNumber>
    if (text.startsWith("<i") && text.endsWith(">")) {
      const content = text.slice(1, -1).trim(); // removes < and >
      const parts = content.split(/\s+/); // split by whitespace
      // parts[0] is usually 'i' or 'iDCCEX' depending on firmware version

      const [, version, microprocessorType, motorControllerType, buildNumber] =
        parts;

      return {
        version: version ?? "Unknown",
        microprocessorType: microprocessorType ?? "Unknown",
        motorControllerType: motorControllerType ?? "Unknown",
        buildNumber: buildNumber ?? "Unknown",
        maxCabs: currentInfo?.maxCabs ?? 0, // preserve maxCabs if already loaded
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
}
