import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import yargs from 'yargs';
import WalletBalanceProvider from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WalletBalanceProvider.sol/WalletBalanceProvider.json'; 
import * as dc from '../../../../constants/_deployment_constants';
import { hideBin } from 'yargs/helpers';

dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const WALLET_BALANCE_PROVIDER = dc.ARB_SEP_WALLET_BALANCE_PROVIDER!; // WalletBalanceProvider contract address


if (!RPC_URL || !WALLET_BALANCE_PROVIDER) {
    throw new Error("Missing required environment variables.");
}
// User
// 0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665
// USDC Addr
// 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d

// const RPC_URL = process.env.TENDERLY_ARB_SEP!;


// if (!RPC_URL || !POOL_DATA_PROVIDER) {
//     throw new Error("Missing required environment variables.");
// }

const argv = yargs(hideBin(process.argv))
    .option('user', {
        type: 'string',
        demandOption: true,
        describe: "Address of the user (e.g., '0xYourUserAddress').",
    })
    .option('token', {
        type: 'string',
        demandOption: true,
        describe: "Address of the token (e.g., '0xYourTokenAddress').",
    })
    .parseSync();

    async function main() {
        const publicClient = createPublicClient({
            chain: arbitrumSepolia,
            transport: http(RPC_URL),
        });
    
        const balanceProviderContract = {
            address: WALLET_BALANCE_PROVIDER as `0x${string}`,
            abi: WalletBalanceProvider.abi,
        };
    
        const userAddress = argv.user
        const tokenAddress = argv.token
    
        console.log(`Fetching balance for user ${userAddress} and token ${tokenAddress}...`);
    
        const balance = await publicClient.readContract({
            ...balanceProviderContract,
            functionName: 'balanceOf',
            args: [userAddress, tokenAddress],
        });
    
        console.log(`Balance of user ${userAddress} for token ${tokenAddress}: ${balance} (in token's smallest units)`);
    }

main()
    .then(() => console.log('Script executed successfully.'))
    .catch((error) => {
        console.error('Error executing script:', error);
        process.exit(1);
    });
