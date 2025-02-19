import { ethers } from "hardhat";

async function main() {
    const [deployer, seller, buyer] = await ethers.getSigners();
    
    console.log("Deploying contract with account:", deployer.address);

    const ReverseDutchAuction = await ethers.getContractFactory("ReverseDutchAuction");
    const auction = await ReverseDutchAuction.deploy();
    await auction.waitForDeployment();

    console.log("Reverse Dutch Auction deployed at:", auction.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
