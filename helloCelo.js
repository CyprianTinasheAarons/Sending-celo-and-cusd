const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");

const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);

async function readAccount() {
  let goldtoken = await kit.contracts.getGoldToken();
  let stableToken = await kit.contracts.getStableToken();

  let anAddress = "0xD86518b29BB52a5DAC5991eACf09481CE4B0710d";

  let celoBalance = await goldtoken.balanceOf(anAddress);
  let cUSDBalance = await stableToken.balanceOf(anAddress);

  console.log(celoBalance.toString());
  console.log(cUSDBalance.toString());
}

const getAccount = require("./getAccount").getAccount;

async function createAccount() {
  let account = await getAccount();

  let goldtoken = await kit.contracts.getGoldToken();
  let stableToken = await kit.contracts.getStableToken();

  let celoBalance = await goldtoken.balanceOf(account.address);
  let cUSDBalance = await stableToken.balanceOf(account.address);

  // Print your account info
  console.log(`Your account address: ${account.address}`);
  console.log(`Your account CELO balance: ${celoBalance.toString()}`);
  console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
}

async function send() {
  let account = await getAccount();

  kit.connection.addAccount(account.privateKey);

  let anAddress = "0xD86518b29BB52a5DAC5991eACf09481CE4B0710d";

  let amount = 100000;

  let goldtoken = await kit.contracts.getGoldToken();
  let stableToken = await kit.contracts.getStableToken();

  let celotx = await goldtoken
    .transfer(anAddress, amount)
    .send({ from: account.address });
  let cusdtx = await stableToken
    .transfer(anAddress, amount)
    .send({ from: account.address });

  let celoReceipt = await celotx.waitReceipt();
  let cusdReceipt = await cusdtx.waitReceipt();

  console.log("CELO Transaction receipt: %o", celoReceipt);
  console.log("cUSD Transaction receipt: %o", cusdReceipt);

  let celoBalance = await goldtoken.balanceOf(account.address);
  let cUSDBalance = await stableToken.balanceOf(account.address);

  console.log(`Your account CELO balance: ${celoBalance.toString()}`);
  console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
}

readAccount();
createAccount();
send();
