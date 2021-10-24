// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Messaging = await ethers.getContractFactory("Messaging");
  const messaging = await Messaging.deploy();

  await messaging.deployed();

  console.log("Messaging deployed to:", messaging.address);

  // const TestNft = await ethers.getContractFactory("TestNft");
  // const testNft = await TestNft.deploy();

  // await testNft.deployed();

  // console.log("TestNft deployed to:", testNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
