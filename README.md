# Mini DeFi Vault

A simple decentralized finance (DeFi) vault application built with React, Wagmi ,Ethers.js, and Solidity. This project allows users to deposit and withdraw ETH on the Sepolia testnet.

## Features

- 🔐 Wallet connection using RainbowKit
- 💰 ETH deposit functionality
- 💸 ETH withdrawal functionality
- 📊 Real-time balance display
- 🎨 Modern UI with SCSS styling
- ⛓️ Built on Sepolia testnet

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or any Web3 wallet
- Some Sepolia testnet ETH (can be obtained from a faucet)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mini-defi.git
cd mini-defi
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure the project:

   - Create a `.env` file in the root directory
   - Add your WalletConnect project ID:

   ```
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Smart Contract

The vault contract is deployed on Sepolia testnet at:

```
0xE3f15a81abAbEbF2Cb80654D246220Aa7BaD3945
```

Contract features:

- Deposit ETH
- Withdraw ETH
- View balance
- Track user balances

## Technologies Used

- React
- TypeScript
- Vite
- wagmi
- RainbowKit
- SCSS
- Solidity
- Ethers.js

## Project Structure

```
mini-defi/
├── src/
│   ├── components/
│   │   └── Vault.tsx
│   ├── config/
│   │   └── wagmi.ts
│   ├── styles/
│   │   └── main.scss
│   └── App.tsx
├── public/
└── package.json
```

## Acknowledgments

- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)
- [Sepolia Testnet](https://sepolia.dev/)
