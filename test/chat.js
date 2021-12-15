const Chat = artifacts.require("./Chat.sol");

contract("Chat", accounts => {
	it("Store the message and account", async () => {
		const instance = await Chat.deployed();

		let message = "Hello World!";
		await instance.send(message, { from: accounts[0] });

		// Get the stored message
		const data = await instance.get.call();

		assert.equal(data[0].message, message, "Message '${message}' was not stored.");
		assert.equal(data[0].author, accounts[0], "Account ${accounts[0]} was not stored.");
	});
});
