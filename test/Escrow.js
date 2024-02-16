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
    transaction = await realEstate.connect(seller).List(1);
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
    it("Updates Ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
  });
});
