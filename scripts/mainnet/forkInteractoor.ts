import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";


const envFilePath = "./.env";
const hre = require("hardhat");

/**
 * Generate a new random private key and write it to the .env file
 */
const setNewEnvConfig = (existingEnvConfig = {}) => {
  console.log("👛 Generating new Wallet");
  const randomWallet = ethers.Wallet.createRandom();

  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY: randomWallet.privateKey,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, stringify(newEnvConfig));
  console.log("📄 Private Key saved to packages/hardhat/.env file");
  console.log("🪄 Generated wallet address:", randomWallet.address);
};

// Address book 
// WETH Whale 
// 0x4a18a50a8328b42773268B4b436254056b7d70CE


// Impersonate Signer




// Logic: 
// 1)
// Setup Enviroment
// Setup tracer
//
// 2)
// Connect and load contract
// Populate txn 
// Sign txn
// make call 

async function main() {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
    
  const wethWhale = await ethers.getImpersonatedSigner("0x4a18a50a8328b42773268B4b436254056b7d70CE");
  console.log(`🐋 Impersonated WETH Whale, ${ethers.JsonRpcApiProvider.getBalance(wethWhale)}`);

  console.log("👛 Generating new Wallet");
    

}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});