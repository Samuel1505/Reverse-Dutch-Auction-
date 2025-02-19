import { ethers } from "hardhat";

async function main() {
    const [seller, buyer] = await ethers.getSigners();
    const auctionAddress = "0x406AB5033423Dcb6391Ac9eEEad73294FA82Cfbc"; // Replace with actual address
    const tokenAddress = "YOUR_ERC20_TOKEN_ADDRESS"; // Replace with ERC20 token address
    const auction = await ethers.getContractAt("ReverseDutchAuction", auctionAddress);

    // Seller starts the auction
    const initialPrice = ethers.parseEther("1"); // 1 ETH per token
    const duration = 300; // 5 minutes
    const tokensForSale = 100;

    console.log("Starting auction...");
    await auction.connect(seller).startAuction(tokenAddress, initialPrice, duration, tokensForSale);
    console.log("Auction started!");

    // Simulate waiting for price drop
    await new Promise(resolve => setTimeout(resolve, 100000)); // Wait for price to decrease

    // Buyer purchases at lower price
    console.log("Buying tokens at lower price...");
    const currentPrice = await auction.getCurrentPrice();
    await auction.connect(buyer).buyTokens({ value: currentPrice });
    console.log("Tokens purchased successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

