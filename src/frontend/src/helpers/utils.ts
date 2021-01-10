import { promisify } from "util";
import {
    Arc
  } from "@daostack/arc.js";
import { JsonRpcProvider } from "ethers/providers";
import { Signer } from "ethers";
import Web3 from 'web3'

import { NETWORK } from '../config';

export type Networks = "main" | "rinkeby" | "ganache" | "xdai" | "kovan";

/**
 * Get the network id to which the current build expects connect.
 * Note this doesn't belong in arc.ts else a circular module dependency is created.
 */
export function targetedNetwork(): Networks {
  switch (NETWORK) {
    case "test":
    case "ganache":
    case "private": {
      return "ganache";
    }
    case "rinkeby": {
      return "rinkeby";
    }
    case "kovan": {
      return "kovan";
    }
    case "main":
    case "mainnet":
    case undefined: {
      return "main";
    }
    case "xdai":
      return "xdai";
    default: {
      throw Error(`Unknown NETWORK: "${process.env.NETWORK}"`);
    }
  }
}

/**
 * return network id, independent of the presence of Arc
 * @param web3Provider
 */
export async function getNetworkId(web3Provider?: any): Promise<string> {
  if (web3Provider) {

    if ((web3Provider as any).networkVersion) {
      return (web3Provider as any).networkVersion;
    }
    else if (typeof web3Provider === "string") {
      const provider = new JsonRpcProvider(web3Provider);
      const network = await provider.getNetwork();
      return network.chainId.toString();
    } else if (Signer.isSigner(web3Provider)) {
      const network = await web3Provider.provider!.getNetwork();
      return network.chainId.toString();
    } else {
      const web3 = new Web3(web3Provider);
      return (await web3.eth.getChainId()).toString();
    }
  } else {
    let arc: Arc;

    try {
      arc = getArc();
      if (arc && arc.web3) {
        const network = await arc.web3.getNetwork();
        return network.chainId.toString();
      } else if ((window as any).web3) {
        const web3 = (window as any).web3;
        return (await (web3.eth.net ? web3.eth.net.getId() : promisify(web3.version.getNetwork)())).toString();
      } else {
        throw new Error("getNetworkId: unable to find web3");
      }
    } catch (ex) {
      // Do nothing
      throw new Error("getNetworkId: failed to load arc");
    }
  }
}

export async function getNetworkName(id?: string): Promise<Networks> {

    if (!id) {
      id = await getNetworkId();
    }
  
    if (typeof id !== "string") {
      id = "" + id;
    }
  
    switch (id) {
      case "main":
      case "0x1":
      case "1":
        return "main";
      // case "morden":
      // case "2":
      //   return "morden";
      // case "ropsten":
      // case "3":
      //   return "ropsten";
      case "rinkeby":
      case "4":
      case "0x4":
        return "rinkeby";
      case "xdai":
      case "0x64":
      case "100":
        return "xdai";
      case "kovan":
      case "0x2a":
      case "42":
        return "kovan";
      case "private":
      case "0x539":
      case "1512051714758":
        return "ganache";
      default:
        throw new Error(`unsupported network: ${id}`);
    }
  }

/**
 * define this here because importing arc.ts creates a cirular dependency
 */
export function getArc(): Arc {
  const arc = (window as any).arc as Arc;
  if (!arc) {
    throw Error("window.arc is not defined - please call initializeArc first");
  }
  return arc;
}
