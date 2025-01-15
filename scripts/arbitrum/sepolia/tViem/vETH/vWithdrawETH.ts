import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import wethGatewayAbi from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json';
import erc20Abi from '../../../../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json'; // Standard ERC20 ABI
import * as dotenv from 'dotenv';
import * as dc from '../../../../constants/_deployment_constants';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

// const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const RPC_URL = process.env.TENDERLY_ARB_SEP!;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const WETH_GATEWAY = dc.ARB_SEP_WRAPPED_TOKEN_GATEWAY;
const A_WETH_ADDRESS = dc.A_WETH_ADDRESS_SEP;
const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY as `0x${string}`);

if (!RPC_URL || !DEPLOYER_PRIVATE_KEY || !WETH_GATEWAY || !A_WETH_ADDRESS) {
    throw new Error("Missing required environment variables.");
}

const argv = yargs(hideBin(process.argv))
    .option('amount', {
        type: 'string',
        demandOption: true,
        describe: "Amount of ETH to withdraw (in ETH, e.g., '0.1'). Pass 'max' to withdraw the entire balance.",
    })
    .parseSync();
    async function main() {
    
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
        const gatewayContract = {
            address: WETH_GATEWAY,
            abi: wethGatewayAbi.abi,
        };
    
        const aWETHContract = {
            address: A_WETH_ADDRESS,
            abi: erc20Abi.abi,
        };
    
        // Determine withdrawal amount
        const aWETHBalance = await publicClient.readContract({
            ...aWETHContract,
            functionName: 'balanceOf',
            args: [deployerAddress],
        });
    
        const amountETH =
            argv.amount === 'max'
                ? aWETHBalance // Withdraw full balance if 'max'
                : parseEther(argv.amount); // Parse specified amount in ETH
    
        console.log(
            `Attempting to withdraw ${
                argv.amount === 'max' ? 'entire balance' : `${argv.amount} ETH`
            } (${amountETH} Wei)...`
        );
    
        // Approve aWETH for the WETH gateway
        console.log('Approving aWETH transfer...');
        const approveTx = await walletClient.writeContract({
            ...aWETHContract,
            functionName: 'approve',
            args: [WETH_GATEWAY, amountETH],
        });
        console.log(`Approval transaction sent. Hash: ${approveTx}`);
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
    
        // Withdraw ETH
        console.log('Initiating ETH withdrawal...');
        const withdrawTx = await walletClient.writeContract({
            ...gatewayContract,
            functionName: 'withdrawETH',
            args: [deployerAddress, amountETH, deployerAddress],
        });
        console.log(`Withdrawal transaction sent. Hash: ${withdrawTx}`);
        const receipt = await publicClient.waitForTransactionReceipt({ hash: withdrawTx });
    
        console.log(`ETH successfully withdrawn! Transaction confirmed in block: ${receipt.blockNumber}`);
    }
    
    // Execute script
    main()
        .then(() => console.log('Script executed successfully.'))
        .catch((error) => {
            console.error('Error executing script:', error);
            process.exit(1);
        });