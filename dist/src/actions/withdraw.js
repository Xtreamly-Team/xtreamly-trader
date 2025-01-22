"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawETH = withdrawETH;
exports.approveAWETH = approveAWETH;
const ethers_1 = require("ethers");
const WrappedTokenGatewayV3_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json"));
const helpers_1 = require("../constants/helpers");
const IERC20_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json"));
async function withdrawETH(signer, amountETH) {
    const chainDetails = (0, helpers_1.getChainDetails)();
    const amount = amountETH === "max" ? ethers_1.ethers.MaxUint256 : ethers_1.ethers.parseEther(amountETH.toString());
    await approveAWETH(signer, amount);
    const gatewayContract = new ethers_1.Contract(chainDetails.WRAPPED_TOKEN_GATEWAY, WrappedTokenGatewayV3_json_1.default.abi, signer);
    const address = await signer.getAddress();
    const tx = await gatewayContract.withdrawETH(address, amountETH, address);
    return tx.wait();
}
async function approveAWETH(signer, amountETH) {
    const chainDetails = (0, helpers_1.getChainDetails)();
    const aWETHContract = new ethers_1.Contract(chainDetails.TOKENS.A_WETH, IERC20_json_1.default.abi, signer);
    const tx = await aWETHContract.approve(chainDetails.WRAPPED_TOKEN_GATEWAY, amountETH);
    return tx.wait();
}
