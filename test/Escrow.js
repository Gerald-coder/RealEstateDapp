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
    // console.log(buyer, seller);

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

    // deploy escrow
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );

    let result = await escrow.nftAddress();
    expect(result).to.be.equal(realEstate.address);

    result = await escrow.seller();
    expect(result).to.be.equal(seller.address);

    console.log(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );
  });
});
