import { Condition, ConditionType } from "./condition";
import { ChainType } from "../chaintype";
import { ContractAddress } from "../contractaddress";

export class PricingCondition extends Condition {
	private tokens: ContractAddress[];

	public constructor() {
		super(ConditionType.PricingTokens);
	}

	public appendToken(token: string, network: ChainType): PricingCondition {
		this.tokens.push(new ContractAddress(token, network));
		return this;
	}

	public count(): number {
		return this.tokens.length;
	}

	public getToken(index: number): ContractAddress {
		return this.count() > index ? this.tokens[index]: null;
	}
}
