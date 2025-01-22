"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositETH = depositETH;
const ethers_1 = require("ethers");
const WrappedTokenGatewayV3_json_1 = __importDefault(require("@artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json"));
const helpers_1 = require("@xtreamly/constants/helpers");
async function depositETH(signer, amountETH) {
    const chainDetails = (0, helpers_1.getChainDetails)();
    const gatewayContract = new ethers_1.Contract(chainDetails.WRAPPED_TOKEN_GATEWAY, WrappedTokenGatewayV3_json_1.default.abi, signer);
    const tx = await gatewayContract.depositETH(chainDetails.V3_POOL_AAVE, // Address of the Aave Lending Pool
    await signer.getAddress(), // On behalf of the signer
    0, // Referral code (0 if not applicable)
    {
        value: ethers_1.ethers.parseEther(amountETH.toString()), // Amount of ETH to deposit
    });
    return tx.wait();
}
