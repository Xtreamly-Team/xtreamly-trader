import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import erc20Abi from '../../../../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json'; // Standard ERC20 ABI
import poolAbi from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json';
import * as dotenv from 'dotenv';
import * as dc from '../../../../constants/_deployment_constants';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const DEPLOYER_PRIVATE_KEY = process.env.VIEM_PRIVATE_KEY!;
const POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE;
const USDC_ADDRESS = dc.USDC_ADDRESS_SEP;
const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY as `0x${string}`);

if (!RPC_URL || !DEPLOYER_PRIVATE_KEY || !POOL_ADDRESS || !USDC_ADDRESS) {
    throw new Error("Missing required environment variables.");
}

const argv = yargs(hideBin(process.argv))
    .option('amount', {
        type: 'string',
        demandOption: true,
        describe: "Amount of USDC to supply (in whole numbers, e.g., '100' for 100 USDC).",
    })
    .parseSync();

async function main() {
    // Convert private key to account
    // const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);

    // Create wallet and public clients
    const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(RPC_URL),
    });

    const walletClient = createWalletClient({
        chain: arbitrumSepolia,
        transport: http(RPC_URL),
        account: account,
    });

    const deployerAddress = account.address;

    // Initialize contract instances
    const usdcContract = {
        address: USDC_ADDRESS,
        abi: erc20Abi.abi,
    };

    const poolContract = {
        address: POOL_ADDRESS,
        abi: poolAbi.abi,
    };

    // Parse the amount to supply in USDC (6 decimals)
    const amountUSDC = parseUnits(argv.amount, 6); // USDC has 6 decimals
    console.log(`Supplying ${argv.amount} USDC (${amountUSDC} Wei)...`);

    // Approve USDC for the Pool contract
    console.log('Approving USDC transfer...');
    const approveTx = await walletClient.writeContract({
        ...usdcContract,
        functionName: 'approve',
        args: [POOL_ADDRESS, amountUSDC],
    });
    console.log(`Approval transaction sent. Hash: ${approveTx}`); // Directly use approveTx as the transaction hash
    await publicClient.waitForTransactionReceipt({ hash: approveTx }); // Use approveTx directly here

    // Supply USDC to Aave
    console.log('Supplying USDC to Aave...');
    const supplyTx = await walletClient.writeContract({
        ...poolContract,
        functionName: 'supply',
        args: [USDC_ADDRESS, amountUSDC, deployerAddress, 0], // Last argument is `referralCode` (0 if not used)
    });
    console.log(`Supply transaction sent. Hash: ${supplyTx}`); // Directly use supplyTx as the transaction hash
    const receipt = await publicClient.waitForTransactionReceipt({ hash: supplyTx }); // Use supplyTx directly here

    console.log(`USDC successfully supplied! Transaction confirmed in block: ${receipt.blockNumber}`);
}

// Execute script
main()
    .then(() => console.log('Script executed successfully.'))
    .catch((error) => {
        console.error('Error executing script:', error);
        process.exit(1);
    });
