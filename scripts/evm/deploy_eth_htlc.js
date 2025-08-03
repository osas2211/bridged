const { ethers } = require("hardhat")
async function main() {
  const HTLC = await ethers.getContractFactory("EthHTLC")
  const htlc = await HTLC.deploy()
  console.log("EthHTLC deployed at:", htlc.address)
}
main()
