import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import yargs from 'yargs';
import WalletBalanceProvider from '../../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WalletBalanceProvider.sol/WalletBalanceProvider.json'; 
import * as dc from '../../../../../constants/_deployment_constants';
import { hideBin } from 'yargs/helpers';
import { getUserWalletBalances } from '../utils/GetUserWalletBalances';


dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const WALLET_BALANCE_PROVIDER = dc.ARB_SEP_WALLET_BALANCE_PROVIDER!; 
const POOL_ADDRESSES_PROVIDER = dc.ARB_SEP_POOL_ADDRESSES_PROVIDER;
const POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE;

if (!RPC_URL || !WALLET_BALANCE_PROVIDER) {
    throw new Error("Missing required environment variables.");
}

const argv = yargs(hideBin(process.argv))
    .option('user', {
        type: 'string',
        demandOption: true,
        describe: "Address of the user (e.g., '0xYourUserAddress').",
    })
    .parseSync();

    async function main() {
        const userAddress = argv.user as `0x${string}`;
    
        console.log(`Fetching wallet balances for user: ${userAddress}`);
    
        try {
            const balances = await getUserWalletBalances(
                RPC_URL,
                WALLET_BALANCE_PROVIDER,
                POOL_ADDRESSES_PROVIDER,
                userAddress,
                WalletBalanceProvider.abi
            );
    
            console.log(`Balances for user ${userAddress}:`, balances);
        } catch (error) {
            console.error('Error fetching wallet getBalances:', error);
        }
    }
    
    main()
        .then(() => console.log('Script executed successfully.'))
        .catch((error) => {
            console.error('Error executing script:', error);
            process.exit(1);
        });
    