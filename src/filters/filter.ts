import { Condition } from "./condition";

export class Filter {
    private conditions: Condition[];

    public appendCondition(condition: Condition): Filter{
        this.conditions.push(condition);
        return this;
    }

    public count(): number {
        return this.conditions.length;
    }

    public getCondition(index: number) {
        return this.count() > index ? this.conditions[index]: null;
    }
}
