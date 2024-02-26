// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  let transaction, seller, buyer, inspector, lender;

  // setup accounts
  [seller, buyer, inspector, lender] = await hre.ethers.getSigners();

  // deploy realEstate
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Deployed realEstate at ${realEstate.address} `);
  console.log(`minting 3 properties ...\n`);

  // // mint nft
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate
      .connect(seller)
      .mint(
        `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
          i + 1
        }.json`
      );
    await transaction.wait();
  }

  // deploy escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.deployed();

  console.log(`deployed escrow at ${escrow.address} `);

  // approve properties
  for (let i = 0; i < 3; i++) {
    let transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, i + 1);
    await transaction.wait();
  }

  // listing properties
  transaction = await escrow
    .connect(seller)
    .List(1, tokens(20), tokens(10), buyer.address);
  await transaction.wait();
  // console.log(realEstate);

  transaction = await escrow
    .connect(seller)
    .List(2, tokens(15), tokens(5), buyer.address);
  await transaction.wait();

  transaction = await escrow
    .connect(seller)
    .List(3, tokens(10), tokens(5), buyer.address);
  await transaction.wait();

  console.log("finished");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
