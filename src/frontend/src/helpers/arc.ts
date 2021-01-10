import { Address, Arc, Web3Provider } from '@daostack/arc.js'; // comment Web3Provider in Arc1
import { RetryLink } from "apollo-link-retry";
import { first } from "rxjs/operators";
import Web3 from 'web3'
import Web3Modal, { getProviderInfo, IProviderInfo } from 'web3modal'

import { settings } from '../config'
import { getNetworkId, getNetworkName, Networks, targetedNetwork } from './utils'

const MAX_BATCH_QUERY = 1000;
const ACCOUNT_STORAGEKEY = "currentAddress";

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    arcs: {[key: string]: Arc};
  }
}

/**
 * This is only set after the user has selected a provider and enabled an account.
 * It is like window.ethereum, but has not necessarily been injected as such.
 */
let selectedProvider: any;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
let web3Modal: Web3Modal;
let initializedAccount: Address;
window.arcs = window.arcs || {};


/**
 * extension of the Web3Modal IProviderInfo
 */
export interface IWeb3ProviderInfo extends IProviderInfo {

}

export interface IEnableWalletProviderParams {
  suppressNotifyOnSuccess?: boolean;
  showNotification: any;
}

export async function getProviderNetworkName(provider?: any): Promise<string | null> {
  provider = provider || selectedProvider;
  if (!provider) { return null; }
  const networkId = await getNetworkId(provider);
  return getNetworkName(networkId);
}

/**
 * Returns a IWeb3ProviderInfo when a provider has been selected and is fully available.
 * Does not know about the default read-only providers.
 */
export function getWeb3ProviderInfo(provider?: any): IWeb3ProviderInfo | null {
  provider = provider || selectedProvider;
  return provider ? getProviderInfo(provider) : null;
}

/**
 * Return currently-selected and fully-enabled web3Provider (an account can be presumed to exist).
 */
export function getWeb3Provider(): Web3Provider | undefined { // comment in Arc1
  // export function getWeb3Provider(): any | undefined {
  return selectedProvider;
}

/**
 * return the default Arc configuration given the execution environment
 */
// export function getArcSettings(): Settings {
export function getArcSettings(): any {
  const network = targetedNetwork();
  console.log('network', network)
  const arcSettings = settings[network];
  return arcSettings;
}

/**
 * Return the default account in current use by Arc1.
 */
async function _getCurrentAccountFromProvider(web3?: any): Promise<string | undefined> {
  const network = targetedNetwork();
  if (!web3) {
    return undefined;
  }
  const accounts = await web3.eth.getAccounts();
  return accounts[0] ? accounts[0].toLowerCase() : null;
}

/**
 * Return the default account in current use by Arc.
 */
async function _getCurrentAccountFromArc(arc?: Arc): Promise<string | undefined> {
  arc = arc ?? (window as any).arc as Arc;
  if (!arc) {
    return undefined;
  }
  //@ts-ignore
  return await arc.getAccount().pipe(first()).toPromise();
}

/**
 * Checks if the web3 provider is set to the required network.
 * Does not ensure we have access to the user's account.
 * throws an Error if no provider or wrong provider
 * @param provider web3Provider
 * @return the expected network nameif not correct
*/
async function ensureCorrectNetwork(provider: any): Promise<void> {

  /**
   * It is required that the provider be the correct one for the current platform
   */
  // const expectedNetworkNames = network?[network]: targetNetworks();
  const expectedNetworkName = targetedNetwork();

  // TODO: we should not use the network NAME but the network ID to identify the network...
  const networkName = await getProviderNetworkName(provider);

  if (networkName !== expectedNetworkName) {
    if (expectedNetworkName === "xdai") {
      // TODO: xdai is reporting network 'unknown (100)` , it seems
      if (networkName === "unknown (100)") {
        // we are fine, mayby
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.error(`connected to the wrong network, should be ${expectedNetworkName} (instead of "${networkName}")`);
    throw new Error(`Please connect your wallet provider to ${expectedNetworkName}`);
  }
}

/**
 * Prompt user to select a web3Provider and enable their account.
 * Initializes Arc with the newly-selected web3Provider.
 * No-op if `selectedProvider` is already set (one can manually go to readonly mode to clear it)
 * Side-effect is that `selectedProvider` will be set on success.
 * @returns Throws exception on error.
 */
async function enableWeb3Provider(): Promise<void> {
    if (selectedProvider) {
      return;
    }
  
    let provider: Web3Provider | undefined = undefined; // comment in Arc1
    // let provider: any = undefined;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    let _web3Modal: Web3ConnectModal;
  
    if (!web3Modal) {
      _web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: Object.assign(
          /**
           * This will hide the web3connect fallback ("Web3") button which currently
           * doesn't behave well when there is no available extension.  The fallback is
           * apparently "for injected providers that haven't been added to the library or
           * that don't support the normal specification. Opera is an example of it."
           */
          { disableInjectedProvider: !((window as any).web3 || (window as any).ethereum) },
          getArcSettings().web3ConnectProviderOptions) as any,
      });
  
      // eslint-disable-next-line require-atomic-updates
      web3Modal = _web3Modal;
    } else {
      _web3Modal = web3Modal;
    }
  
    let resolveOnClosePromise: () => void;
    let rejectOnClosePromise: (reason?: any) => void;
  
    const onClosePromise = new Promise(
      (resolve: () => void, reject: (reason?: any) => void): any => {
        resolveOnClosePromise = resolve;
        rejectOnClosePromise = reject;
        _web3Modal.on("close", (): any => {
          return resolve();
        });
      });
  
    _web3Modal.on("error", (error: Error): any => {
      // eslint-disable-next-line no-console
      console.error(`web3Connect closed on error:  ${error ? error.message : "cancelled or unknown error"}`);
      return rejectOnClosePromise(error);
    });
  
    _web3Modal.on("connect", (newProvider: any): any => {
      provider = newProvider;
      /**
       * Because we won't receive the "close" event in this case, even though
       * the window will have closed
       */
      return resolveOnClosePromise();
    });
  
    try {
      // note this will load from its cache, if present
      _web3Modal.toggleModal();
      // assuming reject will result in a throw exception caught below
      await onClosePromise;
  
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Unable to connect to web3 provider:  ${error ? error.message : "unknown error"}`);
      throw new Error("Unable to connect to web3 provider");
    }
  
    if (!provider) {
      // should only be cancelled, errors should have been handled above
      // eslint-disable-next-line no-console
      console.warn("uncaught error or user cancelled out");
      return;
    }
  
    /**
     * bail if provider is not correct for the current platform
     */
    await ensureCorrectNetwork(provider);
  
    /**
   * now ensure that the user has connected to a network and enabled access to the account,
   * whatever the provider requires....
   */
    try {
    // brings up the provider UI as needed
      if ((provider as any).enable) {
        await (provider as any).enable();
      }
      const providerInfo = getWeb3ProviderInfo(provider)
      // eslint-disable-next-line no-console
      console.log(`Connected to network provider ${providerInfo ? providerInfo.name:'no provider'}`);
    } catch (ex) {
    // eslint-disable-next-line no-console
      console.error(`Unable to enable provider: ${ex.message ? ex : "unknown error"}`);
      throw new Error("Unable to enable provider");
    }
  
    // if (!await initializeArc(await getNetworkName(provider.chainId), provider)) {
    if (!await initializeArc(provider)) {
    // eslint-disable-next-line no-console
      console.error("Unable to initialize Arc");
      throw new Error("Unable to initialize Arc");
    }
  
    // eslint-disable-next-line require-atomic-updates
    selectedProvider = provider;
    const p = new Web3(selectedProvider);
}

export function getCachedAccount(): Address | null {
  return localStorage.getItem(ACCOUNT_STORAGEKEY);
}

export function cacheWeb3Info(account: Address): void {
  if (account) {
    localStorage.setItem(ACCOUNT_STORAGEKEY, account);
  } else {
    localStorage.removeItem(ACCOUNT_STORAGEKEY);
  }
}

export function uncacheWeb3Info(accountToo = true): void {
  if (accountToo) {
    localStorage.removeItem(ACCOUNT_STORAGEKEY);
  }
  if (web3Modal) {
    web3Modal.clearCachedProvider();
  }
  /**
     * close is not yet a standard, but soon will be.
     * Sadly closing the connection is the only way to clear the WalletConnect cache.
     * But clearing its cache will ensure that
     * the user can rescan a qrcode when changing WalletConnect provider.
     */
  if (selectedProvider && selectedProvider.close) {
    selectedProvider.close(); // no need to await
  }
}

/**
 * Load web3 wallet provider, first trying from cache, otherwise prompting.
 * This is the only point of contact with the rest of the app for connecting to a wallet.
 * App.tsx invokes `initializeArc` on startup just to get a readonly web3.
 * @param options `IEnableWWalletProviderParams`
 * @returns Promise of true on success
 */
export async function enableWalletProvider(options: IEnableWalletProviderParams): Promise<boolean> {
  try {

    /**
     * If not MetaMask or other injected web3 and on ganache then try to connect to local ganache directly.
     * Note we're going to ignore any injected web3 in favor of using our own preferred version of Web3.
     */
    if (!selectedProvider && (targetedNetwork() === "ganache" && !(window as any).ethereum)) {
      selectedProvider = new Web3(settings.ganache.web3Provider as string);
      return true;
    }

    if (!selectedProvider) {
      await enableWeb3Provider();
      if (!selectedProvider) {
        // something went wrong somewhere
        throw new Error("Unable to connect to a wallet");
      }
      /**
       * notify on success
       */
      if (!options.suppressNotifyOnSuccess && options.showNotification) {
        const web3ProviderInfo = getWeb3ProviderInfo();
        // options.showNotification(NotificationStatus.Success, `Connected to ${web3ProviderInfo ? web3ProviderInfo.name:'no-provider'}`);
      }
    } else {
      /**
       * Bail if provider is not correct for the current platform. The user might have redirected
       * Metamask to a different network without us knowing.  Just in that case, check here.
       */
      try {
        await ensureCorrectNetwork(selectedProvider);
      } catch (ex) {
        throw new Error(ex);
      }
    }

  } catch (err) {
    let msg: string;
    msg = err ? err.message : "Unable to connect to the ethereum provider";
    if (msg.match(/response has no error or result for request/g)) {
      msg = "Unable to connect to ethereum provider, sorry :-(";
    }

    uncacheWeb3Info(false);

    if (options.showNotification) {
      // options.showNotification(NotificationStatus.Failure, msg);
    } else {
      alert(msg);
    }
    return false;
  }
  return true;
}

/**
 * initialize Arc.  Does not throw exceptions, returns boolean success.
 * @param provider Optional web3Provider
 */
// export async function initializeArc(network: Networks, provider?: any): Promise<boolean> {
  export async function initializeArc(provider?: any): Promise<boolean> {
  let success = false;
  // let arc: any;
  let arc = (window as any).arc as Arc;

  try {
    const arcSettings = getArcSettings();

    if (!provider) {
      provider = arcSettings.web3Provider;
    }

    const readonly = typeof provider === "string";

    // https://www.apollographql.com/docs/link/links/retry/
    const retryLink = new RetryLink({
      attempts: (count) => {
        return (count !== 10);
      },
      delay: () => {
        // This will give a random delay between retries between the range of 5 to 30 seconds.
        return Math.floor(Math.random() * (30000 - 5000 + 1) + 5000);
      },
    });

    arcSettings.retryLink = retryLink;

    if (arc) {
      arc.setWeb3(provider); // comment in Arc1
      // arc.web3 = new Web3(provider);
    } else {
      arc = new Arc(arcSettings);
    }
    arc.web3!.pollingInterval = 60000;

    let contractInfos;

    try {
      contractInfos = await arc.fetchContractInfos();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching contractinfos: ${err.message}`);
    }

    success = !!contractInfos;
    console.log('success?', success)

    if (success) {
      const account = await _getCurrentAccountFromArc(arc); // comment in Arc1
      // const account = await _getCurrentAccountFromProvider(arc.web3)
      console.log('account', account)

      if (!account || account === "0x0000000000000000000000000000000000000000") {
      // then something went wrong
      // eslint-disable-next-line no-console
        console.error(`Unable to obtain an account from arc`);
      } else {
        initializedAccount = account
      }
    }

    if (success) {
      /* Arc1
      provider = arc.web3.currentProvider; // won't be a string, but the actual provider
      // save for future reference
      // eslint-disable-next-line require-atomic-updates
      provider.__networkId = await getNetworkId(provider);
      */
      if ((window as any).ethereum) {
        // if this is metamask this should prevent a browser refresh when the network changes
        (window as any).ethereum.autoRefreshOnNetworkChange = false;
      }

      const network = await arc.web3!.getNetwork(); // comment in Arc1
      const networkName = await getNetworkName(network.chainId.toString()); // comment in Arc1
      // const networkName = await getNetworkName(provider.__networkId);
      // eslint-disable-next-line no-console
      console.log(`Connected Arc to ${networkName}${readonly ? " (readonly)" : ""} `);
    }
  } catch (reason) {
    // eslint-disable-next-line no-console
    console.error(reason ? reason.message : "unknown error");
  }

  (window as any).arc = success ? arc : null;
  cacheWeb3Info(initializedAccount);

  return success;
}