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
    function send(string calldata message) external {
        messages.push(Message(msg.sender, message));
    }

    /**
    @notice Get all the messages from the chat
    @return Array of all the messages sent in chat
    */
    function get() external view returns (Message[] memory) {
        return messages;
    }

    /**
    @notice Get the `n` latest messages from the chat
    @param n The `n` latest messagess that were sent
    @return Array of `n` messages sent in chat
    @dev We cannot use slices because that is calldata only, and there is no negative indexing, so this is a little more involved than usual.
    */
    function get(uint256 n) external view returns (Message[] memory) {
        Message[] memory m = new Message[](n);
        for (uint256 i = 0; i < n; i++) {
            m[i] = messages[messages.length - i - 1];
        }
        return m;
    }
}
