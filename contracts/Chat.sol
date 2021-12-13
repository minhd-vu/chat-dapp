// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/**
@title Chat dApp
@author github.com/minhd-vu
 */
contract Chat {
    struct Message {
        address author; // author of the message
        string message; // chat message
    }

    // A dynamically-sized array of `Message` structs
    Message[] public messages;

    /**
    @notice Send a message to the chat
    @param message The message being sent to the chat
     */
    function send(string memory message) public {
        messages.push(Message(msg.sender, message));
    }

    /**
    @notice Get all the messages from the chat
    @return Array of all the messages sent in chat
    */
    function get() public view returns (Message[] memory) {
        return messages;
    }
}
