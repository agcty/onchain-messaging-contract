//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Messaging {
  struct Message {
    // should always be encrypted by caller
    string content;
    address sender;
    address receiver;
  }

  struct Inbox {
    string name;
    string description;
    bool hasCondition;
    Condition condition;
    bool exists;
  }

  struct Condition {
    address nftContract;
    uint256 count;
  }

  event Send(address indexed _from, address indexed _to);

  mapping(address => mapping(address => Message[])) public messages;
  mapping(address => mapping(string => Inbox)) public inboxes;

  function addInbox(
    string calldata name,
    string calldata description,
    bool hasCondition,
    Condition memory condition
  ) public {
    Inbox memory inbox = Inbox(
      name,
      description,
      hasCondition,
      condition,
      true
    );

    inboxes[msg.sender][name] = inbox;
  }

  // inspired by https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity
  function compareStrings(string memory a, string memory b)
    public
    view
    returns (bool)
  {
    return (keccak256(abi.encodePacked((a))) ==
      keccak256(abi.encodePacked((b))));
  }

  function send(
    address receiver,
    string calldata content,
    string calldata inboxName
  ) public {

    
    if (compareStrings(inboxName, "default")) {
      // if something different than default, ensure the inbox exists by checking its name
      require(inboxes[receiver][inboxName].exists == true);
    }

    Message memory message = Message(content, msg.sender, receiver);
    messages[receiver][msg.sender].push(message);
    emit Send(msg.sender, receiver);
  }
}
