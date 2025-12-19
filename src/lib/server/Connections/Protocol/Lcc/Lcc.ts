import type { ConnectionProtocol } from "$lib/client/Protocols/protocols";
import type { IProtocol } from "../IProtocol";

export class Lcc implements IProtocol {
  public protocolType: ConnectionProtocol = "Lcc";
  
  public processCommand(command: string) {
    console.log(`Processing LCC command: ${command}`);
  }
}