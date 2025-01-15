import { ethers } from "hardhat";
import { XtrVault, SafeERC20 } from "../../typechain-types";
import hre from "hardhat";


async function main() {

  hre.tracer.enabled = true;

  // Address of the deployed contract
  const contractAddress = "0x748fa28c53a9307bf13ab41164723c133d59fa67";
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Mainnet USDT address (or use the appropriate address for testnet)
  const user1 = await ethers.getImpersonatedSigner("0x661Be0562b31E9E8DdC2A7c93803005A1C71D749");

  // Specify the amount to deposit (adjust as needed)
  // const amountToDeposit = ethers.utils.parseUnits("100", 6); // e.g., 100 USDT (6 decimals)
  let amountToDeposit = "1000000000";

  // Get signer (the account making the deposit)
  const [depositor] = await ethers.getSigners();

  // Attach to the token contract (assumes IERC20 is available in your project)
  const depToken = await ethers.getContractAt("_SafeERC20", usdtAddress);

  // Approve the vault contract to spend tokens on behalf of the depositor
  // const approveTx = await depToken.connect(depositor).approve(contractAddress, amountToDeposit);
  // await approveTx.wait();
  // console.log("Approval successful");

  // Attach to the vault contract and call the deposit function
  const vault = await ethers.getContractAt("xtrVault", contractAddress);
  const depositTx = await vault.connect(depositor).deposit(amountToDeposit, { value: 0 }); // Since it's an ERC20, no ETH value needed
  await depositTx.wait();

  console.log("Deposit successful");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
