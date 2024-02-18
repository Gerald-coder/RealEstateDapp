const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let seller, realEstate, buyer, inspector, lender, escrow;

  beforeEach(async () => {
    // setup accounts
    [seller, buyer, inspector, lender] = await ethers.getSigners();

    // deploy realEstate
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    // mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    // deploy Escrow
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );

    //approve realEstate
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();

    // List property
    transaction = await escrow
      .connect(seller)
      .List(1, tokens(10), tokens(5), buyer.address);
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("returns the nftAddress", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
      console.log(result);
    });
    it("returns the seller address", async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
      console.log(result);
    });
    it("returns the inspector address", async () => {
      const result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
      console.log(result);
    });
    it("returns the lender address", async () => {
      const result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
      console.log(result);
    });
  });

  describe("Listing", () => {
    it("Updates listings", async () => {
      const result = await escrow.isListing(1);
      expect(result).to.be.equal(true);
    });
    it("Updates Ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
    it("returns buyer address", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address);
    });
    it("returns purchase price", async () => {
      const result = await escrow.purchasePrice(1);
      expect(result.eq(tokens(10))).to.equal(true);
    });
    it("returns escrow amount", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result.eq(tokens(5))).to.equal(true);
    });
  });

  describe("Deposit", () => {
    it("Updates deposit", async () => {
      const transaction = await escrow
        .connect(buyer)
        .depositEarnest(1, { value: tokens(5) });
      await transaction.wait();
      //
      const result = await escrow.getBalance();
      // expect(result).to.be.equal(tokens(5));
      expect(result.eq(tokens(5))).to.be.equal(true);
    });
  });

  describe("Inspection", () => {
    it("returns the inspction status", async () => {
      const transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await transaction.wait();

      const result = await escrow.inspectionPassed(1);
      expect(result).to.be.equal(true);
    });
  });
  describe("Approval", () => {
    it("updates approval status", async () => {
      let transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      expect(await escrow.approved(1, buyer.address)).to.be.equal(true);
      expect(await escrow.approved(1, seller.address)).to.be.equal(true);
      expect(await escrow.approved(1, lender.address)).to.be.equal(true);
    });
  });

  describe("Sales", async () => {
    beforeEach(async () => {
      let transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await transaction.wait();

      transaction = await escrow
        .connect(buyer)
        .depositEarnest(1, { value: tokens(5) });
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      await lender.sendTransaction({ to: escrow.address, value: tokens(5) });

      transaction = await escrow.connect(seller).finalizeSales(1);
      await transaction.wait();
    });
    it("updates balance", async () => {
      const result = await escrow.getBalance();
      expect(result.eq(0)).to.be.equal(true);
    });
    it("tranfers nft", async () => {
      const result = await realEstate.ownerOf(1);
      expect(result).to.be.equal(buyer.address);
    });
  });
});
