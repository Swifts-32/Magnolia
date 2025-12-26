import type { ConnectionProtocol } from "$lib/client/Connections/Protocols/protocols";
import type { IProtocol } from "../IProtocol";

export class Lcc implements IProtocol {
  public protocolType: ConnectionProtocol = "Lcc";
  public connectionId: string;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public processCommand(command: string) {
    console.log(`Processing LCC command: ${command}`);

  }

}