# Real Estate NFT DApp

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup

- Install [NodeJS](https://nodejs.org/en/)

## Setting Up

### 1. Clone/Download the Repository

### 2. Install Dependencies:

`$ npm install`

### 3. Run tests

`$ npx hardhat test`

### 4. Start Hardhat node

`$ npx hardhat node`

### 5. Run deployment script

In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend

`$ npm run start`

### hardhat for creating the smart contract, it is a smart contract contract development framework that will allow us create smart contract, write test for them and put them on the blockchain

### ether.js for talking to the smart contract in javascript to make the frontend and the backend to interact

### openZeppelin for creating NFTs

- Seller lists property
- Buyer deposits earnset
- Appraisal
- Inspection
- Lender approves
- Lender funds
- Transfer Ownership
- Seller gets paid

# putting thr smart contract on a local blockchain

hardhat gives us a way to run a blockchain on our computer without having to talk to the internet

1. npx hardhat node : this starts a local hardhat blockchain on our computer. it starts a blockchain running
2. create a script in the deploy.js that takes the smart contract that was created off our computer and puts them on local blockchain. the main function inside the deploy.js file is where we are going to take the smart contract off our computer and deploy them to the local blockchain, 

3. after writing the programs in the main function in the deploy.js file, in your terminal, you run 
# npx hardhat run scripts/deploy.js --network localhost