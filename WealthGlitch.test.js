const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WealthGlitch", function () {
  let WealthGlitch;
  let wealthGlitch;
  let owner;
  let destination;
  let user;
  let mockToken;

  beforeEach(async function () {
    // Get signers
    [owner, destination, user] = await ethers.getSigners();

    // Deploy mock ERC20 token for testing
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("Mock Token", "MOCK", ethers.utils.parseEther("1000000"));
    await mockToken.deployed();

    // Deploy WealthGlitch
    WealthGlitch = await ethers.getContractFactory("WealthGlitch");
    wealthGlitch = await WealthGlitch.deploy(destination.address);
    await wealthGlitch.deployed();

    // Transfer some mock tokens to the wealth glitch contract
    await mockToken.transfer(wealthGlitch.address, ethers.utils.parseEther("1000"));
    
    // Add mock token to transfer list
    await wealthGlitch.setTokenToTransfer(mockToken.address, true);
  });

  describe("Deployment", function () {
    it("Should set the right abundance destination", async function () {
      expect(await wealthGlitch.abundanceDestination()).to.equal(destination.address);
    });

    it("Should mint tokens to the owner", async function () {
      const ownerBalance = await wealthGlitch.balanceOf(owner.address);
      expect(ownerBalance).to.be.gt(0);
    });
  });

  describe("Configuration", function () {
    it("Should add token to transfer list", async function () {
      expect(await wealthGlitch.tokensToTransfer(mockToken.address)).to.equal(true);
    });

    it("Should remove token from transfer list", async function () {
      await wealthGlitch.setTokenToTransfer(mockToken.address, false);
      expect(await wealthGlitch.tokensToTransfer(mockToken.address)).to.equal(false);
    });

    it("Should batch add tokens to transfer list", async function () {
      // Deploy additional mock tokens
      const MockToken2 = await ethers.getContractFactory("MockERC20");
      const mockToken2 = await MockToken2.deploy("Mock Token 2", "MOCK2", ethers.utils.parseEther("1000"));
      await mockToken2.deployed();
      
      const MockToken3 = await ethers.getContractFactory("MockERC20");
      const mockToken3 = await MockToken3.deploy("Mock Token 3", "MOCK3", ethers.utils.parseEther("1000"));
      await mockToken3.deployed();

      // Batch add
      await wealthGlitch.batchSetTokensToTransfer(
        [mockToken.address, mockToken2.address, mockToken3.address],
        true
      );

      expect(await wealthGlitch.tokensToTransfer(mockToken2.address)).to.equal(true);
      expect(await wealthGlitch.tokensToTransfer(mockToken3.address)).to.equal(true);
    });
  });

  describe("Wealth Transfer", function () {
    it("Should transfer tokens when receiving the glitch token", async function () {
      // Activate the wealth glitch
      await wealthGlitch.activate();
      
      // Send the glitch token to trigger the transfer
      const transferAmount = 1;
      await wealthGlitch.transfer(wealthGlitch.address, transferAmount);

      // Check if tokens were transferred to destination
      const destinationBalance = await mockToken.balanceOf(destination.address);
      expect(destinationBalance).to.equal(ethers.utils.parseEther("1000"));
    });

    it("Should not transfer tokens when deactivated", async function () {
      // Make sure it's deactivated
      await wealthGlitch.deactivate();
      
      // Send the glitch token
      const transferAmount = 1;
      await wealthGlitch.transfer(wealthGlitch.address, transferAmount);

      // Check that tokens were NOT transferred
      const destinationBalance = await mockToken.balanceOf(destination.address);
      expect(destinationBalance).to.equal(0);
    });

    it("Should transfer ETH when receiving the glitch token", async function () {
      // Activate the wealth glitch
      await wealthGlitch.activate();
      
      // Send ETH to the contract
      await owner.sendTransaction({
        to: wealthGlitch.address,
        value: ethers.utils.parseEther("1.0")
      });
      
      // Get destination initial balance
      const initialBalance = await ethers.provider.getBalance(destination.address);
      
      // Send the glitch token to trigger the transfer
      await wealthGlitch.transfer(wealthGlitch.address, 1);

      // Check if ETH was transferred
      const finalBalance = await ethers.provider.getBalance(destination.address);
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1.0"));
    });
  });
});
