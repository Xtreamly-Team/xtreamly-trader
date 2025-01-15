import { ethers } from "hardhat";
import { BytesLike } from "ethers";


async function main() {
  const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const contractName = "xtrVault";

  // Fetch contract's ABI from the artifacts
  const xtrVaultFactory = await ethers.getContractFactory(contractName);
  
  // Connect to deployed contract
  const xtrVault = xtrVaultFactory.attach(contractAddress);

  console.log(`Connected to xtrVault at address: ${xtrVault.address}`);

  // Example function call (adjust according to your contract's functions)
  // const result = await xtrVault.someFunction();
    // console.log("Function output:", result);
    

      // Define the DEFAULT_ADMIN_ROLE constant (standard in OZ AccessControl)
  const ADMIN_ROLE: BytesLike = ethers.utils.formatBytes32String("0");

  // Get the address of the admin role (assuming `getRoleMember` and `getRoleMemberCount` are supported)
  const adminCount = await xtrVault.getRoleMemberCount(ADMIN_ROLE);
  console.log(`Number of admins: ${adminCount.toString()}`);

  for (let i = 0; i < adminCount; i++) {
    const adminAddress = await xtrVault.getRoleMember(ADMIN_ROLE, i);
    console.log(`Admin ${i + 1}: ${adminAddress}`);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
