import { Contract, ethers, Wallet } from "ethers";
import wethGateway
  from "@artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json";
import { getChainDetails } from "@xtreamly/constants/helpers";

export async function depositETH(
  signer: Wallet,
  amountETH: number,
) {
  const chainDetails = getChainDetails()
  const gatewayContract = new Contract(chainDetails.WRAPPED_TOKEN_GATEWAY, wethGateway.abi, signer);

  const tx = await gatewayContract.depositETH(
    chainDetails.V3_POOL_AAVE, // Address of the Aave Lending Pool
    await signer.getAddress(), // On behalf of the signer
    0, // Referral code (0 if not applicable)
    {
      value: ethers.parseEther(amountETH.toString()), // Amount of ETH to deposit
    }
  );

  return tx.wait();
}
