import { getChainDetails } from "@xtreamly/constants/helpers";
import { getConfig } from "@xtreamly/utils/config";
import { createPublicClient, http, PublicClient } from "viem";

export class Contract {
  publicClient: PublicClient

  constructor() {
    const config = getConfig()
    const chainDetails = getChainDetails()

    this.publicClient = createPublicClient({
      chain: chainDetails.viemChain,
      transport: http(config.rpc),
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