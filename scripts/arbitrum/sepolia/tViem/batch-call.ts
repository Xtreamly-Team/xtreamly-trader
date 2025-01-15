import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

const TENDERLY_NODE_ACCESS_KEY = process.env.TENDERLY_NODE_ACCESS_KEY ?? "";

(async () => {
  if (!TENDERLY_NODE_ACCESS_KEY) {
    console.warn(
      "You're using public node that is rate limited. Please create a https://dashboard.tenderly.co)",
    );
  }



  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(`https://arbitrum-sepolia.gateway.tenderly.co/${process.env.TENDERLY_NODE_ACCESS_KEY}`),
  });

  const [blockNumber, balance, ensName] = await Promise.all([
    client.getBlockNumber(),
    client.getBalance({ address: "0xf2873f92324e8ec98a82c47afa0e728bd8e41665" }),
    // client.getEnsName({ address: "0xf2873f92324e8ec98a82c47afa0e728bd8e41665" }),
    client.getChainId(),
  ]);
  console.log("Results are in");
  console.log({ blockNumber, balance, ensName });

  //  So will this
  const bnPromise = client.getBlockNumber();

  const balancePromise = client.getBalance({
    address: "0xf2873f92324e8ec98a82c47afa0e728bd8e41665",
  });

  console.log(await bnPromise);
  console.log(await balancePromise);
})();
