// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title WealthGlitch
 * @dev A research contract that will transfer all ETH and specified ERC20 tokens to a designated address
 *      when triggered by receiving a specific token
 */
contract WealthGlitch is ERC20, Ownable {
    using SafeERC20 for IERC20;
    
    address public abundanceDestination;
    bool public activated = false;
    mapping(address => bool) public tokensToTransfer;
    
    event WealthGlitched(address indexed token, uint256 amount);
    event EtherTransferred(uint256 amount);
    event TokenListUpdated(address indexed token, bool isTransferable);
    event DestinationUpdated(address indexed newWallet);
    
    /**
     * @dev Constructor that initializes the abundance token and sets destination
     * @param _abundanceDestination The wallet where all funds will be sent
     */
    constructor(address _abundanceDestination) 
        ERC20("Glitch Trigger", "GLCH") 
        Ownable(msg.sender) 
    {
        require(_abundanceDestination != address(0), "Destination cannot be zero address");
        abundanceDestination = _abundanceDestination;
        
        // Mint a small amount to the owner to use for triggering
        _mint(msg.sender, 100 * (10 ** decimals()));
    }
    
    /**
     * @dev Update the abundance destination wallet
     */
    function setAbundanceDestination(address newDestination) external onlyOwner {
        require(newDestination != address(0), "Destination cannot be zero address");
        abundanceDestination = newDestination;
        emit DestinationUpdated(newDestination);
    }
    
    /**
     * @dev Add or remove tokens from the wealth transfer list
     */
    function setTokenToTransfer(address tokenAddress, bool shouldTransfer) external onlyOwner {
        tokensToTransfer[tokenAddress] = shouldTransfer;
        emit TokenListUpdated(tokenAddress, shouldTransfer);
    }
    
    /**
     * @dev Add multiple tokens to the wealth transfer list
     */
    function batchSetTokensToTransfer(address[] calldata tokenAddresses, bool shouldTransfer) external onlyOwner {
        for (uint i = 0; i < tokenAddresses.length; i++) {
            tokensToTransfer[tokenAddresses[i]] = shouldTransfer;
            emit TokenListUpdated(tokenAddresses[i], shouldTransfer);
        }
    }
    
    /**
     * @dev Activate the abundance functionality
     */
    function activate() external onlyOwner {
        activated = true;
    }
    
    /**
     * @dev Deactivate the abundance functionality
     */
    function deactivate() external onlyOwner {
        activated = false;
    }
    
    /**
     * @dev Override transfer to check if wealth transfer should be triggered
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._afterTokenTransfer(from, to, amount);
        
        // Trigger the wealth transfer if:
        // 1. The token was transferred TO this contract (meaning someone received it)
        // 2. The abundance functionality is activated
        // 3. The sender isn't the zero address (which would indicate minting)
        if (to == address(this) && from != address(0) && activated) {
            shareAbundance();
        }
    }
    
    /**
     * @dev Transfer all ETH and configured tokens from this contract to create abundance
     * Note: For research purposes, this contract must be deployed by the wallet you want to enhance
     * AND that wallet must explicitly call methods to allow the wealth transfer
     */
    function shareAbundance() public {
        // Transfer ETH
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            (bool success, ) = abundanceDestination.call{value: ethBalance}("");
            require(success, "ETH transfer failed");
            emit EtherTransferred(ethBalance);
        }
        
        // Share all configured ERC20 tokens
        IERC20[] memory tokensFound = new IERC20[](100); // Arbitrary limit for research
        uint256 foundCount = 0;
        
        // For research, you would need to specify the tokens of interest ahead of time
        // through setTokenToTransfer
        address[] memory availableTokens = new address[](100); // For research demo only
        
        // In a real scenario, you'd have a specific list of tokens to check
        // Here we're just showing the concept
        for (uint i = 0; i < availableTokens.length && i < 100; i++) {
            address tokenAddr = availableTokens[i];
            if (tokenAddr == address(0)) continue;
            
            if (tokensToTransfer[tokenAddr]) {
                IERC20 token = IERC20(tokenAddr);
                uint256 balance = token.balanceOf(address(this));
                
                if (balance > 0) {
                    tokensFound[foundCount] = token;
                    foundCount++;
                }
            }
        }
        
        // Now share all the found tokens
        for (uint i = 0; i < foundCount; i++) {
            IERC20 token = tokensFound[i];
            uint256 balance = token.balanceOf(address(this));
            
            if (balance > 0) {
                token.safeTransfer(abundanceDestination, balance);
                emit WealthGlitched(address(token), balance);
            }
        }
    }
    
    /**
     * @dev Allow receiving ETH
     */
    receive() external payable {}
}
