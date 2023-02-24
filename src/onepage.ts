export class OnePage<T> {
    private totalCount: number;
    private beforeTime: number;
    private capcity: number;
    private items: T[]

    constructor(totalCount: number, beforeTime: number, capacity: number, items: T[]) {
        this.totalCount = totalCount
        this.beforeTime = beforeTime
        this.capcity = capacity
        this.items = items
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public getEarlierTimestamp(): number {
        return this.beforeTime;
    }

    public getCapcity(): number {
        return this.capcity;
    }

    public getItems(): T[] {
        return this.items;
    }
}
