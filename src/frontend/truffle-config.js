require('dotenv').config()
const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const MNEMONIC = process.env.MNEMONIC || 'dawn topple empty case fragile mirror enjoy cloud expect dash attitude result'
const INFURA_ID = process.env.INFURA_ID || 'e4588d11d73d47749c72f5f542832808'

module.exports = {
  compilers: {
    solc: {
      version: "0.6.12",
    },
  },
  contracts_build_directory: path.join(__dirname, './src/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_ID}`)
      },
      network_id: 4,
    },
  },
}
