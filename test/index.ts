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

describe("Messaging", function () {
  it("Calling addInbox adds a new Inbox", async function () {
    // wait until the transaction is mined

    const tx = await messaging
      .connect(addr1)
      // receiver, content, inboxName
      .addInbox("test", "This is a very simple test inbox", {
        nftContract: "0xfd37f4625ca5816157d55a5b3f7dd8dd5f8a0c2f",
        count: 2,
      });
    await tx.wait();

    const inbox = await messaging.inboxes(addr1.address, "test");

    expect(inbox.exists).to.be.equal(true);
    expect(inbox.name).to.be.equal("test");
    expect(inbox.description).to.be.equal("This is a very simple test inbox");
  });
});

describe("Messaging", function () {
  it("Adding an Inbox emits an event", async function () {
    await expect(
      messaging
        .connect(addr1)
        // receiver, content, inboxName
        .addInbox("test", "This is a very simple test inbox", {
          nftContract: "0xfd37f4625ca5816157d55a5b3f7dd8dd5f8a0c2f",
          count: 2,
        })
    ).to.emit(messaging, "InboxAdded");
    // .withArgs(
    //   addr1.address,
    //   "test",
    //   "This is a very simple test inbox",
    //   "Hey what's up!"
    // );
  });
});

describe("Messaging", function () {
  it("Sending a message to an inbox requires an NFT", async function () {
    // create nft
    const NFT = await ethers.getContractFactory("TestNft");
    const nft = await NFT.deploy();
    await nft.deployed();

    const mintTx = await nft.connect(owner).safeMint(addr1.address);
    await mintTx.wait();
    expect(await nft.balanceOf(addr1.address)).to.be.equal(1);

    // add inbox with nft requirement - address2 creates inbox
    const inboxTx = await messaging
      .connect(addr2)
      // receiver, content, inboxName
      .addInbox("nft", "This is a very simple test inbox", {
        nftContract: nft.address,
        count: 1,
      });
    await inboxTx.wait();

    // send message from address1 to nft inbox of addres2
    const messageTx = await messaging
      .connect(addr1)
      .send(addr2.address, "Hey what's up!", "nft");

    await messageTx.wait();
  });
});
