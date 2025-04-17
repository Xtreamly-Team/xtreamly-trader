import { providers, Wallet } from "ethers";
import type { Chain } from "viem/_types/types/chain";
export interface LoopData {
    borrowed: number;
    supplied: number;
}
export declare class LoopTrading {
    private loops;
    private aave;
    private readonly collateralToken;
    private readonly borrowedToken;
    private initialCollateral;
    constructor(chain: Chain, provider: providers.JsonRpcProvider, signer: Wallet, collateralToken: string, borrowedToken: string);
    init(initialCollateral: number): Promise<void>;
    swap(amount: number, fromToken: string, toToken: string): Promise<number>;
    borrowLoop(amount: number): Promise<{
        borrowed: number;
        supplied: number;
    }>;
    borrowLoops(count: number): Promise<void>;
    repayAll(): Promise<void>;
    repayLast(n?: number): Promise<void>;
    balanceLoopsTo(n: number): Promise<void>;
}
//# sourceMappingURL=LoopTrading.d.ts.map