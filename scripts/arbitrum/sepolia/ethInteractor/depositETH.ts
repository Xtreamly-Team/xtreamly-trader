import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as dc from '../../../constants/_deployment_constants';
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import poolAbi from "../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json"
import wethGateway from "../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json"
dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;

if (!RPC_URL) {
    throw new Error("No RPC_URL set in .env file.");
} 

const argv = yargs(hideBin(process.argv))
    .option("amount", {
        type: "string",
        demandOption: true,
        describe: "Token address of the underlying Asset",
    })
    .parseSync(); 

console.log("Amount in ETH to be deposited:", argv.amount);


async function depositETH(
    gatewayContract: ethers.Contract,
    POOL_ADDRESS: string,
    signer: ethers.Signer,
    amountETH: ethers.BigNumberish
) {
    try {
        console.log("Initiating ETH deposit...");
        const tx = await gatewayContract.depositETH(
            POOL_ADDRESS, // Address of the Aave Lending Pool
            await signer.getAddress(), // On behalf of the signer
            0, // Referral code (0 if not applicable)
            {
                value: amountETH, // Amount of ETH to deposit
            }
        );

        console.log("Transaction sent. Hash:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Block:", receipt.blockNumber);
    } catch (error) {
        console.error("Error during depositETH execution:", error);
    }
}

async function main() {
    // Set up provider and signer
    const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY!;

    if (!RPC_URL || !privateKey) {
        throw new Error("Missing RPC_URL or PRIVATE_KEY in .env file");
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);

    // Contract setup
    const WETH_GATEWAY = dc.ARB_SEP_WRAPPED_TOKEN_GATEWAY;
    const POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE;

    if (!WETH_GATEWAY || !POOL_ADDRESS) {
        throw new Error("Missing GATEWAY_ADDRESS or LENDING_POOL_ADDRESS in .env file");
    }

    const gatewayContract = new ethers.Contract(WETH_GATEWAY, wethGateway.abi, signer); 

    const amountETH = ethers.parseEther(argv.amount);
    console.log(`Amount ETH beeing supplied, ${amountETH}`);
    await depositETH(gatewayContract, POOL_ADDRESS, signer, amountETH);
}

main()
    .then(() => console.log("ETH deposit script executed successfully"))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
