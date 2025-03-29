# WealthGlitch Implementation Guide

This guide provides step-by-step instructions for implementing and testing the WealthGlitch token for security research purposes.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic knowledge of Ethereum, smart contracts, and Hardhat
- Wallet with testnet ETH (for deployment)

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wealth-glitch.git
   cd wealth-glitch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your private keys and API keys.

## Local Development and Testing

### Compile the contracts

```bash
npm run compile
```

### Run tests

```bash
npm run test
```

### Run a local node

```bash
npx hardhat node
```

### Deploy locally

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Testnet Deployment

For security research, always start with testnets:

### Deploy to Goerli

```bash
npm run deploy:goerli
```

### Deploy to Sepolia

```bash
npm run deploy:sepolia
```

### Deploy to Mumbai (Polygon testnet)

```bash
npm run deploy:mumbai
```

## Implementation Steps

### 1. Deploy the WealthGlitch Contract

This deploys the contract from Wallet B (the wallet you want to research):

```bash
npm run deploy:goerli
```

The script will output the contract address.

### 2. Configure the Contract

```javascript
// Get the contract instance
const WealthGlitch = await ethers.getContractFactory("WealthGlitch");
const wealthGlitch = WealthGlitch.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS");

// Add tokens to the transfer list
await wealthGlitch.setTokenToTransfer("0xTokenAddress1", true);
await wealthGlitch.setTokenToTransfer("0xTokenAddress2", true);

// Activate the glitch
await wealthGlitch.activate();
```

### 3. Send the Trigger Token

From Wallet A, send the WealthGlitch token to the contract address:

```javascript
// Get the token contract instance
const glitchToken = await ethers.getContractAt("WealthGlitch", "CONTRACT_ADDRESS");

// Transfer a small amount to trigger the wealth transfer
await glitchToken.transfer("CONTRACT_ADDRESS", 1);
```

## Monitoring and Verification

### Verify on Etherscan

After deployment, verify your contract:

```bash
npx hardhat verify --network goerli CONTRACT_ADDRESS DESTINATION_ADDRESS
```

### Monitor Transactions

1. Check the contract on Etherscan/Polygonscan
2. Verify that tokens are transferred to the destination address
3. Check the events emitted by the contract

## Advanced Usage

### Manual Trigger

You can manually trigger the wealth transfer:

```javascript
await wealthGlitch.shareAbundance();
```

### Change Destination Address

```javascript
await wealthGlitch.setAbundanceDestination("NEW_DESTINATION_ADDRESS");
```

### Deactivate the Contract

When your research is complete:

```javascript
await wealthGlitch.deactivate();
```

## Customizing the Contract

If you need to modify the contract for your research:

1. Edit the `contracts/WealthGlitch.sol` file
2. Recompile with `npm run compile`
3. Run tests to ensure functionality is preserved
4. Deploy the updated contract

## Troubleshooting

### Common Issues

1. **Transaction Reverted**: Check that you have enough gas and the contract is activated
2. **Token Not Transferred**: Verify the token is on the transfer list
3. **Deployment Failure**: Ensure your wallet has enough ETH for deployment

### Getting Help

If you encounter issues:

1. Check the Hardhat documentation
2. Review testing logs for errors
3. Refer to OpenZeppelin documentation for ERC-20 and SafeERC20

## Research Documentation

Keep detailed records of:

1. All deployments (contract addresses, networks)
2. Token configurations
3. Transaction hashes
4. Observed behaviors

This documentation is essential for security research purposes.
