const path = require('path')
const HDWalletProvider = require('@truffle/hdwallet-provider')

const MNEMONIC = 'dawn topple empty case fragile mirror enjoy cloud expect dash attitude result'

module.exports = {
  compilers: {
    solc: {
      version: "0.6.0",
    },
  },
  contracts_build_directory: path.join(__dirname, './src/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/v3/e4588d11d73d47749c72f5f542832808')
      },
      network_id: 4,
    },
  },
}
