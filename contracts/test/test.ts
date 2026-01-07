import { network } from "hardhat";
import { expect } from "chai";

const { ethers } = await network.connect();

describe("Escrow Contract", function () {
    async function deployFixture() {
        const [buyer, seller, arbitrator] = await ethers.getSigners();
        const SEsA = await ethers.getContractFactory("SEsA");
        const contract = await SEsA.deploy();
        await contract.waitForDeployment();

        return { contract, buyer, seller, arbitrator };
    }
    
    describe("Deployment", function () {
        it("deploy correctly", async function() {
            const { contract } = await deployFixture();
            expect(await contract.totalEscrows()).to.equal(0);
        });
    });

    describe("Create Escrow", function () {
        it("create escrow correctly", async function() {
            const { contract, buyer, seller, arbitrator } = await deployFixture();
            const amount = ethers.parseEther("1");

            await expect(
                contract.connect(buyer).createEscrow(seller.address, arbitrator.address, amount, { value: amount })
            ).to.emit(contract, "EscrowCreated");

            const escrow = await contract.getEscrow(0);
            expect(escrow.buyer).to.equal(buyer.address);
            expect(escrow.seller).to.equal(seller.address);
            expect(escrow.arbitrator).to.equal(arbitrator.address);
            expect(escrow.amount).to.equal(amount);
            expect(escrow.status).to.equal(0); // AWAITING_RELEASE
        });
    });

    describe("Release Funds", function () {
        it("allows buyer to release funds", async function() {
            const { contract, buyer, seller, arbitrator } = await deployFixture();
            const amount = ethers.parseEther("1");

            await contract.connect(buyer).createEscrow(seller.address, arbitrator.address, amount, { value: amount });

            const sellerBalBefore = await ethers.provider.getBalance(seller.address);

            await expect(
                contract.connect(arbitrator).releaseFunds(0)
            ).to.emit(contract, "EscrowReleased");

            const sellerBalAfter = await ethers.provider.getBalance(seller.address);
            expect(sellerBalAfter - sellerBalBefore).to.equal(amount);
        });
    });

    describe("Refund Funds", function () {
        it("allows seller and arbitrator to refund funds", async function () {
            const { contract, buyer, seller, arbitrator } = await deployFixture();

            const amount = ethers.parseEther("1");
            
            await contract.connect(buyer).createEscrow(seller.address, arbitrator.address, amount, { value: amount });

            const buyerBalBefore = await ethers.provider.getBalance(buyer.address);

            await expect(
                contract.connect(seller).refundFunds(0)
            ).to.emit(contract, "EscrowRefunded");

            const buyerBalAfter = await ethers.provider.getBalance(buyer.address);
            expect(buyerBalAfter - buyerBalBefore).to.equal(amount);
        });
    });
})

