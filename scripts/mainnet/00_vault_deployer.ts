import { Signer } from "@ethersproject/abstract-signer";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumberish } from "ethers";
import { hrtime } from "process";
// import { AlpacaGrizzly } from "../../typechain";
import { ethers } from "hre"
import { XtrVault } from "../../typechain-types";
import * as dc from '../constants/_deployment_constants';
import { readFileSync } from "fs";

function sleep(timeMilliseconds: number = 9000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, timeMilliseconds);
    })
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer address: ${deployer.address}`);

    let instanceData = [];
    let contracts = [];

    // /////////////////////////////////////////
    console.log("Deploying xtrVault instances...");

    await deployXtrVault(
        dc.ADMIN_ADDRESS,
        dc.EXECUTOR_ROLE,
        dc.PAUSER_ROLE,
        dc.DEX_ADDRESS,
        dc.ARB_V3_POOL_AAVE,
        dc.DAI_ADDRESS
    );
    instanceData.push({
        type: "xtrVault",
        name: "xtrVault",
        // address: xtrVaultInstance.address
    });

    // /////////////////////////////////////////
    // console.log("Deploying Grizzly instances...");
    // for (let poolData of ALPACA_GRIZZLY_INSTANCE_VAULTS) {
    //     console.log(`poolData.vault of ${poolData.VaultSymbol} == ${poolData.vault}`);
    //     console.log(`Deploying Alpaca Grizzly Hive for pool ID ${poolData.pid} (${poolData.VaultSymbol})...`);
    //     const alpacaGrizzlyInstance = await deployAlpacaGrizzly(
    //         ADMIN_ADDRESS,
    //         ALPACA_FAIRLAUNCH_ADDRESS,
    //         poolData.vault,
    //         HONEY_TOKEN_ADDRESS,
    //         DEV_TEAM_ADDRESS,
    //         REFERRAL_ADDRESS,
    //         AVERAGE_PRICE_ORACLE,
    //         dexAddress,
    //         poolData.pid
    //     );
    //     instanceData.push({
    //         type: "GRIZZLY",
    //         name: poolData.VaultSymbol,
    //         address: alpacaGrizzlyInstance.address
    //     });
    // }

    // console.log(`Ìnstance JSON`);
    // console.log("  ∩~~~~∩     ")
    // console.log("  ξ ･×･ ξ     ")
    // console.log("  ξ　~　ξ     ")
    // console.log("  ξ　　 ξ     ")
    // console.log("  ξ　　 “~～~～〇     ")
    // console.log("  ξ　　　　　　ξ     ")
    // console.log("  ξ ξ ξ~～~ξ ξ ξ     ")
    // console.log("　 ξ_ξξ_ξ　ξ_ξξ_ξ    ")

    //! For prod make sure to use right contract file for deployment
    // console.log(`Transferring proxy ownership to ADMIN...`);
    // await upgrades.admin.transferProxyAdminOwnership(ADMIN_ADDRESS);
}

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
        aavePoolAddress,
        depositTokenAddress
    );
    await xtrVaultInstance.deployed();
    console.log(`> Deployed at: ${xtrVaultInstance.address}`);
    console.log("***************************************************************");

    await sleep();
    return xtrVaultInstance;
}


// async function deployAlpacaGrizzly(
//     adminAddress: string,
//     AlpacaStakingContractAddress: string,
//     AlpacaDepositContractAddress: string,
//     honeyTokenAddress: string,
//     devTeamAddress: string,
//     referralAddress: string,
//     averagePriceOracleAddress: string,
//     dexAddress: string,
//     poolId: BigNumberish
// ): Promise<AlpacaGrizzly> {
//     const AlpacaGrizzly = await ethers.getContractFactory("AlpacaGrizzly");
//     const AlpacaGrizzlyProxy = await upgrades.deployProxy(
//         AlpacaGrizzly,
//         [
//             adminAddress,
//             AlpacaStakingContractAddress,
//             AlpacaDepositContractAddress,
//             honeyTokenAddress,
//             devTeamAddress,
//             referralAddress,
//             averagePriceOracleAddress,
//             dexAddress,
//             poolId
//         ]
//     )
//     await AlpacaGrizzlyProxy.deployed();
//     const AlpacaGrizzlyInstance =  AlpacaGrizzly.attach(AlpacaGrizzlyProxy.address);
//     console.log(`> Deployed at: ${AlpacaGrizzlyInstance.address}`);
//     console.log("***************************************************************");


//     await sleep();
//     return AlpacaGrizzlyInstance;
// }


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});