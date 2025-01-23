import { ChainDetails, getChainDetails } from "@xtreamly/constants";
import { Contract, Wallet, parseEther, MaxUint256, BigNumberish, parseUnits } from "ethers";
import wethGateway
  from "@artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json";
import erc20Abi from "@artifacts/contracts/interfaces/IERC20.sol/IERC20.json";
import poolAbi from "@artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json";

export class AaveActions {
  private signer: Wallet;
  private chainDetails: ChainDetails;
  private gatewayContract: Contract;
  private aavePoolV3Contract: Contract;

  constructor(signer: Wallet) {
    this.signer = signer
    this.chainDetails = getChainDetails()

    this.gatewayContract = new Contract(this.chainDetails.WRAPPED_TOKEN_GATEWAY, wethGateway.abi, signer);
    this.aavePoolV3Contract = new Contract(this.chainDetails.V3_POOL_AAVE, poolAbi.abi, this.signer);
  }

  async depositETH(amountETH: number) {
    const tx = await this.gatewayContract.depositETH(
      this.chainDetails.V3_POOL_AAVE, // Address of the Aave Lending Pool
      await this.signer.getAddress(), // On behalf of the signer
      0, // Referral code (0 if not applicable)
      {
        value: parseEther(amountETH.toString()), // Amount of ETH to deposit
      }
    );

    return tx.wait();
  }

  async withdrawETH(amountETH: number | "max") {
    const amount = amountETH === "max" ? MaxUint256 : parseEther(amountETH.toString())

    await this.approveAWETH(amount)

    const address = await this.signer.getAddress();
    const tx = await this.gatewayContract.withdrawETH(address, amount, address);
    return tx.wait()
  }

  async withdrawUSDC(amount: number | "max") {
    const parsedAmount = amount === "max" ? MaxUint256 : parseUnits(amount.toString(), 6)

    const address = await this.signer.getAddress();
    const tx = await this.aavePoolV3Contract.withdraw(this.chainDetails.TOKENS.USDC, parsedAmount, address);
    return tx.wait()
  }

  async approveAWETH(amount: bigint) {
    return this.approve(amount, this.chainDetails.TOKENS.A_WETH, this.chainDetails.WRAPPED_TOKEN_GATEWAY)
  }

  async supplyUSDC(amount: number) {
    const parsedAmount = parseUnits(amount.toString(), 6);
    await this.approve(parsedAmount, this.chainDetails.TOKENS.USDC, this.chainDetails.V3_POOL_AAVE);

    const tx = await this.aavePoolV3Contract.supply(
      this.chainDetails.TOKENS.USDC,       // Asset to supply (USDC address)
      parsedAmount,             // Amount to supply (in smallest unit, i.e., Wei)
      await this.signer.getAddress(), // On behalf of the signer
      0                   // Referral code (set to 0 if not using referrals)
    );
    return tx.wait()
  }

  async borrowUSDC(amount: number) {
    return this.supplyUSDC(amount)
  }

  async repayUSDC(amount: number | "max") {
    const parsedAmount = amount === "max" ? MaxUint256 : parseUnits(amount.toString(), 6)
    await this.approve(parsedAmount, this.chainDetails.TOKENS.USDC, this.chainDetails.V3_POOL_AAVE);

    const tx = await this.aavePoolV3Contract.repay(
      this.chainDetails.TOKENS.USDC,       // Asset to supply (USDC address)
      parsedAmount,             // Amount to supply (in smallest unit, i.e., Wei)
      2,
      await this.signer.getAddress(), // On behalf of the signer
    );
    return tx.wait()
  }

  async approve(amount: BigNumberish, token: string, address: string) {
    const contract = new Contract(token, erc20Abi.abi, this.signer);
    const tx = await contract.approve(address, amount);
    return tx.wait()
  }
}