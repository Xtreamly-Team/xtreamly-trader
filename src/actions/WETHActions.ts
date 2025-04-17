import { ethers, Wallet } from "ethers";

const WETH_ABI = [
  'function deposit() public payable',
  'function withdraw(uint256 wad) public',
  'function balanceOf(address owner) view returns (uint256)'
];

export class WETHActions {
  private signer: Wallet;
  private wethAddress: string;

  constructor(
    wethAddress: string,
    signer: Wallet
  ) {
    this.signer = signer;
    this.wethAddress = wethAddress;
  }

  async wrap(amount: number): Promise<number> {
    const wethContract = new ethers.Contract(this.wethAddress, WETH_ABI, this.signer);
    const tx = await wethContract.deposit({
      value: ethers.utils.parseEther(amount.toString()),
    });
    await tx.wait();
    return amount;
  }

  async unwrap(amount: number): Promise<number> {
    const wethContract = new ethers.Contract(this.wethAddress, WETH_ABI, this.signer);
    const tx = await wethContract.withdraw(ethers.utils.parseEther(amount.toString()));
    await tx.wait();
    return amount;
  }
}
