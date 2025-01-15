import { ethers } from "ethers";
import * as dotenv from "dotenv";
import poolAbi from "../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json";
import erc20Abi from "../../../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json"; // Standard ERC20 ABI
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
        describe: "Amount of USDC to repay (in USDC, e.g., 50). Pass 'max' to repay all.",
    })
    .parseSync();

async function approveUSDC(
    usdcContract: ethers.Contract,
    POOL_ADDRESS: string,
    amount: ethers.BigNumberish
) {
    console.log("Approving USDC for repayment...");
    const tx = await usdcContract.approve(POOL_ADDRESS, amount);
    console.log("Approval transaction sent. Hash:", tx.hash);
    await tx.wait();
    console.log("USDC approval confirmed.");
}

async function repayUSDC(
    poolContract: ethers.Contract,
    USDC_ADDRESS: string,
    signer: ethers.Signer,
    amount: ethers.BigNumberish,
) {
    try {
        console.log("Initiating USDC repayment...");
        const tx = await poolContract.repay(
            USDC_ADDRESS,
            amount,      
            2,   
            await signer.getAddress() 
        );

        console.log("Transaction sent. Hash:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error during repayUSDC execution:", error);
    }
}

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    const poolContract = new ethers.Contract(POOL_ADDRESS, poolAbi.abi, signer);

    const usdcContract = new ethers.Contract(USDC_ADDRESS, erc20Abi.abi, signer);

    // Convert amount to smallest unit (Wei for USDC) or set to MAX_UINT256 for full repayment
    const amountUSDC = argv.amount === "max"
        ? ethers.MaxUint256
        : ethers.parseUnits(argv.amount, 6);

    console.log(`Repaying ${argv.amount} USDC (${amountUSDC.toString()} in Wei) to Aave Pool...`);

    await approveUSDC(usdcContract, POOL_ADDRESS, amountUSDC);

    await repayUSDC(poolContract, USDC_ADDRESS, signer, amountUSDC);
}

main()
    .then(() => console.log("USDC repayment script executed successfully"))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
