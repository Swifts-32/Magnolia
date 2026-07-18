export class AsyncEventQueue<T> {
    private queue: T[] = [];
    private resolvers: ((value: T) => void)[] = [];

    // Push events from your protocol here
    push(value: T) {
        if (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift();
            resolve?.(value);
        } else {
            this.queue.push(value);
        }
    }

    async next(): Promise<T> {
        if (this.queue.length > 0) {
            return this.queue.shift()!;
        }
        return new Promise<T>((resolve) => {
            this.resolvers.push(resolve);
        });
    }
}