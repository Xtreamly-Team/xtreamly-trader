import { createPublicClient, http } from "viem";
import { getConfig } from "@xtreamly/utils/config";

export class Contract {
  publicClient: any

  constructor() {
    const chainDetails = getConfig().chain

    this.publicClient = createPublicClient({
      chain: chainDetails.viemChain,
      transport: http(chainDetails.rpc),
    });
  }

  async readContract(
    contractAddress: `0x${string}`,
    functionName: string,
    args: any[],
    abi: any,
  ) {
    return this.publicClient.readContract({
      address: contractAddress,
      abi,
      functionName,
      args,
    })
  }

  async writeContract(
    contractAddress: `0x${string}`,
    functionName: string,
    args: any[],
    abi: any,
  ) {
    return this.publicClient.readContract({
      address: contractAddress,
      abi,
      functionName,
      args,
    })
  }
}