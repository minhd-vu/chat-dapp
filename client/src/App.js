import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import ChatContract from "./contracts/Chat.json";
import getWeb3 from "./getWeb3";
import { Drizzle } from '@drizzle/store';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const options = {
	contracts: [
		SimpleStorageContract,
		ChatContract
	],
};

// eslint-disable-next-line
const drizzle = new Drizzle(options);

class App extends Component {
	state = { messages: 0, web3: null, accounts: null, contract: null };

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ChatContract.networks[networkId];
			const instance = new web3.eth.Contract(
				ChatContract.abi,
				deployedNetwork && deployedNetwork.address,
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance }, this.runExample);
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	runExample = async () => {
		const { accounts, contract } = this.state;

		// await contract.methods.send("Hello World!").send({ from: accounts[0] });

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.get().call();

		console.log(response);

		// Update state with the result.
		this.setState({
			messages: response.map(x =>
				<li className="list-group-item">{x.message}</li>
			)
		});
	};

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<h1>Chat dApp</h1>
				<div>Account: {this.state.accounts}</div>
				<ul className="list-group">
					{this.state.messages}
				</ul>
			</div>
		);
	}
}



export default App;
