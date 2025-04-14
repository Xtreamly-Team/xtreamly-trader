import { ethers, Wallet } from "ethers";
import type { Chain } from "viem/_types/types/chain";
export declare function loadEnv(): void;
export interface Config {
    chain: ChainDetails;
    provider: ethers.providers.JsonRpcProvider;
    wallet: Wallet;
    interval: number;
    rounds: number | undefined;
}
export declare function getConfig(): Config;
export declare function getProvider(): ethers.providers.JsonRpcProvider;
export declare function getWallet(): Wallet;
export interface ChainDetails {
    viemChain: Chain;
    rpc: string;
}
//# sourceMappingURL=config.d.ts.map