import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
    const [ deployer ] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const SEsA = await ethers.getContractFactory("SEsA");
    const contract = await SEsA.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("SEsA deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});