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
        describe: "Amount of USDC to supply (in USDC, e.g., 100)",
    })
    .parseSync();

async function approveUSDC(
    usdcContract: ethers.Contract,
    POOL_ADDRESS: string,
    amount: ethers.BigNumberish
) {
    console.log("Approving USDC for Aave Pool...");
    const tx = await usdcContract.approve(POOL_ADDRESS, amount);
    console.log("Approval transaction sent. Hash:", tx.hash);
    await tx.wait();
    console.log("USDC approval confirmed.");
}

async function supplyUSDC(
    poolContract: ethers.Contract,
    USDC_ADDRESS: string,
    signer: ethers.Signer,
    amount: ethers.BigNumberish
) {
    try {
        console.log("Supplying USDC to Aave Pool...");
        const tx = await poolContract.supply(
            USDC_ADDRESS,       // Asset to supply (USDC address)
            amount,             // Amount to supply (in smallest unit, i.e., Wei)
            await signer.getAddress(), // On behalf of the signer
            0                   // Referral code (set to 0 if not using referrals)
        );

        console.log("Transaction sent. Hash:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed. Block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error during supplyUSDC execution:", error);
    }
}

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    const poolContract = new ethers.Contract(POOL_ADDRESS, poolAbi.abi, signer);

    const usdcContract = new ethers.Contract(USDC_ADDRESS, erc20Abi.abi, signer);

    const amountUSDC = ethers.parseUnits(argv.amount, 6); // USDC has 6 decimals

    console.log(`Supplying ${argv.amount} USDC (${amountUSDC.toString()} in Wei) to Aave Pool...`);

    await approveUSDC(usdcContract, POOL_ADDRESS, amountUSDC);

    await supplyUSDC(poolContract, USDC_ADDRESS, signer, amountUSDC);
}

main()
    .then(() => console.log("USDC supply script executed successfully"))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
