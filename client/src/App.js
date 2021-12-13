import React, { Component } from "react";
import ChatContract from "./contracts/Chat.json";
import getWeb3 from "./getWeb3";
import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
	{
		field: "id",
		headerName: "Date",
	},
	{
		field: "author",
		headerName: "Author",
	},
	{
		field: "message",
		headerName: "Message",
	},
];

class App extends Component {
	state = { messages: 0, web3: null, accounts: null, contract: null };

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
		// eslint-disable-next-line
		const { accounts, contract } = this.state;

		// await contract.methods.send("Hello World!").send({ from: accounts[0] });

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.get().call();

		console.log(response);

		// Update state with the result.
		this.setState({
			messages: response.map((m, i) => ({
				id: new Date(m.time * 1000),
				author: m.author,
				message: m.message,
			}))
		});
	};

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<h1 className="text-center">Chat dApp</h1>
				<div style={{ width: "100%" }}>
					<DataGrid
						rows={this.state.messages}
						columns={columns}
						pageSize={5}
						autoPageSize
						rowsPerPageOptions={[5]}
						selectionModel={0}
						autoHeight
						disableColumnMenu
					/>
				</div>
			</div>
		);
	}
}

export default App;
