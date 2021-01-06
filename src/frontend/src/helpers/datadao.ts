import {
    DAOMigrationResult,
    getWeb3,
    DAOMigrationCallbacks,
    migrateDAO,
    getNetworkName,
  } from "@dorgtech/daocreator-lib-experimental";

export interface DataDAOInfo {
    daoInfo: DAOMigrationResult
    alchemyURI: string
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
    if (network === "mainnet") url = `https://alchemy.daostack.io/dao/${result.Avatar}`;
    else if (network === "rinkeby") url = `https://alchemy-staging-rinkeby.herokuapp.com/dao/${result.Avatar}`;
    else if (network === "xdai") url = `https://alchemy-staging-xdai.herokuapp.com/dao/${result.Avatar}`;
    else url = `/dao/${result.Avatar}`;
    console.log('alchemy URI', url)

    return {
        daoInfo: result,
        alchemyURI: url
    }
};