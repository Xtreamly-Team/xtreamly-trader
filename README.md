# Welcome to Xtreamly's AI trader framework

Enhance your development process with this framework, seamlessly integrating Xtreamly's advanced AI models and built-in on-chain capabilities to create fully customized trading bots tailored to your needs!

![arch_bot.png](docs/arch_bot.png)

## Prerequisites

1. Docker
2. node v18.18.2 (the version inside the .nvmrc file)

## Local execution

1. Set node version: `nvm use` (if you are using nvm)
2. Install dependencies: `yarn`
3. Compile the contracts: `yarn compile`
4. Start your trading bot: `yarn start`

# Dockerization 

## Build the Image

```bash
docker build -t xtreamly_trader .
```

## Run Container

```bash
docker run -it --name xtreamly_trader -v $(pwd):/app xtreamly_trader
```

# How to call the Scripts 

cd into `packages/hardhat`

Define amount in ETH, script will parse into correct decimals for either ETH or USDC


## General Interactions

### supply USDC

```bash
npx ts-node scripts/arbitrum/sepolia/pool/supplyV3.ts --amount 0.01
```

### Withdraw USDC

```bash
npx ts-node scripts/arbitrum/sepolia/pool/withdrawV3.ts --amount 0.01
```

### Borrow USDC

```bash
npx ts-node scripts/arbitrum/sepolia/pool/borrowV3.ts --amount 0.01
```

### Repay USDC 

```bash
npx ts-node scripts/arbitrum/sepolia/pool/repayV3.ts --amount 0.01
```


## ETH Specific Interactions


### Deposit ETH

```bash
npx ts-node scripts/arbitrum/sepolia/ethInteractor/depositETH.ts --amount 0.01
```

### Withdraw ETH

```bash
npx ts-node scripts/arbitrum/sepolia/tViem/vETH/vWithdrawETH.ts --amount 0.005
```

### BalanceOf

```bash
npx ts-node scripts/arbitrum/sepolia/tViem/vView/vBalanceOf.ts --user 0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665 --token 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
```

### Get User Wallet Balances

```bash
npx ts-node scripts/arbitrum/sepolia/tViem/vView/vGetUserWalletBalances.ts --user 0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665
```
