import {
  BigNumber,
  Wallet,
  providers,
  utils
} from "ethers";
import {
  EthereumTransactionTypeExtended,
  InterestRate,
  Pool,
  UiPoolDataProvider,
  WalletBalanceProvider
} from "@aave/contract-helpers";
import type { Chain } from "viem/_types/types/chain";
import * as markets from "@bgd-labs/aave-address-book";
import { formatReserves, formatUserSummary } from "@aave/math-utils";
import dayjs from "dayjs";
import { getProvider, runSerially } from "@xtreamly/utils";


export class AaveActions {
  private signer: Wallet;
  private readonly provider: providers.JsonRpcProvider;
  private market: any;
  private pool: Pool;

  constructor(chain: Chain, provider: providers.JsonRpcProvider, signer: Wallet) {
    this.signer = signer;
    this.provider = provider;

    const market = Object.entries(markets).find(([key, value]) => key.startsWith("AaveV3") && value.CHAIN_ID === chain.id);

    if (!market) {
      throw Error("Unknown Aave v3 market for chain: " + chain.name);
    }

    this.market = market[1];

    this.pool = new Pool(getProvider(), {
      POOL: this.market.POOL,
      SWAP_COLLATERAL_ADAPTER: this.market.SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY: this.market.WETH_GATEWAY,
    });
  }

  async getBalance(token: string) {
    const t = new WalletBalanceProvider({
      walletBalanceProviderAddress: this.market.WALLET_BALANCE_PROVIDER,
      provider: this.provider,
    });
    const asset = this.market.ASSETS[token];
    const underlyingBalance = await t.balanceOf(this.signer.address, asset.UNDERLYING);
    const aTokenBalance = await t.balanceOf(this.signer.address, asset.A_TOKEN);
    return {
      token,
      tokenAddress: asset.UNDERLYING,
      underlyingBalance,
      balanceFormatted: utils.formatUnits(underlyingBalance, asset.decimals),
      aTokenBalance,
      aTokenBalanceFormatted: utils.formatUnits(aTokenBalance, asset.decimals),
    }
  }

  async getBalances() {
    const tokens = Object.keys(this.market.ASSETS);
    const calls = tokens.map((t) => this.getBalance(t));
    return Promise.all(calls);
  }

  async getUserSummary() {
    const currentTimestamp = dayjs().unix();

    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: this.market.UI_POOL_DATA_PROVIDER,
      provider: this.provider,
      chainId: this.market.CHAIN_ID,
    });

    const reserves = await poolDataProviderContract.getReservesHumanized({
      lendingPoolAddressProvider: this.market.POOL_ADDRESSES_PROVIDER,
    });
    const baseCurrencyData = reserves.baseCurrencyData;

    const userReserves = await poolDataProviderContract.getUserReservesHumanized({
      lendingPoolAddressProvider: this.market.POOL_ADDRESSES_PROVIDER,
      user: this.signer.address,
    });

    const formattedReserves = formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    return formatUserSummary({
      currentTimestamp,
      marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
      userReserves: userReserves.userReserves,
      formattedReserves,
      userEmodeCategoryId: userReserves.userEmodeCategoryId,
    });
  }

  async getTokenReserves(token: string) {
    const asset = this.market.ASSETS[token];
    const userSummary = await this.getUserSummary();
    const tokenReserves = userSummary.userReservesData.find((u) =>
      u.underlyingAsset.toLowerCase() === asset.UNDERLYING.toLowerCase()
    );

    if (!tokenReserves) {
      throw Error(`Unable to get token reserves for ${token}.`);
    }

    return tokenReserves;
  }

  async getAaveBalances() {
    const userSummary = await this.getUserSummary();

    return userSummary.userReservesData.map((userReserve) => {
      const tokenEntry = Object.entries(this.market.ASSETS)
        .find(([key, value]: [any, any]) =>
          value.UNDERLYING.toLowerCase() === userReserve.underlyingAsset.toLowerCase()
        );

      return {
        token: tokenEntry && tokenEntry[0],
        decimals: tokenEntry && (tokenEntry[1] as any).decimals,
        underlyingAsset: userReserve.underlyingAsset,
        scaledATokenBalance: userReserve.scaledATokenBalance,
        usageAsCollateralEnabledOnUser: userReserve.usageAsCollateralEnabledOnUser,
        scaledVariableDebt: userReserve.scaledVariableDebt,
        underlyingBalance: userReserve.underlyingBalance,
        underlyingBalanceMarketReferenceCurrency: userReserve.underlyingBalanceMarketReferenceCurrency,
        underlyingBalanceUSD: userReserve.underlyingBalanceUSD,
        variableBorrows: userReserve.variableBorrows,
        variableBorrowsMarketReferenceCurrency: userReserve.variableBorrowsMarketReferenceCurrency,
        variableBorrowsUSD: userReserve.variableBorrowsUSD,
        totalBorrows: userReserve.totalBorrows,
        totalBorrowsMarketReferenceCurrency: userReserve.totalBorrowsMarketReferenceCurrency,
        totalBorrowsUSD: userReserve.totalBorrowsUSD,
      };
    });
  }

  async getAaveBalance(token: string) {
    const balances = await this.getAaveBalances();
    return balances.find((b) => b.token === token);
  }

  async supply(amount: string, token: string) {
    // const token = WETH | USDCn;
    const asset = this.market.ASSETS[token];
    const txs: EthereumTransactionTypeExtended[] = await this.pool.supply({
      user: this.signer.address,
      reserve: asset.UNDERLYING,
      amount,
    });
    return await this.submitTransactions(txs);
  }

  async withdrawAll(token: string) {
    // const token = WETH | USDCn;
    const tokenReserves = await this.getTokenReserves(token);
    return this.withdraw(tokenReserves.underlyingBalance, token);
  }

  async withdraw(amount: string, token: string) {
    // const token = WETH | USDCn;
    const asset = this.market.ASSETS[token];
    const txs: EthereumTransactionTypeExtended[] = await this.pool.withdraw({
      user: this.signer.address,
      reserve: asset.UNDERLYING,
      amount,
      aTokenAddress: asset.A_TOKEN,
    });
    return await this.submitTransactions(txs);
  }

  async borrow(amount: string, token: string) {
    // const token = WETH | USDCn;
    const asset = this.market.ASSETS[token];
    const txs: EthereumTransactionTypeExtended[] = await this.pool.borrow({
      user: this.signer.address,
      reserve: asset.UNDERLYING,
      amount,
      interestRateMode: InterestRate.Variable,
    });
    return await this.submitTransactions(txs);
  }

  async repay(amount: string, token: string) {
    // const token = WETH | USDCn;
    const asset = this.market.ASSETS[token];
    this.market.ASSETS.USDCn;
    const txs: EthereumTransactionTypeExtended[] = await this.pool.repay({
      user: this.signer.address,
      reserve: asset.UNDERLYING,
      amount,
      interestRateMode: InterestRate.Variable,
    });
    return await this.submitTransactions(txs);
  }

  async submitTransactions(txs: EthereumTransactionTypeExtended[]) {
    return runSerially<any>(txs.map((tx) => () => this.submitTransaction(tx)));
  }

  async submitTransaction(tx: EthereumTransactionTypeExtended){
    const txData = await tx.tx();
    console.log(txData);
    const transactionResponse = await this.signer.sendTransaction({
      ...txData,
      value: txData.value ? BigNumber.from(txData.value) : undefined,
    });
    return await transactionResponse.wait();
  }
}