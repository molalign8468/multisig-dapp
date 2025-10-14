# MultiSig Wallet DApp (Full Stack)

# 🚀 Live Demo

### Experience the MultiSig Wallet DApp live: https://multisig-wallet-theta.vercel.app/

A robust and secure Decentralized Application (DApp) for managing digital assets with enhanced security through multi-signature requirements. This repository provides a complete full-stack solution, encompassing both the **Solidity smart contract** and a **React-based frontend user interface**.

## ✨ Features

### Smart Contract (Solidity)

The core logic of the MultiSig Wallet resides in a secure and efficient Solidity smart contract.

- **Owner Management:** Defines a set of trusted owners for the wallet.
- **Customizable Confirmation Threshold:** Configurable number of owner confirmations required to execute a transaction.
- **Transaction Lifecycle:**
  - **Submission:** Any owner can propose a new transaction (sending ETH, ).
  - **Confirmation:** Owners confirm proposed transactions.
  - **Revocation:** Owners can revoke their confirmation before execution.
  - **Execution:** Once the required number of confirmations is met, any owner can execute the transaction.

### Frontend DApp (React)

A modern, responsive, and intuitive user interface built with React and styled with Tailwind CSS, providing a seamless Web3.0 experience.

- **Wallet Connection:** Easy integration with Web3 wallets (e.g., MetaMask) for secure interaction.
- **Dashboard Overview:** Displays critical wallet information including contract address, current balance, list of owners, required confirmations, and total transaction count.
- **Deploy New Wallet:** Allows users to deploy a new MultiSig contract by specifying initial owners and the confirmation threshold.
- **Access Existing Wallet:** Enables users to connect to and manage an already deployed MultiSig contract using its address.
- **New Transaction Creation:** A user-friendly form to propose new transactions, specifying destination, amount (ETH), and optional data.
- **Transaction List & Management:** View all pending and executed transactions. Owners can confirm, revoke, or execute transactions directly from the interface.
- **Interactive UI:** Responsive design with smooth transitions and clear feedback for user actions.

## 🛠️ Technologies Used

### Smart Contract & Development Environment

- **Solidity**: The contract programming language.
- **Hardhat**: Ethereum development environment for compiling, deploying, testing, and debugging your smart contract.
- **Ethers.js (v6)**: JavaScript library for interacting with the Ethereum blockchain and your smart contract.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Zustand**: A small, fast, and scalable bearbones state-management solution for React.
- **React Router DOM**: For declarative routing in the React application.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development and responsive design.
- **Ethers.js (v6)**: Used in the frontend for wallet connection and contract interactions.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)
- [MetaMask](https://metamask.io/) browser extension (or similar Web3 wallet) configured for your desired network (e.g., Sepolia,Holesky testnet).

### Project Structure

```

multisig-dapp/
├── contracts/                  \# Solidity smart contract source code
│   └── MultiSig.sol
├── ignition/                   \# Hardhat Ignition deployment scripts
│   └── MultiSig.js
├── test/                       \# Smart contract tests
│   └── multiSig.test.js
├── wallet-frontend/            \# React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/         \# React components (Home, Dashboard, etc.)
│   │   ├── components/store.js   # Zustand
│   │   ├── Contracts/          \# ABI.json and ByteCode.json from compiled contract
│   │   └── App.js              \# Main application file
│   └── package.json
├── hardhat.config.js           \# Hardhat configuration
├── package.json                \# Root package.json
├── package-lock.json
└── README.md                   \# This file

```

### 1. Smart Contract Setup & Deployment

Navigate to the root of your project to manage the smart contract.

```bash
cd multisig-dapp
```

#### Install Hardhat Dependencies

```bash
npm install
```

#### Compile the Smart Contract

```bash
npx hardhat compile
```

This will compile your `MultiSig.sol` contract and generate `artifacts/contracts/MultiSig.sol/MultiSig.json`.

#### Run Smart Contract Tests

```bash
npx hardhat test
```

#### Update Frontend with ABI and Bytecode

The compiled `ABI.json` and `ByteCode.json` are expected to be present in `wallet-frontend/src/Contracts/`. Ensure these files are updated after any contract compilation if you make changes to the Solidity code.
But The ABI and Bytecode already in front-end don`t stress on it

### 2\. Frontend Setup & Usage

Navigate into the `wallet-frontend` directory to set up and run the DApp.

```bash
cd wallet-frontend
```

#### Install Frontend Dependencies

```bash
npm install
```

#### Run the Development Server

```bash
npm run dev
```

This will start the React development server, usually at `http://http://localhost:5173/`.

#### Using the DApp

1.  **Connect Wallet:** On the home page, click "Connect To Wallet" to connect your MetaMask (or other Web3) wallet.
2.  **Deploy New Wallet:** If you want to create a new MultiSig contract, navigate to the "Deploy New Wallet" section, enter owner addresses (at least two), and set the required confirmations.
3.  **Log in to Existing Wallet:** If you have an already deployed MultiSig contract, go to "Existing Wallet" and enter its address to load it.
4.  **Dashboard:** Once a wallet is connected and a contract is loaded, you'll be redirected to the Dashboard, showing contract details and balance.
5.  **Transactions:** Use the "New Transaction" to propose transfers or contract calls, and "Transactions" to view, confirm, revoke, or execute existing transactions.
6.  **Transaction Execution Requirements:** For a transaction to be successfully executed, the Multi-sig wallet contract must hold a sufficient balance to cover the requested amount. Ensure you send enough test ETH (or the relevant asset) to the contract address.

## ⚠️ Important Notes & Considerations

- **Gas Fees:** All blockchain transactions (deploying, submitting, confirming, revoking, executing) incur gas fees. Ensure your connected wallet has enough native currency (e.g., ETH on Ethereum networks).
- **Network Consistency:** Ensure your MetaMask wallet is connected to the same network (e.g., Sepolia) where your smart contract is deployed.
- **Error Handling:** The DApp includes basic error handling, but always monitor your browser's console for more detailed blockchain transaction errors.

## 🤝 Contributing

Contributions are welcome\! If you have suggestions for improvements or find issues, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
