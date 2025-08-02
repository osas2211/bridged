const { ethers, network } = require("hardhat")

const wethByNetwork = {
  hardhat: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
}

async function main() {
  const LOP = await ethers.getContractFactory("LimitOrderProtocol")
  const lop = await LOP.deploy(wethByNetwork["hardhat"])
  await lop.deployed()
  console.log("LimitOrderProtocol deployed at:", lop.address)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
