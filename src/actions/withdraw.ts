import { Contract, ethers, Wallet } from "ethers";
import wethGateway
  from "@artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json";
import { getChainDetails } from "@xtreamly/constants/helpers";
import erc20Abi from "@artifacts/contracts/interfaces/IERC20.sol/IERC20.json";

export async function withdrawETH(
  signer: Wallet,
  amountETH: number | "max",
) {
  const chainDetails = getChainDetails()
  const amount = amountETH === "max" ? ethers.MaxUint256 : ethers.parseEther(amountETH.toString())

  await approveAWETH(signer, amount)

  const gatewayContract = new Contract(chainDetails.WRAPPED_TOKEN_GATEWAY, wethGateway.abi, signer);

  const address = await signer.getAddress();
  const tx = await gatewayContract.withdrawETH(address, amountETH, address);

  return tx.wait()
}

export async function approveAWETH(
  signer: Wallet,
  amountETH: bigint,
) {
  const chainDetails = getChainDetails()
  const aWETHContract = new Contract(chainDetails.TOKENS.A_WETH, erc20Abi.abi, signer);
  const tx = await aWETHContract.approve(chainDetails.WRAPPED_TOKEN_GATEWAY, amountETH);
  return tx.wait()
}

