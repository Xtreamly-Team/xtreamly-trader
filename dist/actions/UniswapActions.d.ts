import { Wallet, providers } from "ethers";
import { Chain } from "viem/_types/types/chain";
export declare class UniswapActions {
    private signer;
    private readonly provider;
    private chain;
    constructor(chain: Chain, provider: providers.JsonRpcProvider, signer: Wallet);
    swapV2(token0Amount: string, token0Address: string, token1Address: string): Promise<string>;
    swapV3(token0Amount: string, token0Address: string, token1Address: string): Promise<string>;
}
//# sourceMappingURL=UniswapActions.d.ts.map