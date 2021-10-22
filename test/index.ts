import { Contract, ContractFactory } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

let Messaging: ContractFactory;
let messaging: Contract;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

beforeEach(async function () {
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  console.log("test");
  Messaging = await ethers.getContractFactory("Messaging");
  messaging = await Messaging.deploy();
  await messaging.deployed();

  console.log("is deployed");
});

describe("Messaging", function () {
  it("Should send a message", async function () {
    // wait until the transaction is mined

    const tx = await messaging
      .connect(addr1)
      .send(addr2.address, "Hey what's up!", true);
    await tx.wait();

    console.log(await messaging.inboxes(addr2.address, addr1.address, 0));

    // wait until the transaction is mined
    await tx.wait();
  });
});
