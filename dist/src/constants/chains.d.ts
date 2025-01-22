import type { Chain } from "viem/_types/types/chain";
export interface ChainDetails {
    viemChain: Chain;
    RPC: string;
    WALLET_BALANCE_PROVIDER: `0x${string}`;
    POOL_ADDRESSES_PROVIDER: `0x${string}`;
    WRAPPED_TOKEN_GATEWAY: `0x${string}`;
    V3_POOL_AAVE: `0x${string}`;
    TOKENS: {
        AAVE?: `0x${string}`;
        USDC: `0x${string}`;
        WETH: `0x${string}`;
        A_AAVE?: `0x${string}`;
        A_USDC: `0x${string}`;
        A_WETH: `0x${string}`;
    };
}
export declare const CHAINS: any;
//# sourceMappingURL=chains.d.ts.map