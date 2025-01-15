import { ethers } from "hardhat";
import { XtrVault } from "../../typechain-types";
import * as dc from '../constants/_deployment_constants';
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { readFileSync } from "fs";
import { DeployFunction } from "hardhat-deploy/types"

async function deployXtrVault(
    adminAddress: string, 
    executorAddress: string,
    pauserAddress: string,
    dexAddress: string,
    aavePoolAddress: string,
    depositTokenAddress: string
): Promise<XtrVault> {
    const xtrVault = await ethers.getContractFactory("xtrVault");    
    const xtrVaultInstance = await xtrVault.deploy( 
        adminAddress,
        executorAddress,
        pauserAddress,
        dexAddress,
        depositTokenAddress,
        aavePoolAddress
    );
    await 
    await xtrVaultInstance.deployTransaction.wait();
    console.log(`> Deployed at: ${xtrVaultInstance.address}`);
    console.log("***************************************************************");

    await sleep();
    return xtrVaultInstance;
}

// Helper function to pause execution for a short period
function sleep(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to execute the deployment script
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);

    console.log("Deploying xtrVault instances...");

    await deployXtrVault(
        dc.ADMIN_ADDRESS,
        dc.EXECUTOR_ROLE,
        dc.PAUSER_ROLE,
        dc.DEX_ADDRESS,
        dc.ARB_V3_POOL_AAVE,
        dc.DAI_ADDRESS
    );
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});