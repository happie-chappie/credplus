# CREDPlus

**GOAL**

To understand the defi primitives by building one

**How will CredPlus work**?

CredPlus aims to become a 2 sided marketplace for liquidity providers (lenders) and borrowers to enable loans at fixed interest lending and borrowing. LPs will mint "CXXX" tokens for providing liquidity while borrowers deposit collateral in Eth to draw loans in respective tokens. CredPlus will be the key token for our protocol. CredPlus token holders will be able to stake CredPlus token to participate in governance of the protocol.

The key aspect of CredPlus is to intelligently determine appropriate fixed interest rates for liquidity providers and borrowers through out the duration of the loan. While determining this, we will ensure that the slippage, risk is minimized and interest rates offered are competitive w.r.t the market.

We will classify liquidity pools into tranches based on the following:

- Time period (1 month, 3 month etc.)
- Toke (USDC, USDT, Eth etc.)

Our current interest rate strategy will be based on the following:

- Current utilization of liquidity tranche on CredPlus: Modelled by CredPlus
- Damping factor (determined by average current and expected market demand): Modelled by CredPlus
- Base interest rate (to be determined by governance committee periodically)

Example of LP interaction with CredPlus:

- LP1 provides 100 USDT to 1 month USDT pool and mints C01MUSDT tokens. Assuming interest rate is 5% per month, LP will be able to redeem this for 105 USDT at maturity.
- C01MUSDT can be used to provide liquidity/ traded in secondary markets like Uniswap. Price of C01MUSDT to be computed based on time to maturity.
- LP1 will pay transaction costs that will be distributed to protocol stakers.

Example of Borrower interaction with CredPlus:

- Borrower provides Eth as collateral to draw loans against it. We offer a collateral ratio of 150%.
- Suppose Eth price is 150 USDT, borrower will be able to draw 100 USDT. Assuming interest rate is 5% per month, borrower has to pay 105 USDT upon maturity.
- Borrower will pay transaction costs that will be distributed to protocol stakers.

**Design**
https://whimsical.com/credplusv3-6ffjaJVt3uTFFDSx6L8HVh

**Tech Stack?**

- React
- Hardhat
- Solidity
- Defi protocol designs

**Similar Existing Ideas**

Inspired by notional finance
- https://notional.finance/
- https://anchorprotocol.com/

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/happie-chappie/credplus
cd credplus
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

> Note: There's [an issue in `ganache-core`](https://github.com/trufflesuite/ganache-core/issues/650) that can make the `npm install` step fail. 
>
> If you see `npm ERR! code ENOLOCAL`, try running `npm ci` instead of `npm install`.

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening to
`localhost 8545`.