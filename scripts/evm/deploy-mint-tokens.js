const hardhat = require("hardhat")
const dotenv = require("dotenv")

const ethers = hardhat.ethers
dotenv.config()

async function main() {
  const [deployer] = await ethers.getSigners()
  const tokens = ["USDC", "USDT", "DAI"]
  console.log(deployer.address)

  const ERC20Preset = await ethers.getContractFactory("TestERC20")
  for (const token of tokens) {
    const amount = ethers.utils.parseUnits("1000000000", 18)
    const tToken = await ERC20Preset.deploy(
      `Test t${token}`,
      `t${token}`,
      BigInt(18),
      amount
    )
    await tToken.deployed()
    console.log(`t${token} deployed at: `, tToken.address)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
