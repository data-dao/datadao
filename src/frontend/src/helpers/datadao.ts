import { DAOMigrationCallbacks, DAOMigrationResult, getNetworkName, getWeb3, migrateDAO } from "@dorgtech/daocreator-lib-experimental"
import axios from 'axios'
// comment in Arc1
import Notify from "bnc-notify"
import { HTTP_PROVIDER, NOTIFY_API_KEY } from 'config'
import ipfsClient from 'ipfs-http-client'
import Web3 from "web3"

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

export const fetchDataDaos = async (drizzle: any): Promise<Array<MasterDataTokenMeta>> => {
    return new Promise<Array<MasterDataTokenMeta>>((resolve, reject) => {
        const web3  = new Web3(HTTP_PROVIDER);
        const contract = new web3.eth.Contract(drizzle.contracts.MasterDataTokenFactory.abi, drizzle.contracts.MasterDataTokenFactory.address);
        contract.getPastEvents('MasterDataTokenCreated', {
            fromBlock: 7866667
        }, async (error: any, events: any) => {
            if (error) {
                reject(error)
            }        
            const daos: Array<MasterDataTokenMeta> = await Promise.all(events.map(async (event: any) => {
                const ipfsMetadata = event.returnValues.ipfsMetadata.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
                let rs;
                try {
                    rs = await axios.get(ipfsMetadata)
                } catch(e) {
                    console.log('Error retrieving metadata from IPFS', e)
                    reject(e)
                }
                return {
                    daoAddress: event.returnValues.daoAddress,
                    ipfsMetadata: event.returnValues.ipfsMetadata.replace('ipfs://', 'https://ipfs.infura.io/ipfs/'),
                    metadata: rs && rs.status === 200 ? rs.data: undefined,
                    minDatatokenAllowance: event.returnValues.minDatatokenAllowance,
                    owner: event.returnValues.owner,
                    // templateAddress: event.returnValues.templateAddress,
                    tokenAddress: event.returnValues.tokenAddress
                }
            }))//.filter((e: any) => e.daoAddress != '0x' + '0'.repeat(40))
            console.log('DAOS', daos)
            resolve(daos)
        })
    })
}