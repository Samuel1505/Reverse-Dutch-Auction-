import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Reverse Dutch Auction", function () {
    let auction: Contract;
    let token: Contract;
    let seller: any;
    let buyer: any;

    beforeEach(async function () {
        [seller, buyer] = await ethers.getSigners();

        // Deploy ERC20 token for testing
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        token = await ERC20Mock.deploy("TestToken", "TTK", seller.address, ethers.parseEther("1000"));
        await token.waitForDeployment();

        // Deploy auction contract
        const ReverseDutchAuction = await ethers.getContractFactory("ReverseDutchAuction");
        auction = await ReverseDutchAuction.deploy();
        await auction.waitForDeployment();
    });

    it("Should start an auction correctly", async function () {
        const initialPrice = ethers.parseEther("1"); // 1 ETH
        const duration = 300; // 5 minutes
        const tokensForSale = 100;

        // Approve token transfer
        await token.connect(seller).approve(auction.target, tokensForSale);

        await auction.connect(seller).startAuction(token.target, initialPrice, duration, tokensForSale);

        const storedPrice = await auction.getCurrentPrice();
        expect(storedPrice).to.be.equal(initialPrice);
    });

    it("Should decrease price over time", async function () {
        const initialPrice = ethers.parseEther("1"); // 1 ETH
        const duration = 30; // 30 seconds (reduced duration for testing)
        const tokensForSale = 100;
    
        await token.connect(seller).approve(auction.target, tokensForSale);
        await auction.connect(seller).startAuction(token.target, initialPrice, duration, tokensForSale);
    
        // Use Hardhat to fast-forward time instead of waiting
        await ethers.provider.send("evm_increaseTime", [20]); // Skip 20 seconds
        await ethers.provider.send("evm_mine", []); // Mine a new block
    
        const newPrice = await auction.getCurrentPrice();
        expect(newPrice).to.be.lessThan(initialPrice);
    });
    

    it("Should allow only one buyer to purchase", async function () {
        const initialPrice = ethers.parseEther("1"); // 1 ETH
        const duration = 30;
        const tokensForSale = 100;
    
        await token.connect(seller).approve(auction.target, tokensForSale);
        await auction.connect(seller).startAuction(token.target, initialPrice, duration, tokensForSale);
    
        // Fast forward time to lower the price
        await ethers.provider.send("evm_increaseTime", [25]);
        await ethers.provider.send("evm_mine", []);
    
        const currentPrice = await auction.getCurrentPrice();
    
        // Buyer purchases tokens at the lowered price
        await auction.connect(buyer).buyTokens({ value: currentPrice });
    
        // Ensure the second buyer cannot buy (auction should be closed)
        await expect(
            auction.connect(buyer).buyTokens({ value: currentPrice })
        ).to.be.revertedWith("Auction has ended");
    });
    

    it("Should handle auction expiration correctly", async function () {
        const initialPrice = ethers.parseEther("1"); // 1 ETH
        const duration = 3; // 3 seconds
        const tokensForSale = 100;
    
        await token.connect(seller).approve(auction.target, tokensForSale);
        await auction.connect(seller).startAuction(token.target, initialPrice, duration, tokensForSale);
    
        // Fast forward past the auction duration
        await ethers.provider.send("evm_increaseTime", [5]); // Move 5 seconds ahead
        await ethers.provider.send("evm_mine", []);
    
        const finalPrice = await auction.getCurrentPrice();
        expect(finalPrice).to.equal(0);
    });
    
});
