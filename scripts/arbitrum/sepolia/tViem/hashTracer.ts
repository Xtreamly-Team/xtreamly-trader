import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

(async () => {
  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(`https://arbitrum-sepolia.gateway.tenderly.co/${process.env.TENDERLY_NODE_ACCESS_KEY}`),
  });

  const txTrace: any = await client.request({
    //@ts-ignore
    method: "tenderly_traceTransaction",
    params: [
      // transaction hash
      "0x53777a4e9c92a1723b486e2d979627329974696d9e85804e026c1b172fe4aae0",
    ],
  });


  console.log("Logs");
  console.log(JSON.stringify(txTrace.logs, null, 2));
  console.log("=======================================================");
  console.log("Asset Changes");
  console.log(JSON.stringify(txTrace.assetChanges, null, 2));
  console.log("=======================================================");
  console.log("Balance Changes");
  console.log(JSON.stringify(txTrace.balanceChanges, null, 2));
  console.log("=======================================================");
  console.log("Full trace");
  console.log(JSON.stringify(txTrace, null, 1));
})();
