const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "local book high keep benefit thrive crop garlic shoulder jacket fox crumble",
  "https://rinkeby.infura.io/jhaPt7OKXvLOEJhOP9pg"
); // first is account mnemonic, second is the network url

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deply from account: ", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("contract deployed to: ", result.options.address);
};

deploy();
