import { PublicClient } from "viem";
export declare class Contract {
    publicClient: PublicClient;
    constructor();
    readContract(contractAddress: `0x${string}`, functionName: string, args: any[], abi: any): Promise<unknown>;
    writeContract(contractAddress: `0x${string}`, functionName: string, args: any[], abi: any): Promise<unknown>;
}
//# sourceMappingURL=contracts.d.ts.map