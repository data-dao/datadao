/* global artifacts, contract, web3, it, beforeEach, assert */

const MasterDataTokenFactory = artifacts.require("MasterDataTokenFactory")
const MasterDataTokenTemplate = artifacts.require("MasterDataToken")
const truffleAssert = require('truffle-assertions')
const ipfsClient = require('ipfs-http-client')

const infura = { host: "ipfs.infura.io", port: "5001", protocol: "https" };
// const oceanIpfs = { host: 'ipfs.oceanprotocol.com', port: '443', protocol: 'https' };
const ipfs = ipfsClient(infura)

const metadata = {
    title: 'Data DAO Template',
    description: 'Genesis MasterDataToken',
    requirements: {
        records: 10000,
    },
    customRequirements: [
        {
            label: 'Requirement 1',
            description: 'Req1 description'
        },
        {
            label: 'Requirement 2',
            description: 'Req1 description'
        }
    ],
    sampleData: 'ipfs://ipfs/sampledata',
    purchasePrice: web3.utils.toWei('100'),
    reviewPrice: web3.utils.toWei('1'),

}

const fileToUpload = JSON.stringify(metadata, null, 4);

contract('Factory test', async accounts => {

    let template;
    let factory;
    let ipfsMetadata;
    let minDataTokenAllowance;
    let daoAddress;
    const bob = accounts[1]
    const zeroAddress = '0x' + '0'.repeat(40)
    
    beforeEach('init contracts for each test', async function() {

        const upload = await ipfs.add(fileToUpload);
        console.log('Upload', upload)
        ipfsMetadata = 'ipfs://QmSMP4YcyXojE2Dt4MpxtUNRSkTfk3Df7eurMUKMzUVFvJ'
        minDataTokenAllowance = web3.utils.toWei('200')
        daoAddress = '0x' + '0'.repeat(40)
        template = await MasterDataTokenTemplate.new('MasterDataTokenTemlate', 'MDT', ipfsMetadata, minDataTokenAllowance, daoAddress)
        factory = await MasterDataTokenFactory.new(template.address)
    })

    it('should create a token and check that it is not a zero address', async () => {
        truffleAssert.passes(
            result = await factory.createMasterDataToken(
                'DATA DAO 1', 'DD1', ipfsMetadata, minDataTokenAllowance, daoAddress,
                {
                    from: bob
                }
            )
        )
        truffleAssert.eventEmitted(result, 'MasterDataTokenCreated', (ev) => {
            console.log('MasterDataTokenCreated', ev)
            tokenAddress = ev.param1
            return tokenAddress !== zeroAddress
        })
    })

    it('should fail on zero template address factory initialization', async () => {
        truffleAssert.fails(MasterDataTokenFactory.new(zeroAddress),
            truffleAssert.ErrorType.REVERT,
            'MasterDataTokenFactory: Invalid contract template'
        )
    })

    it('should get the token count', async () => {
        const currentTokenCount = await factory.getMasterDataTokenCount()
        assert.equal(currentTokenCount.toNumber(), 1)
    })

    it('should get the token template', async () => {
        const tokenTemplate = await factory.getTemplate()
        assert.equal(template.address, tokenTemplate)
    })
})