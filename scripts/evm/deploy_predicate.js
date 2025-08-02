const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("***Deploying contracts with account:", deployer.address)
  const factory = await ethers.getContractFactory("PreimagePredicate")
  const contract = await factory.deploy()
  await contract.deployed()
  console.log("***PreimagePredicate deployed:", contract.address)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
