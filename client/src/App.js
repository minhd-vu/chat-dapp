import React, { Component } from "react";
import ChatContract from "./contracts/Chat.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

const columns = [
	{
		field: "id",
		headerName: "Date",
		minWidth: 200,
	},
	{
		field: "author",
		headerName: "Author",
		minWidth: 400,
	},
	{
		field: "message",
		headerName: "Message",
		flex: 1,
	},
];

const pageSize = 10;

class App extends Component {
	state = {
		messages: 0,
		web3: null,
		accounts: null,
		contract: null,
		page: 0,
		message: ""
	};

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user"s accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ChatContract.networks[networkId];
			const instance = new web3.eth.Contract(
				ChatContract.abi,
				deployedNetwork && deployedNetwork.address,
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract"s methods.
			this.setState({ web3, accounts, contract: instance }, this.getMessages);
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	getMessages = async () => {
		const { contract } = this.state;

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.get().call();

		console.log(response);

		const messages = response.map(m => ({
			id: new Date(m.time * 1000).toLocaleString(),
			author: m.author,
			message: m.message,
		}));

		// Update state with the result.
		this.setState({
			messages: messages,
			page: messages.length / pageSize,
		});
	};

	onSubmit = async (e) => {
		e.preventDefault();
		const { accounts, contract, message } = this.state;
		await contract.methods.send(message).send({ from: accounts[0] });
		window.location.reload(false);
	}

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App mx-5">
				<h1 className="text-center">Chat dApp</h1>
				<p className="text-center">Account: {this.state.accounts[0]}</p>
				<div style={{ height: 500, width: "100%" }}>
					<DataGrid
						rows={this.state.messages}
						columns={columns}
						pageSize={pageSize}
						pagination
						onPageChange={p => this.setState({ page: p })}
						page={this.state.page}
					/>
				</div>
				<form onSubmit={this.onSubmit} >
					<TextField
						className="my-3"
						id="outlined-basic"
						label="Send Message..."
						variant="outlined"
						fullWidth
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" color="primary" type="submit">
										<Send />
									</IconButton>
								</InputAdornment>
							),
						}}
						value={this.state.message}
						onInput={e => this.setState({ message: e.target.value })}
					/>
				</form>
			</div >
		);
	}
}

export default App;
