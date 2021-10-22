//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Messaging {
  struct Message {
    string content;
    address sender;
    address receiver;
  }

  mapping(address => mapping(address => Message[])) public inboxes;

  function send(address receiver, string calldata content) public {
    Message memory message = Message(content, msg.sender, receiver);
    inboxes[receiver][msg.sender].push(message);
  }

  // constructor(string memory _greeting) {
  //   console.log("Deploying a Greeter with greeting:", _greeting);
  // }
}
