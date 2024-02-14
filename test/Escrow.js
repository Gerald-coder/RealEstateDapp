const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let realEstate, buyer, seller, escrow, inspector, lender;
  it("saves the address", async () => {
    // set up account
    [buyer, seller, inspector, lender] = await ethers.getSigners();
    console.log(buyer, seller);
    // deploy Real Estate
    const ReaLEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await ReaLEstate.deploy();

    // mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );
  });
});
