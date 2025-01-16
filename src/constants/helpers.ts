import { ChainDetails, CHAINS } from "@xtreamly/constants/chains";

export function checkChainDetails() {
  const chainName = process.env.CHAIN!;
  const network = process.env.NETWORK!

  const chain = CHAINS[chainName];
  if (!chain) {
    throw new Error(
      `
      Chain ${chainName} is not supported yet.
      Supported chains: ${Object.keys(CHAINS)}
      `
    );
  }

  if (!chain[network]) {
    throw new Error(
      `
      Network ${network} is not supported on ${chainName} yet.
      Supported networks: ${Object.keys(chain)}
      `
    );
  }
}

export function getChainDetails(): ChainDetails {
  checkChainDetails()

  const chain = process.env.CHAIN!;
  const network = process.env.NETWORK!

 return CHAINS[chain][network]
}