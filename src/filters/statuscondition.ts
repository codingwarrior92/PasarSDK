import { Condition, ConditionType } from "./condition";

enum ListingStatus {
    BuyNow,
    OnAuction,
    NotMet,
    HasBids,
    HasEnded
}

class StatusCondition extends Condition {
    private statusList: ListingStatus[];

    public constructor() {
        super(ConditionType.ListingStatus)
    }

    public appendStatus(status: ListingStatus): StatusCondition {
        this.statusList.push(status);
        return this;
    }

    public count(): number {
        return this.statusList.length;
    }

    public getStatus(index: number) {
        return this.count() > index ? this.statusList[index]: null;
    }
}

export {
    ListingStatus,
    StatusCondition,
}
