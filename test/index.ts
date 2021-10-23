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

  Messaging = await ethers.getContractFactory("Messaging");
  messaging = await Messaging.deploy();
  await messaging.deployed();
});

describe("Messaging", function () {
  it("Sending a message stores it in the correct place", async function () {
    // wait until the transaction is mined

    const tx = await messaging
      .connect(addr1)
      // receiver, content, inboxName
      .send(addr2.address, "Hey what's up!", "default");
    await tx.wait();

    const message = await messaging.messages(addr2.address, addr1.address, 0);
    const content = message.content;

    console.log(content);

    expect(content).to.be.equal("Hey what's up!");

    await tx.wait();
  });
});

describe("Messaging", function () {
  it("Sending to non-existing inbox throws", async function () {
    // wait until the transaction is mined

    await expect(
      messaging
        .connect(addr1)
        // receiver, content, inboxName
        .send(addr2.address, "Hey what's up!", "willThrow")
    ).to.be.revertedWith("Inbox does not exist");
  });
});

describe("Messaging", function () {
  it("Sending a message emits an event", async function () {
    await expect(
      messaging.connect(addr1).send(addr2.address, "Hey what's up!", "default")
    )
      .to.emit(messaging, "Send")
      .withArgs(addr1.address, addr2.address, "Hey what's up!");
  });
});
