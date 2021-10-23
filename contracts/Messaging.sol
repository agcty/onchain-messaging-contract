//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Messaging {
  struct Message {
    address receiver;
    address sender;
    // should always be encrypted by caller
    string content;
    string inboxName;
  }

  struct Inbox {
    string name;
    string description;
    Condition condition;
    bool exists;
  }

  struct Condition {
    address nftContract;
    uint256 count;
  }

  event Send(
    address indexed _from,
    address indexed _to,
    string indexed content,
    string inboxName
  );

  event InboxAdded(
    address indexed owner,
    string indexed name,
    string indexed description,
    Condition condition
  );

  // flat mapping for inboxes and messages, easier than a super nested mapping
  mapping(address => mapping(address => Message[])) public messages;
  mapping(address => mapping(string => Inbox)) public inboxes;

  function addInbox(
    string calldata name,
    string calldata description,
    Condition memory condition
  ) public {
    // add additional exist field for easier checking if an inbox exists
    Inbox memory inbox = Inbox(name, description, condition, true);
    inboxes[msg.sender][name] = inbox;

    emit InboxAdded(msg.sender, name, description, condition);
  }

  // inspired by https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity
  function compareStrings(string memory a, string memory b)
    public
    pure
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
    // be extra explicit for readability
    if (compareStrings(inboxName, "default") == false) {
      // if inbox is different than default, ensure the inbox exists by checking its name

      bool inboxExists = inboxes[receiver][inboxName].exists;
      Condition memory condition = inboxes[receiver][inboxName].condition;

      require(inboxExists == true, "Inbox does not exist");

      // now check if the sender has the required amount of nfts of a specific collection
      uint256 userNftBalance = IERC721(condition.nftContract).balanceOf(
        msg.sender
      );

      uint256 requiredBalance = condition.count;

      require(userNftBalance >= requiredBalance, "Condition not met");

      // bonus points
      // create composable conditions: 1 NFT of CryptoKitties && 1 NFT of Punks || 10 AAVE Tokens ;)
    }

    Message memory message = Message(receiver, msg.sender, content, inboxName);
    messages[receiver][msg.sender].push(message);

    // emit event for graph
    emit Send(msg.sender, receiver, content, inboxName);
  }
}
