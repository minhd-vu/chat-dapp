// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Chat {
    struct Message {
        address author; // author of the message
        string message; // chat message
    }

    // A dynamically-sized array of `Message` structs.
    Message[] public messages;

    // Send a message to the chat
    function send(string memory message) public {
        messages.push(Message(msg.sender, message));
    }

    // Return all the messages sent
    function get() public view returns (Message[] memory) {
        return messages;
    }
}
