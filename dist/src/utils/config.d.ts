import { Wallet } from "ethers";
export declare function loadEnv(): void;
export interface Config {
    chain: string;
    network: string;
    rpc: string;
    walletPrivateKey: string;
    interval: number;
    rounds: number | undefined;
}
export declare function getConfig(): Config;
export declare function getWallet(): Wallet;
//# sourceMappingURL=config.d.ts.map