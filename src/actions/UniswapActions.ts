import { ethers, Wallet, providers } from "ethers";
import { Chain } from "viem/_types/types/chain";

import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Pool, Route, Trade, computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import { abi as SwapRouterABI } from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";

const QuoterABI = [
  {
    "name": "quoteExactInputSingle",
    "type": "function",
    "inputs": [
      { "name": "tokenIn", "type": "address" },
      { "name": "tokenOut", "type": "address" },
      { "name": "fee", "type": "uint24" },
      { "name": "amountIn", "type": "uint256" },
      { "name": "sqrtPriceLimitX96", "type": "uint160" },
    ],
    "outputs": [
      { "name": "amountOut", "type": "uint256" },
    ],
    "stateMutability": "view",
  },
];


// Example ERC-20 ABI fragment for approvals and balance
const ERC20_ABI = [
  "function approve(address spender, uint amount) external returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

export class UniswapActions {
  private signer: Wallet;
  private readonly provider: providers.JsonRpcProvider;
  private chain: any;

  constructor(chain: Chain, provider: providers.JsonRpcProvider, signer: Wallet) {
    this.signer = signer;
    this.provider = provider;
    this.chain = chain;
  }

  async swapV2(
    token0Amount: string,
    token0Address: string,
    token1Address: string,
  ): Promise<string> {
    const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, this.signer);
    const decimals0 = await token0Contract.decimals();
    const token0AmountWEI = ethers.utils.parseUnits(token0Amount, decimals0).toString();

    const UNISWAP_ROUTER_ADDRESS = "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506";
    const routerAbi = [
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    ];
    const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, routerAbi, this.signer);

    const allowance = await token0Contract.allowance(this.signer.address, UNISWAP_ROUTER_ADDRESS);
    if (allowance.lt(token0AmountWEI)) {
      const approveTx = await token0Contract.approve(UNISWAP_ROUTER_ADDRESS, token0AmountWEI);
      await approveTx.wait();
    }

    const tx = await router.swapExactTokensForTokens(
      token0AmountWEI,
      0, // Accept any amount of output (for simplicity, in production you might want slippage protection)
      [token0Address, token1Address],
      this.signer.address,
      Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes from now
    );

    const receipt = await tx.wait();

    const logs = receipt.logs.filter((l: any) => l.address.toLowerCase() === token1Address.toLowerCase());

    let amountOutReal = undefined;
    for (const log of logs) {
      const parsedLog = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ]).parseLog(log);

      if (parsedLog.args.to.toLowerCase() === this.signer.address.toLowerCase()) {
        amountOutReal = parsedLog.args.value;
        break;
      }
    }

    const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, this.provider);
    const decimals1 = await token1Contract.decimals();
    return amountOutReal && ethers.utils.formatUnits(amountOutReal, decimals1);
  }

  async swapV3(
    token0Amount: string,
    token0Address: string,
    token1Address: string,
  ): Promise<string> {
    const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, this.provider);
    const decimals0 = await token0Contract.decimals();
    const token0 = new Token(this.chain.id, token0Address, decimals0);

    const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, this.provider);
    const decimals1 = await token1Contract.decimals();
    const token1 = new Token(this.chain.id, token1Address, decimals1);

    const poolAddress = computePoolAddress({
      factoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984", // Uniswap V3 Factory on Arbitrum
      tokenA: token0,
      tokenB: token1,
      fee: FeeAmount.MEDIUM, // 0.3% = 3000
    });

    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, this.provider);
    const slot0 = await poolContract.slot0();
    const liquidity = await poolContract.liquidity();

    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // Uniswap V3 Quoter on Arbitrum
    const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, this.provider);

    // TODO: This is failing
    // const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    //   token0.address,
    //   token1.address,
    //   FeeAmount.MEDIUM,
    //   ethers.utils.parseUnits(token0Amount, token0.decimals),
    //   slot0.sqrtPriceX96.toString(),
    // );

    // TODO: This is failing
    const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router on Arbitrum
    const swapRouterContract = new ethers.Contract(swapRouterAddress, SwapRouterABI, this.signer);
    const tx = await swapRouterContract.exactInputSingle({
      tokenIn: token0.address,
      tokenOut: token1.address,
      fee: FeeAmount.MEDIUM,
      recipient: await this.signer.getAddress(),
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      amountIn: ethers.utils.parseUnits(token0Amount, token0.decimals),
      amountOutMinimum: 0,
      // amountOutMinimum: quotedAmountOut.mul(95).div(100), // 5% slippage
      sqrtPriceLimitX96: 0,
    });
    const receipt = await tx.wait();

    const logs = receipt.logs.filter((l: any) => l.address.toLowerCase() === token1.address.toLowerCase());
    console.log(logs);

    let amountOutReal = ethers.BigNumber.from(0);
    for (const log of logs) {
      const parsedLog = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ]).parseLog(log);
      console.log(parsedLog);

      if (parsedLog.args.to.toLowerCase() === this.signer.address.toLowerCase()) {
        amountOutReal = parsedLog.args.value;
        break;
      }
    }

    return ethers.utils.formatUnits(amountOutReal, token1.decimals);
  }
}
