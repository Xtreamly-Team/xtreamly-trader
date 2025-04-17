"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETHActions = void 0;
const ethers_1 = require("ethers");
const WETH_ABI = [
    'function deposit() public payable',
    'function withdraw(uint256 wad) public',
    'function balanceOf(address owner) view returns (uint256)'
];
class WETHActions {
    constructor(wethAddress, signer) {
        this.signer = signer;
        this.wethAddress = wethAddress;
    }
    async wrap(amount) {
        const wethContract = new ethers_1.ethers.Contract(this.wethAddress, WETH_ABI, this.signer);
        const tx = await wethContract.deposit({
            value: ethers_1.ethers.utils.parseEther(amount.toString()),
        });
        await tx.wait();
        return amount;
    }
    async unwrap(amount) {
        const wethContract = new ethers_1.ethers.Contract(this.wethAddress, WETH_ABI, this.signer);
        const tx = await wethContract.withdraw(ethers_1.ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        return amount;
    }
}
exports.WETHActions = WETHActions;
