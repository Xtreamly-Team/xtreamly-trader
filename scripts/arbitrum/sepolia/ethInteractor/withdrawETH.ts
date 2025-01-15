import { ethers } from "ethers";
import * as dotenv from "dotenv";
import wethGatewayAbi from "../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json";
import erc20Abi from "../../../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json"; // Standard ERC20 ABI
import * as dc from "../../../constants/_deployment_constants";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const WETH_GATEWAY = dc.ARB_SEP_WRAPPED_TOKEN_GATEWAY;
const A_WETH_ADDRESS = dc.A_WETH_ADDRESS_SEP; // Address of aWETH token

if (!RPC_URL || !DEPLOYER_PRIVATE_KEY || !WETH_GATEWAY || !A_WETH_ADDRESS) {
    throw new Error("Missing required environmental variables");
}

const argv = yargs(hideBin(process.argv))
    .option("amount", {
        type: "string",
        demandOption: true,
        describe: "Amount of ETH to withdraw (in ETH, e.g., 0.1). Pass 'max' to withdraw entire balance.",
    })
    .parseSync();

async function approveAWETH(
    aWETHContract: ethers.Contract,
    WETH_GATEWAY: string,
    amount: ethers.BigNumberish
) {
    console.log("Approving aWETH for withdrawal...");
    const tx = await aWETHContract.approve(WETH_GATEWAY, amount);
    console.log("Approval transaction sent. Hash:", tx.hash);
    await tx.wait();
    console.log("aWETH approval confirmed.");
}

async function withdrawETH(
    gatewayContract: ethers.Contract,
    signer: ethers.Signer,
    amountETH: ethers.BigNumberish
) {
    try {
        console.log("Initiating ETH withdrawal...");
        const tx = await gatewayContract.withdrawETH(
            await signer.getAddress(), 
            amountETH,                 
            await signer.getAddress()  
        );

        console.log("Transaction sent. Hash:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed. Block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error during withdrawETH execution:", error);
    }
}

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    const gatewayContract = new ethers.Contract(WETH_GATEWAY, wethGatewayAbi.abi, signer);

    const aWETHContract = new ethers.Contract(A_WETH_ADDRESS, erc20Abi.abi, signer);

    const amountETH = argv.amount === "max"
        ? ethers.MaxUint256
        : ethers.parseEther(argv.amount);

    console.log(`Withdrawing ${argv.amount === "max" ? "entire balance" : argv.amount} ETH (${amountETH.toString()} in Wei)...`);

    await approveAWETH(aWETHContract, WETH_GATEWAY, amountETH);

    await withdrawETH(gatewayContract, signer, amountETH);
}

main()
    .then(() => console.log("ETH withdrawal script executed successfully"))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
