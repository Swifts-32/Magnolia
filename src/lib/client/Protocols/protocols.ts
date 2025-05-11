export enum ConnectionTypes {
    Serial = 0,
    Emulator = 5,
    SSE = 10,
}

export enum ConnectionProtocols {
    DCCEX = 0,
    LCC = 1,
}


export function getProtocolName(protocol: ConnectionProtocols): string {
    switch (protocol) {
        case ConnectionProtocols.DCCEX:
            return "DCC EX";
        case ConnectionProtocols.LCC:
            return "LCC";
        default:
            return "Unknown";
    }
}

export function getConnectionTypeName(connType: ConnectionTypes): string {
    switch (connType) {
        case ConnectionTypes.Serial:
            return "Serial";
        case ConnectionTypes.Emulator:
            return "Emulator";
        case ConnectionTypes.SSE:
            return "Server-Sent Events (SSE)";
        default:
            return "Unknown Connection Type";

    }
}