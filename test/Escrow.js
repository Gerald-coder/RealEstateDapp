const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  it("saves the address", async () => {
    const ReaLEstate = ethers.getContractFactory("RealEstate");
    let realEstate = await ReaLEstate.deploy;

    console.log(realEstate.address);
  });
});
