"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveActions = void 0;
const constants_1 = require("../constants");
const ethers_1 = require("ethers");
const WrappedTokenGatewayV3_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/aave_v3.2/contracts/helpers/WrappedTokenGatewayV3.sol/WrappedTokenGatewayV3.json"));
const IERC20_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json"));
const Pool_json_1 = __importDefault(require("../../artifacts/contracts/interfaces/aave_v3.2/contracts/protocol/pool/Pool.sol/Pool.json"));
class AaveActions {
    constructor(signer) {
        this.signer = signer;
        this.chainDetails = (0, constants_1.getChainDetails)();
        this.gatewayContract = new ethers_1.Contract(this.chainDetails.WRAPPED_TOKEN_GATEWAY, WrappedTokenGatewayV3_json_1.default.abi, signer);
        this.aavePoolV3Contract = new ethers_1.Contract(this.chainDetails.V3_POOL_AAVE, Pool_json_1.default.abi, this.signer);
    }
    async depositETH(amountETH) {
        const tx = await this.gatewayContract.depositETH(this.chainDetails.V3_POOL_AAVE, // Address of the Aave Lending Pool
        await this.signer.getAddress(), // On behalf of the signer
        0, // Referral code (0 if not applicable)
        {
            value: (0, ethers_1.parseEther)(amountETH.toString()), // Amount of ETH to deposit
        });
        return tx.wait();
    }
    async withdrawETH(amountETH) {
        const amount = amountETH === "max" ? ethers_1.MaxUint256 : (0, ethers_1.parseEther)(amountETH.toString());
        await this.approveAWETH(amount);
        const address = await this.signer.getAddress();
        const tx = await this.gatewayContract.withdrawETH(address, amountETH, address);
        return tx.wait();
    }
    async withdrawUSDC(amount) {
        const parsedAmount = amount === "max" ? ethers_1.MaxUint256 : (0, ethers_1.parseUnits)(amount.toString(), 6);
        const address = await this.signer.getAddress();
        const tx = await this.aavePoolV3Contract.withdraw(this.chainDetails.TOKENS.USDC, parsedAmount, address);
        return tx.wait();
    }
    async approveAWETH(amount) {
        return this.approve(amount, this.chainDetails.TOKENS.A_WETH, this.chainDetails.WRAPPED_TOKEN_GATEWAY);
    }
    async supplyUSDC(amount) {
        const parsedAmount = (0, ethers_1.parseUnits)(amount.toString(), 6);
        await this.approve(parsedAmount, this.chainDetails.TOKENS.USDC, this.chainDetails.V3_POOL_AAVE);
        const tx = await this.aavePoolV3Contract.supply(this.chainDetails.TOKENS.USDC, // Asset to supply (USDC address)
        amount, // Amount to supply (in smallest unit, i.e., Wei)
        await this.signer.getAddress(), // On behalf of the signer
        0 // Referral code (set to 0 if not using referrals)
        );
        return tx.wait();
    }
    async borrowUSDC(amount) {
        return this.supplyUSDC(amount);
    }
    async repayUSDC(amount) {
        const parsedAmount = amount === "max" ? ethers_1.MaxUint256 : (0, ethers_1.parseUnits)(amount.toString(), 6);
        await this.approve(parsedAmount, this.chainDetails.TOKENS.USDC, this.chainDetails.V3_POOL_AAVE);
        const tx = await this.aavePoolV3Contract.repay(this.chainDetails.TOKENS.USDC, // Asset to supply (USDC address)
        amount, // Amount to supply (in smallest unit, i.e., Wei)
        2, await this.signer.getAddress());
        return tx.wait();
    }
    async approve(amount, token, address) {
        const contract = new ethers_1.Contract(token, IERC20_json_1.default.abi, this.signer);
        const tx = await contract.approve(address, amount);
        return tx.wait();
    }
}
exports.AaveActions = AaveActions;
