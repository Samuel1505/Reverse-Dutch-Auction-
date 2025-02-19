// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReverseDutchAuction {
    address public seller;
    IERC20 public token;
    uint256 public initialPrice;
    uint256 public startTime;
    uint256 public duration;
    uint256 public priceDropPerSecond;
    uint256 public tokensForSale;
    bool public auctionEnded;
    
    event AuctionStarted(address indexed seller, uint256 initialPrice, uint256 startTime, uint256 duration);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 finalPrice);
    
    constructor() {
        seller = msg.sender; // Contract owner is default seller
    }

    function startAuction(
        address _token,
        uint256 _initialPrice,
        uint256 _duration,
        uint256 _tokensForSale
    ) external {
        require(msg.sender == seller, "Only seller can start auction");
        require(_duration > 0, "Duration must be greater than zero");
        require(_tokensForSale > 0, "Must sell at least 1 token");

        token = IERC20(_token);
        initialPrice = _initialPrice;
        duration = _duration;
        startTime = block.timestamp;
        priceDropPerSecond = _initialPrice / _duration;
        tokensForSale = _tokensForSale;
        auctionEnded = false;

        require(token.transferFrom(msg.sender, address(this), _tokensForSale), "Token transfer failed");

        emit AuctionStarted(seller, _initialPrice, startTime, _duration);
    }

    function getCurrentPrice() public view returns (uint256) {
        if (auctionEnded) {
            return 0;
        }
        uint256 elapsedTime = block.timestamp - startTime;
        if (elapsedTime >= duration) {
            return 0; // Price reaches zero at end
        }
        return initialPrice - (elapsedTime * priceDropPerSecond);
    }

    function buyTokens() external payable {
        require(!auctionEnded, "Auction has ended");
        uint256 currentPrice = getCurrentPrice();
        require(currentPrice > 0, "Auction expired");
        require(msg.value >= currentPrice, "Insufficient payment");

        auctionEnded = true;

        // Transfer funds to seller
        payable(seller).transfer(currentPrice);

        // Transfer tokens to buyer
        token.transfer(msg.sender, tokensForSale);

        emit TokensPurchased(msg.sender, tokensForSale, currentPrice);
    }
}
