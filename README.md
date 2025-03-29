# WealthGlitch Token

## Overview

WealthGlitch is a specialized ERC-20 token designed for cryptocurrency security research. This contract enables authorized wealth transfer between wallets when triggered by a specific token transaction. It demonstrates important concepts in smart contract design and wallet interaction for educational and research purposes only.

## ⚠️ IMPORTANT: Research Purposes Only

This contract is designed **exclusively for security research** with wallets you fully own and control. It should **never** be used to mislead others or attempt unauthorized access to funds. Always practice ethical research and ensure proper authorization when testing smart contract behavior.

## Features

- **Glitch Trigger Token**: An ERC-20 token that activates the wealth transfer mechanism
- **Selective Asset Transfer**: Configurable list of which ERC-20 tokens to include in the transfer
- **Activation Controls**: Toggle the transfer functionality on/off as needed
- **ETH Support**: Automatically handles both ERC-20 tokens and native ETH
- **Customizable Destination**: Change the destination address at any time

## How It Works

1. **Setup**: Deploy the WealthGlitch contract from the source wallet, specifying the destination address
2. **Configuration**: Add ERC-20 tokens to the transfer list and activate the glitch mechanism
3. **Trigger**: Send the Glitch Trigger token to the contract
4. **Transfer**: Upon receiving the token, the contract transfers all configured assets to the destination

## Contract Deployment

```solidity
// Deploy with your destination address
WealthGlitch glitchToken = new WealthGlitch(destinationWalletAddress);

// Activate the glitch functionality
glitchToken.activate();

// Configure tokens to transfer (examples)
glitchToken.setTokenToTransfer(usdcAddress, true);
glitchToken.setTokenToTransfer(linkAddress, true);
```

## Usage Walkthrough

### 1. Deployment

Deploy the contract from your source wallet (Wallet B) using a development environment like Remix, Hardhat, or Truffle.

```javascript
// Example deployment with Hardhat
const WealthGlitch = await ethers.getContractFactory("WealthGlitch");
const wealthGlitch = await WealthGlitch.deploy("0xYourDestinationWalletAddress");
await wealthGlitch.deployed();
console.log("WealthGlitch deployed to:", wealthGlitch.address);
```

### 2. Configuration

```javascript
// Add tokens to transfer list
await wealthGlitch.setTokenToTransfer("0xTokenAddress1", true);
await wealthGlitch.setTokenToTransfer("0xTokenAddress2", true);

// Or batch add multiple tokens
await wealthGlitch.batchSetTokensToTransfer(
  ["0xToken1", "0xToken2", "0xToken3"], 
  true
);

// Activate the glitch mechanism
await wealthGlitch.activate();
```

### 3. Trigger the Transfer

Send the Glitch Trigger token from Wallet A to the contract address (which was deployed by Wallet B). This will trigger the transfer of all configured assets from the contract to your destination wallet.

## Function Reference

| Function | Description |
|----------|-------------|
| `constructor(address _abundanceDestination)` | Deploys the contract with the specified destination address |
| `setAbundanceDestination(address newDestination)` | Updates the destination address |
| `setTokenToTransfer(address tokenAddress, bool shouldTransfer)` | Adds or removes a token from the transfer list |
| `batchSetTokensToTransfer(address[] tokenAddresses, bool shouldTransfer)` | Configures multiple tokens at once |
| `activate()` | Enables the wealth transfer functionality |
| `deactivate()` | Disables the wealth transfer functionality |
| `shareAbundance()` | Manually triggers the transfer process |

## Security Notes

- This contract must be deployed by the wallet that holds the assets to be transferred
- The wallet must grant approvals for any ERC-20 tokens to be transferred
- This demonstrates a consensual transfer process where the wallet owner explicitly authorizes the contract
- It cannot extract funds from standard wallets without proper authorization

## Development and Testing

This contract was developed using Solidity ^0.8.17 and incorporates OpenZeppelin's libraries for ERC-20 implementation and secure transfer mechanisms.

Test thoroughly on testnets before any mainnet research:
- Goerli
- Sepolia
- Mumbai (Polygon Testnet)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This code is provided as-is for research purposes only. The authors take no responsibility for any use or misuse of this code. Always ensure you are complying with all applicable laws and ethics when conducting security research.
