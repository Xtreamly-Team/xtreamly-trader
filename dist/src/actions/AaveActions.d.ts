import { Wallet, BigNumberish } from "ethers";
export declare class AaveActions {
    private signer;
    private chainDetails;
    private gatewayContract;
    private aavePoolV3Contract;
    constructor(signer: Wallet);
    depositETH(amountETH: number): Promise<any>;
    withdrawETH(amountETH: number | "max"): Promise<any>;
    withdrawUSDC(amount: number | "max"): Promise<any>;
    approveAWETH(amount: bigint): Promise<any>;
    supplyUSDC(amount: number): Promise<any>;
    borrowUSDC(amount: number): Promise<any>;
    repayUSDC(amount: number | "max"): Promise<any>;
    approve(amount: BigNumberish, token: string, address: string): Promise<any>;
}
//# sourceMappingURL=AaveActions.d.ts.map