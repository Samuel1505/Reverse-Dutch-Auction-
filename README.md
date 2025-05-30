# Reverse Dutch Auction Smart Contract

## Overview
The `ReverseDutchAuction` smart contract implements a reverse Dutch auction mechanism for selling ERC-20 tokens. In this auction, the price of the tokens decreases over time until a buyer purchases them.

## Features
- Seller initiates an auction by specifying:
  - The ERC-20 token being sold
  - The initial price
  - The auction duration
  - The number of tokens for sale
- The price decreases linearly over time.
- Buyers can purchase tokens at the current auction price.
- The auction ends once a buyer makes a purchase.

## Contract Details
### `ReverseDutchAuction.sol`
- **Seller:** The address that starts the auction and receives the payment.
- **Token:** The ERC-20 token being auctioned.
- **Initial Price:** The starting price of the auction.
- **Duration:** The total time for the auction.
- **Price Drop Per Second:** The rate at which the price decreases.
- **Tokens For Sale:** The number of tokens available for purchase.
- **Auction Ended:** Boolean flag to check if the auction has ended.

### `ERC20Mock.sol`
A mock ERC-20 token contract used for testing the auction contract.

## Functions
### `startAuction`
```solidity
function startAuction(
    address _token,
    uint256 _initialPrice,
    uint256 _duration,
    uint256 _tokensForSale
) external;
```
- Starts the auction.
- Transfers the tokens from the seller to the contract.
- Emits the `AuctionStarted` event.

### `getCurrentPrice`
```solidity
function getCurrentPrice() public view returns (uint256);
```
- Returns the current price based on the elapsed time.
- Price drops linearly until it reaches zero at the end of the auction.

### `buyTokens`
```solidity
function buyTokens() external payable;
```
- Allows a buyer to purchase tokens at the current auction price.
- Transfers the tokens to the buyer and the payment to the seller.
- Emits the `TokensPurchased` event.

## Events
### `AuctionStarted`
```solidity
 event AuctionStarted(address indexed seller, uint256 initialPrice, uint256 startTime, uint256 duration);
```
- Emitted when the auction is started.

### `TokensPurchased`
```solidity
 event TokensPurchased(address indexed buyer, uint256 amount, uint256 finalPrice);
```
- Emitted when a buyer purchases tokens.

## Deployment & Usage
1. Deploy `ERC20Mock` token and mint tokens to the seller.
2. Deploy `ReverseDutchAuction` contract.
3. Call `startAuction` to begin the auction.
4. Buyers call `buyTokens` to purchase tokens at the current price.

## License
This project is licensed under the MIT License.

