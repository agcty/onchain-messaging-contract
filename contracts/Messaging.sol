//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Messaging {
  struct Message {
    string content;
    address sender;
    address receiver;
    bool encrypted;
  }

  mapping(address => mapping(address => Message[])) public inboxes;

  event Send(address indexed _from, address indexed _to);

  function send(
    address receiver,
    string calldata content,
    bool encrypted
  ) public {
    Message memory message = Message(content, msg.sender, receiver, encrypted);
    inboxes[receiver][msg.sender].push(message);

    emit Send(msg.sender, receiver);
  }

  // constructor(string memory _greeting) {
  //   console.log("Deploying a Greeter with greeting:", _greeting);
  // }
}
