import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as dc from '../../../../constants/_deployment_constants';
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import poolAbi from "../../../../../artifacts/contracts/interfaces/aaveV3/IL2PoolV3.sol/IL2PoolV3.json"
dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE;

if (!RPC_URL) {
    throw new Error("No RPC_URL set in .env file.");
} 

const argv = yargs(hideBin(process.argv))
    .option("token", {
        type: "string",
        demandOption: true,
        describe: "Token address of the underlying Asset",
    })
    .parseSync(); 

console.log("Token address:", argv.token);

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);


 const poolContract = new ethers.Contract(POOL_ADDRESS, poolAbi.abi, provider);


console.log(`Fetching reserve data for asset: ${argv.token}`);
const reserveData = await poolContract.getReserveData(argv.token);


console.log("Reserve Data:", reserveData);


}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
