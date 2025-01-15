# Dockerization 

## Build the Image

```bash
docker build -t xtr_aave_scripts .
```

## Run Container

```bash
docker run -it --name xtr_aave_scripts -v $(pwd):/app xtr_aave_scripts
```

## Test Command 

Check if the docker is functional and can run scripts. 

```bash
docker exec -it xtr_aave_scripts npx ts-node scripts/arbitrum/sepolia/pool/supplyV3.ts --amount 0.02
```

and this should return sth like this: 

```bash 
Supplying 0.02 USDC (20000 in Wei) to Aave Pool...
Approving USDC for Aave Pool...
Approval transaction sent. Hash: 0xeda3ade57e693c51d3d8c71f041fe9c5975820aec8133d4b72f8ceda5f0d2d90
USDC approval confirmed.
Supplying USDC to Aave Pool...
Transaction sent. Hash: 0x0c1e8460ca1fe690021d2cec308293d38b3db3e339fe7d6226286ccaebcc9cbb
Transaction confirmed. Block: 106492382
USDC supply script executed successfully
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
npx ts-node scripts/arbitrum/sepolia/tViem/vView/vBalanceOf.ts --user 0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665
```

### Get User Wallet Balances

```bash
npx ts-node scripts/arbitrum/sepolia/tViem/vView/vGetUserWalletBalances.ts --token 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d --user 0xf2873F92324E8EC98a82C47AFA0e728Bd8E41665
```
