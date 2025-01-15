import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import yargs from 'yargs';
import * as dc from '../../../../../constants/_deployment_constants';
import { hideBin } from 'yargs/helpers';
import { balanceOf } from '../utils/balanceOf';

dotenv.config();

const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const WALLET_BALANCE_PROVIDER = dc.ARB_SEP_WALLET_BALANCE_PROVIDER!;

console.log(RPC_URL, WALLET_BALANCE_PROVIDER);
if (!RPC_URL || !WALLET_BALANCE_PROVIDER) {
    throw new Error("Missing required environment variables.");
}


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
    const user = argv.user as `0x${string}`;
    const token = argv.token as `0x${string}`;

    try {
        console.log(`Fetching balance for user ${user} and token ${token}...`);
        const balance = await balanceOf(RPC_URL, WALLET_BALANCE_PROVIDER as `0x${string}`, user, token);
        console.log(`Balance: ${balance.toString()} (in token's smallest unit)`);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

main()
    .then(() => console.log('Script executed successfully.'))
    .catch((error) => {
        console.error('Error executing script:', error);
        process.exit(1);
    });
