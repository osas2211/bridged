const TRX_HTLC = artifacts.require("TRX_HTLC.sol")
module.exports = async function (deployer) {
  await deployer.deploy(TRX_HTLC)
}
