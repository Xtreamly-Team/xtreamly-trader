import { createPublicClient, PublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

export const balanceOf = async (
    rpcUrl: string,
    walletBalanceProvider: `0x${string}`,
    user: `0x${string}`,
    token: `0x${string}`
): Promise<bigint> => {
    const publicClient: PublicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(rpcUrl),
    });

    try {
        const balance: bigint = await publicClient.readContract({
            address: walletBalanceProvider,
            abi: [
                {
                    inputs: [
                        { internalType: 'address', name: 'user', type: 'address' },
                        { internalType: 'address', name: 'token', type: 'address' },
                    ],
                    name: 'balanceOf',
                    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                    stateMutability: 'view',
                    type: 'function',
                },
            ],
            functionName: 'balanceOf',
            args: [user, token],
        });

        return balance;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
};
