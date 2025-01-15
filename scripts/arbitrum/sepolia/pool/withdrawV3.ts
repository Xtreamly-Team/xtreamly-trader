import { ethers } from "ethers";
import * as dotenv from "dotenv";
import poolAbi from "../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json";
import * as dc from "../../../constants/_deployment_constants";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE;
const USDC_ADDRESS = dc.USDC_ADDRESS_SEP;

if (!RPC_URL || !DEPLOYER_PRIVATE_KEY || !POOL_ADDRESS || !USDC_ADDRESS) {
    throw new Error("Missing required environmental variables");
}

const argv = yargs(hideBin(process.argv))
    .option("amount", {
        type: "string",
        demandOption: true,
        describe: "Amount of USDC to withdraw (in USDC, e.g., 50). Pass 'max' to withdraw all.",
    })
    .parseSync();

async function withdrawUSDC(
    poolContract: ethers.Contract,
    USDC_ADDRESS: string,
    signer: ethers.Signer,
    amount: ethers.BigNumberish
) {
    try {
        console.log("Initiating USDC withdrawal...");
        const tx = await poolContract.withdraw(
            USDC_ADDRESS,       // Asset to withdraw (USDC address)
            amount,             // Amount to withdraw (in smallest unit, i.e., Wei). Use max to withdraw all
            await signer.getAddress() // Recipient address
        );

        console.log("Transaction sent. Hash:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error during withdrawUSDC execution:", error);
    }
}

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    // Connect to the Aave Pool contract
    const poolContract = new ethers.Contract(POOL_ADDRESS, poolAbi.abi, signer);

    // Convert amount to smallest unit (Wei for USDC) or set to MAX_UINT256 for full withdrawal
    const amountUSDC = argv.amount === "max"
        ? ethers.MaxUint256
        : ethers.parseUnits(argv.amount, 6); // USDC has 6 decimals

    console.log(`Withdrawing ${argv.amount} USDC (${amountUSDC.toString()} in Wei) from Aave Pool...`);

    // Withdraw USDC
    await withdrawUSDC(poolContract, USDC_ADDRESS, signer, amountUSDC);
}

main()
    .then(() => console.log("USDC withdrawal script executed successfully"))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
