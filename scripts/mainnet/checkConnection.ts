import { ethers } from "hardhat";
import { formatMockExchangeObj } from "../../_JS_Test_Import/utils";

async function main() {
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Connected successfully. Current block number: ${blockNumber}`);
  } catch (error) {
    console.error("Error connecting to the provider:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat node --fork https://ethereum-mainnet.core.chainstack.com/ccac1b5240ceb54a547fdcf6a4b50f12