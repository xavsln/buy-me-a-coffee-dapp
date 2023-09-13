const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");
// require("dotenv").config();

// Returns the Ether balance of a given address.
async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);

  return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that was deployed on Sepolia
  const contractAddress = "0x323C1787E850F67f942d4367F64864a0A6B6271d";
  const contractAbi = abi.abi;

  // Get the node connection and wallet connect (Note: from v6 ethers.providers.* is replaced by ethers.*, we can therefore remove the providers keyword)
  const provider = new ethers.AlchemyProvider(
    "sepolia",
    process.env.ALCHEMY_SEPOLIA_API_KEY
  );

  // const blockNber = await provider.getBlockNumber();
  // console.log(blockNber);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  // Create an instance of the BuyMeACoffee Contract
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  // Check the current balances - Note: Calling the custom getBalance above, not the one from Ethers.js as we want to convert the format as well
  console.log(
    "Current balance of Owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
  const contractBalance = await getBalance(provider, contractAddress);
  console.log("Current balance of the Contract: ", contractBalance, "ETH");

  // Withdraw funds if amount on the Contract > 0 ETH
  if (contractBalance !== "0.0") {
    console.log("Withdrawing funds...");
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("No funds to withdraw");
  }

  // Check the ending balance
  console.log(
    "Balance on the owner accounts after withdrawal: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
