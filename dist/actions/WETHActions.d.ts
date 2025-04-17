import { Wallet } from "ethers";
export declare class WETHActions {
    private signer;
    private wethAddress;
    constructor(wethAddress: string, signer: Wallet);
    wrap(amount: number): Promise<number>;
    unwrap(amount: number): Promise<number>;
}
//# sourceMappingURL=WETHActions.d.ts.map