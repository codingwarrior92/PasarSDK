import { Condition, ConditionType} from "./condition"

export class SensiveCondition extends Condition {
    private sensitive: boolean;

    public constructor(sensitive = false) {
        super(ConditionType.Sensitive);
        this.sensitive = true;
    }

    public getSenstive(): boolean {
        return this.sensitive;
    }
}
