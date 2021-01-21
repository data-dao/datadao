import axios from 'axios'
import {
    DAOMigrationResult,
    getWeb3,
    DAOMigrationCallbacks,
    migrateDAO,
    getNetworkName,
//   } from "@dorgtech/daocreator-lib";
  } from "@dorgtech/daocreator-lib-experimental" // comment in Arc1
import { DDO } from '@oceanprotocol/lib'
import Notify from "bnc-notify"
import ipfsClient from 'ipfs-http-client'
import Web3 from "web3"

import { HTTP_PROVIDER, NOTIFY_API_KEY } from 'config'
import IERC20Template from 'contracts/IERC20Template.json'

const notify = Notify({
    dappId: NOTIFY_API_KEY,
    networkId: 4
});
  

const infura = { host: "ipfs.infura.io", port: 5001, protocol: "https" };
const ipfs = ipfsClient(infura)

export interface DataDAOInfo {
    daoInfo: DAOMigrationResult
    alchemyURI: string
}

export interface DAOMetadata {
    title: string
    description: string
    requirements: {
        records: number
    },
    customRequirements: Array<{
        label: string
        description: string
    }>,
    sampleData: string
    purchasePrice: string
    reviewPrice: string
    daoInfo?: DAOMigrationResult
    alchemyURI?: string
}

export interface MasterDataTokenMeta {
    daoAddress: string
    ipfsMetadata: string
    metadata?: DAOMetadata,
    minDatatokenAllowance: string
    owner: string
    templateAddress?: string
    tokenAddress: string
}

export interface ContributionMeta {
    contributor: string
    dataToken: string
    records: string
    ddo: DDO
}

export interface DataTokenOpts {
    cap?: string
    name?: string
    symbol?: string
}

const getCallbacks = () => {
    const callbacks: DAOMigrationCallbacks = {
      userApproval: (msg: string): Promise<boolean> =>
           new Promise<boolean>(resolve => {
               console.log(msg)
               resolve(true)
           }),
      info: (msg: string) => console.log('Info Msg', msg),

      error: (msg: string) => console.log('Error Msg', msg),

      txComplete: (msg: string, txHash: string, txCost: number) =>
        new Promise<void>(resolve => {
          console.log('txComplete', msg, txHash, txCost)
          resolve();
        }),
      migrationAborted: (err: Error) => {
        console.log('migrationAborted', err)
      },
      migrationComplete: (result: DAOMigrationResult) => {
        // Unimplemented callback
        console.log('migrationComplete', result)
      },

      getState: () => {
        const localState = localStorage.getItem("DAO_MIGRATION_STATE");
        return localState ? JSON.parse(localState) : {};
      },

      setState: (state: any) => {
        localStorage.setItem("DAO_MIGRATION_STATE", JSON.stringify(state));
      },

      cleanState: () => {
        localStorage.removeItem("DAO_MIGRATION_STATE");
      }
    };
    return callbacks;
};

export const deployDAO = async (dao: any): Promise<DataDAOInfo | undefined> => {

    const web3 = await getWeb3()

    const callbacks: DAOMigrationCallbacks = getCallbacks();
    
    const result = await migrateDAO(dao, callbacks);
    console.log('RESULT', result)
    // Getting around unimplemented callback
    if (!result) return;

    let network = await getNetworkName();
    if (network === 'private') {
      if (await web3.eth.net.getId() === 100) {
        network = 'xdai'
      } else if (await web3.eth.net.getId() === 77) {
        network = 'sokol'
      }
    }

    let url;
    if (network === "mainnet") url = `https://alchemy.do/dao/${result.Avatar}`;
    else if (network === "rinkeby") url = `https://rinkeby.alchemy.do/dao/${result.Avatar}`;
    else if (network === "xdai") url = `https://xdai.alchemy.do/dao/${result.Avatar}`;
    else url = `/dao/${result.Avatar}`;
    console.log('alchemy URI', url)

    return {
        daoInfo: result,
        alchemyURI: url
    }
};

export const createMasterDataToken = async (name: string, symbol: string, daoMetadata: DAOMetadata, { drizzle, drizzleState }: any): Promise<boolean> => {

    return new Promise<boolean>(async (resolve, reject) => {

        let success = false;
        const fileToUpload = JSON.stringify(daoMetadata, null, 4);
        console.log('TO UPLOAD', fileToUpload)

        const upload = await ipfs.add(fileToUpload);
        console.log('Upload', upload.path)

        const ipfsMetadataHash = `ipfs://${upload.path}`
        // const ipfsMetadataHash = 'ipfs://QmSVmNRZuyLEwvhHAxKsbudnrxJTXCx5FtL8PcrfYbMr1g'

        const minDatatokenAllowance = Web3.utils.toWei('200')

        try {
            const tx = await drizzle.contracts.MasterDataTokenFactory.methods.createMasterDataToken(
                name,
                // 'DATA DAO 1',
                symbol,
                // "DDAO1", 
                ipfsMetadataHash, 
                minDatatokenAllowance, 
                daoMetadata.daoInfo!.Avatar
                // '0x' + '0'.repeat(40)
            ).send().on('transactionHash', (txHash: string) => {
                const { emitter } = notify.hash(txHash)
                emitter.on('txConfirmed', () => resolve(true))
                emitter.on('txCancel', () => resolve(false))
                emitter.on('txFailed', () => resolve(false))
            })
            console.log('TX', tx)
        } catch(e) {
            console.log('ERROR in createMasterDataToken', e)
            reject(e)
        }
    })

}

export const fetchDataDaos = async (drizzle: any, daoAddress?: string): Promise<Array<MasterDataTokenMeta>> => {
    return new Promise<Array<MasterDataTokenMeta>>((resolve, reject) => {
        const web3  = new Web3(HTTP_PROVIDER);
        const contract = new web3.eth.Contract(drizzle.contracts.MasterDataTokenFactory.abi, drizzle.contracts.MasterDataTokenFactory.address);
        const eventParams: {fromBlock?: number, filter?: any} = {
            fromBlock: 7866667
        }
        if (daoAddress) {
            eventParams.filter = { daoAddress }
        }
        contract.getPastEvents('MasterDataTokenCreated', eventParams, async (error: any, events: any) => {
            if (error) {
                reject(error)
            }  
            let daos: Array<MasterDataTokenMeta> = []
            if (events.length) {
                daos = await Promise.all(events.map(async (event: any) => {
                    const ipfsMetadata = event.returnValues.ipfsMetadata.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
                    let rs;
                    try {
                        rs = await axios.get(ipfsMetadata)
                    } catch(e) {
                        console.log('Error retrieving metadata from IPFS', e)
                        reject(e)
                    }
                    const masterDataTokenAddr = event.returnValues.tokenAddress
                    const masterDTContract = new web3.eth.Contract(drizzle.contracts.MasterDataToken.abi, masterDataTokenAddr)
                    const dtName = await masterDTContract.methods.name().call()
                    const dtSymbol = await masterDTContract.methods.symbol().call()
                    
                    return {
                        daoAddress: event.returnValues.daoAddress,
                        ipfsMetadata: event.returnValues.ipfsMetadata.replace('ipfs://', 'https://ipfs.infura.io/ipfs/'),
                        metadata: rs && rs.status === 200 ? rs.data: undefined,
                        minDatatokenAllowance: event.returnValues.minDatatokenAllowance,
                        owner: event.returnValues.owner,
                        // templateAddress: event.returnValues.templateAddress,
                        tokenAddress: masterDataTokenAddr,
                        dataTokenMeta: {
                            name: dtName,
                            symbol: dtSymbol
                        }
                    }
                }))//.filter((e: any) => e.daoAddress != '0x' + '0'.repeat(40))
            }
            console.log('DAOS', daos)
            resolve(daos)
        })
    })
}

export const fetchContributions = async (masterDataTokenAddr: string, ocean: any, drizzle: any): Promise<Array<ContributionMeta>> => {
    return new Promise<Array<ContributionMeta>>((resolve, reject) => {
        const web3  = new Web3(HTTP_PROVIDER);
        const contract = new web3.eth.Contract(drizzle.contracts.MasterDataToken.abi, masterDataTokenAddr);
        contract.getPastEvents('ContributionAdded', {
            fromBlock: 7866667
        }, async (error: any, events: any) => {
            if (error) {
                reject(error)
            }
            let contributions: Array<ContributionMeta> = []
            if (events.length) {
                contributions = await Promise.all(events.map(async (event: any) => {
                    const ddo = await ocean.assets.resolveByDTAddress(event.returnValues.dataToken)
                    return {
                        contributor: event.returnValues.contributor,
                        dataToken: event.returnValues.dataToken,
                        records: event.returnValues.records,
                        ddo: ddo[0] as DDO
                    }
                }))
            }
            console.log('Contributions', contributions)
            resolve(contributions)
        })
    })
}

export const contribute = async (masterDataTokenAddr: string, 
                                dataTokenAddr: string, 
                                owner: string,
                                amountToMint: string,
                                totalRecords: string,
                                { drizzle, web3 }: {drizzle: any, web3: any}): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const toMint = web3.utils.toWei(amountToMint)
            const dataToken = new web3.eth.Contract(IERC20Template.abi, dataTokenAddr)
            let rs = await dataToken.methods.cap().call()
            console.log('Cap', rs)
            rs = await dataToken.methods.balanceOf(owner).call()
            console.log('balance', rs)
            rs = await dataToken.methods.minter().call()
            console.log('minter', rs)

            console.log('PARAMS', masterDataTokenAddr, dataTokenAddr, owner, amountToMint, totalRecords)

            let tx = await dataToken.methods.mint(owner, toMint).send({from: owner}).on('transactionHash', (txHash: string) => {
                const { emitter } = notify.hash(txHash)
                // emitter.on('txConfirmed', () => resolve(true))
                emitter.on('txCancel', () => resolve(false))
                emitter.on('txFailed', () => resolve(false))
            })
            console.log('Mint TX', tx)

            tx = await dataToken.methods.approve(masterDataTokenAddr, toMint).send({from: owner}).on('transactionHash', (txHash: string) => {
                const { emitter } = notify.hash(txHash)
                // emitter.on('txConfirmed', () => resolve(true))
                emitter.on('txCancel', () => resolve(false))
                emitter.on('txFailed', () => resolve(false))
            })
            console.log('Approve TX', tx)

            const masterDataToken = new web3.eth.Contract(drizzle.contracts.MasterDataToken.abi, masterDataTokenAddr)
            tx = await masterDataToken.methods.contribute(dataTokenAddr, totalRecords).send({from: owner}).on('transactionHash', (txHash: string) => {
                const { emitter } = notify.hash(txHash)
                emitter.on('txConfirmed', () => resolve(true))
                emitter.on('txCancel', () => resolve(false))
                emitter.on('txFailed', () => resolve(false))
            })
            console.log('Contribute TX', tx)

            resolve(true)
        } catch (e) {
            console.log('Error at contribute: ', e)
            reject(e)
        }
 
    })
}