import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

export const getUserWalletBalances = async (
    rpcUrl: string,
    walletBalanceProvider: `0x${string}`,
    poolAddressesProvider: `0x${string}`,
    user: `0x${string}`,
    abi: any
): Promise<any> => {
    // Create a public client
    const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(rpcUrl),
    });

    try {
        const balance = await publicClient.readContract({
            address: walletBalanceProvider,
            abi: abi,
            functionName: 'getUserWalletBalances',
            args: [poolAddressesProvider, user],
        });

        return balance;
    } catch (error) {
        console.error('Error fetching wallet getBalances:', error);
        throw error;
    }
};
