export abstract class BaseProtocol {
  public connectionId: string;

  private updateListeners: (() => void)[] = [];
  private _onParsedOutput: ((data: string) => void) | null = null;

  constructor(connectionId: string) {
    this.connectionId = connectionId;
  }

  public onUpdate(callback: () => void): () => void {
    this.updateListeners.push(callback);
    return () => {
      this.updateListeners = this.updateListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  protected notifyListeners() {
    for (const cb of this.updateListeners) {
      cb();
    }
  }

  public onParsedOutput(callback: (data: string) => void) {
    this._onParsedOutput = callback;
  }

  protected triggerParsedOutput(data: string) {
    this._onParsedOutput?.(data);
  }

  // Forces child classes to implement command processing
  public abstract processCommand(command: Buffer): void;
}
