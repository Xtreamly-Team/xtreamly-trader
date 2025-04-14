export declare class Contract {
    publicClient: any;
    constructor();
    readContract(contractAddress: `0x${string}`, functionName: string, args: any[], abi: any): Promise<any>;
    writeContract(contractAddress: `0x${string}`, functionName: string, args: any[], abi: any): Promise<any>;
}
//# sourceMappingURL=contracts.d.ts.map