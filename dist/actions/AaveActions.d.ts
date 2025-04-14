import { BigNumber, Wallet, providers } from "ethers";
import { EthereumTransactionTypeExtended } from "@aave/contract-helpers";
import type { Chain } from "viem/_types/types/chain";
export declare class AaveActions {
    private signer;
    private readonly provider;
    private market;
    private pool;
    constructor(chain: Chain, provider: providers.JsonRpcProvider, signer: Wallet);
    getBalance(token: string): Promise<{
        token: string;
        tokenAddress: any;
        underlyingBalance: BigNumber;
        balanceFormatted: string;
        aTokenBalance: BigNumber;
        aTokenBalanceFormatted: string;
    }>;
    getBalances(): Promise<{
        token: string;
        tokenAddress: any;
        underlyingBalance: BigNumber;
        balanceFormatted: string;
        aTokenBalance: BigNumber;
        aTokenBalanceFormatted: string;
    }[]>;
    getUserSummary(): Promise<import("@aave/math-utils").FormatUserSummaryResponse<import("@aave/contract-helpers").ReserveDataHumanized & import("@aave/math-utils").FormatReserveUSDResponse>>;
    getTokenReserves(token: string): Promise<import("@aave/math-utils").ComputedUserReserve<import("@aave/contract-helpers").ReserveDataHumanized & import("@aave/math-utils").FormatReserveUSDResponse>>;
    getAaveBalances(): Promise<{
        token: string | undefined;
        decimals: any;
        underlyingAsset: string;
        scaledATokenBalance: string;
        usageAsCollateralEnabledOnUser: boolean;
        scaledVariableDebt: string;
        underlyingBalance: string;
        underlyingBalanceMarketReferenceCurrency: string;
        underlyingBalanceUSD: string;
        variableBorrows: string;
        variableBorrowsMarketReferenceCurrency: string;
        variableBorrowsUSD: string;
        totalBorrows: string;
        totalBorrowsMarketReferenceCurrency: string;
        totalBorrowsUSD: string;
    }[]>;
    getAaveBalance(token: string): Promise<{
        token: string | undefined;
        decimals: any;
        underlyingAsset: string;
        scaledATokenBalance: string;
        usageAsCollateralEnabledOnUser: boolean;
        scaledVariableDebt: string;
        underlyingBalance: string;
        underlyingBalanceMarketReferenceCurrency: string;
        underlyingBalanceUSD: string;
        variableBorrows: string;
        variableBorrowsMarketReferenceCurrency: string;
        variableBorrowsUSD: string;
        totalBorrows: string;
        totalBorrowsMarketReferenceCurrency: string;
        totalBorrowsUSD: string;
    } | undefined>;
    supply(amount: string, token: string): Promise<any[]>;
    withdrawAll(token: string): Promise<any[]>;
    withdraw(amount: string, token: string): Promise<any[]>;
    borrow(amount: string, token: string): Promise<any[]>;
    repay(amount: string, token: string): Promise<any[]>;
    submitTransactions(txs: EthereumTransactionTypeExtended[]): Promise<any[]>;
    submitTransaction(tx: EthereumTransactionTypeExtended): Promise<providers.TransactionReceipt>;
}
//# sourceMappingURL=AaveActions.d.ts.map