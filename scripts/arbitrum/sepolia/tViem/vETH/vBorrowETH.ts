import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import poolAbi from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json'; 
import wethGatewayAbi from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json';
import debtTokenAbi from '../../../../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/tokenization/VariableDebtToken.sol/VariableDebtToken.json';
import * as dotenv from 'dotenv';
import * as dc from '../../../../constants/_deployment_constants';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

// const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;
const RPC_URL = process.env.TENDERLY_ARB_SEP!;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;
const WETH_GATEWAY = dc.ARB_SEP_WRAPPED_TOKEN_GATEWAY; // 0x20040a64612555042335926d72B4E5F667a67fA1
const VARIABLE_DEBT_WETH = dc.ARB_SEP_VARIABLE_DEBT_WETH; // 0x486C2D3F59E4d72f3cAa301a7eF19E3db657F5b0
const AAVE_POOL_ADDRESS = dc.ARB_SEP_V3_POOL_AAVE; //0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff

const MaxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

if (!RPC_URL || !DEPLOYER_PRIVATE_KEY || !WETH_GATEWAY || !VARIABLE_DEBT_WETH || !AAVE_POOL_ADDRESS) {
    throw new Error("Missing required environment variables.");
}

const argv = yargs(hideBin(process.argv))
    .option('amount', {
        type: 'string',
        demandOption: true,
        describe: "Amount of ETH to borrow (in ETH, e.g., '0.1').",
    })
    .parseSync();

async function main() {
    const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY as `0x${string}`);

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

    const debtTokenContract = {
        address: VARIABLE_DEBT_WETH,
        abi: debtTokenAbi.abi,
    };

    const amountETH = parseEther(argv.amount);

    console.log(`Approving credit delegation for ${argv.amount} ETH (${amountETH} Wei)...`);

    // Approve credit delegation for the WrappedTokenGateway
    const approveDelegationTx = await walletClient.writeContract({
        ...debtTokenContract,
        functionName: 'approveDelegation',
        args: [WETH_GATEWAY, amountETH], // Max delegation to avoid future approvals
    });

    console.log(`Delegation approval transaction sent. Hash: ${approveDelegationTx}`);
    await publicClient.waitForTransactionReceipt({ hash: approveDelegationTx });

    console.log(`Credit delegation approved for ${argv.amount} ETH.`);

    // Borrow ETH via the WETH Gateway
    console.log(`Borrowing ${argv.amount} ETH (${amountETH} Wei) using variable interest rate...`);
    const borrowTx = await walletClient.writeContract({
        ...gatewayContract,
        functionName: 'borrowETH',
        args: [
            AAVE_POOL_ADDRESS, 
            amountETH,         
            2,                 
            0                  
        ],
    });

    console.log(`Borrow transaction sent. Hash: ${borrowTx}`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: borrowTx });

    console.log(`ETH successfully borrowed! Transaction confirmed in block: ${receipt.blockNumber}`);
}

main()
    .then(() => console.log('Script executed successfully.'))
    .catch((error) => {
        console.error('Error executing script:', error);
        process.exit(1);
    });