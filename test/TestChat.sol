pragma solidity >=0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Chat.sol";

contract TestChat {
    function testChat() public {
        Chat chat = Chat(
            DeployedAddresses.Chat()
        );

        string memory message = "Hello World!";

        chat.send(message);

        Assert.equal(
            chat.get()[0].message,
            message,
            "Should store the message."
        );
    }
}
