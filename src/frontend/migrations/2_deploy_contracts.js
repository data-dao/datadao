/* global artifacts, web3 */

const MasterDataTokenFactory = artifacts.require("MasterDataTokenFactory");
const MasterDataToken = artifacts.require("MasterDataToken");
const TestContract = artifacts.require("TestContract");

const ipfsMetadata = 'ipfs://QmSVmNRZuyLEwvhHAxKsbudnrxJTXCx5FtL8PcrfYbMr1g'

module.exports = async (deployer, network, accounts) => {

  deployer.deploy(TestContract)

  const minDataTokenAllowance = web3.utils.toWei('200')
  const daoAddress = '0x' + '0'.repeat(40)

  await deployer.deploy(
    MasterDataToken,
    "MasterDataTokenTemplate",
    "MDT",
    ipfsMetadata,
    minDataTokenAllowance,
    daoAddress
  )
  console.log(`MasterDataTokenTemplate deployed at ${MasterDataToken.address}`)

  const templateAddress = MasterDataToken.address
  // const templateAddress = accounts[1]; // Must fail
  await deployer.deploy(
    MasterDataTokenFactory,
    templateAddress
  );
  console.log(`MasterDataTokenFactory deployed at ${MasterDataTokenFactory.address}`)
};
