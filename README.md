# Welcome to Xtreamly's AI trader framework

Enhance your development process with this framework, seamlessly integrating Xtreamly's advanced AI models and built-in on-chain capabilities to create fully customized trading bots tailored to your needs!

![arch_bot.png](docs/arch_bot.png)

## Prerequisites

1. Docker
2. node v18.18.2 (the version inside the .nvmrc file)

## Local execution

1. Set node version (if you are using nvm)
    ```bash
    nvm use
    ```
2. Install dependencies: 
    ```bash
    yarn
    ```
3. Compile the contracts: 
    ```bash
    yarn compile
    ```
4. Start your trading bot: 
    ```bash
    yarn start
    ```

## Install it as a typescript library

```bash
yarn add git+ssh://git@github.com:Xtreamly-Team/xtreamly-trader
```


## Developing your first trading bot

The [strategy.ts](strategy.ts) file is where you can code your trading bot's logic.

The `actions` function will be executed in a loop.

### Configuration

Your trading bot is configured via the [.env](.env) file (environment variables):

1. `EXECUTION_INTERVAL`: Controls how often your actions will be executed (in seconds)
2. `ROUNDS` (optional): Controls how many times yours actions will be executed. If this value is not defined your actions will execute FOREVER !
3. `CHAIN`: The chain to execute your strategy on
4. `NETWORK`: The network of that chain `sepolia` or `mainnet`
5. `RPC` (optional): RPC to be used for action execution, if not provided will use the network's default RPC

You can just copy the [.env.example](.env.example) file:
```bash
cp .env.example .env
```

### Out of the box functionality:

1. You have access to all Xtreamly's intelligence by importing `"@xtreamly/models"`
2. You have access to supported DeFi actions by importing `"@xtreamly/actions"`

### Example trading bot

```typescript
import { executor } from "@xtreamly/utils/executor";
import { getChainDetails } from "@xtreamly/constants/helpers";
import { Volatility } from "@xtreamly/models";
import { getTokenBalance, } from "@xtreamly/actions";

const wallet = '0xABC'

async function actions(round: number) {
  const chainDetails = getChainDetails()
  console.log("Round", round);

  const pred = await new Volatility().lowPrediction()
  console.log("Low volatility predicted", pred.low_volatility_signal);

  const balance = await getTokenBalance(wallet, chainDetails.TOKENS.USDC)
  console.log("USDC balance", balance);
}

executor(actions).catch(console.error)
```

## Dockerization 

You can deploy your Xtreamly trading anywhere with the power of Docker !

1. Build the Image
    ```bash
    docker build -t xtreamly_trader .
    ```
2. Run Container
    ```bash
    docker run -it --name xtreamly_trader -v $(pwd):/app xtreamly_trader
    ```
