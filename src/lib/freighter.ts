import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
} from "@stellar/freighter-api";

export interface WalletInfo {
  publicKey: string;
  network: string;
}

export async function connectFreighter(): Promise<WalletInfo> {
  try {
    // Check if Freighter is installed
    const connected = await isConnected();
    if (!connected) {
      throw new Error("Freighter wallet is not installed or not connected.");
    }

    // Request access (popup approval)
    const access = await requestAccess();
    if (access.error) {
      throw new Error(access.error);
    }

    // Get public key
    const address = await getAddress();
    if (address.error) {
      throw new Error(address.error);
    }

    // Get network (TESTNET / PUBLIC)
    const network = await getNetwork();
    if (network.error) {
      throw new Error(network.error);
    }

    return {
      publicKey: address.address,
      network: network.network,
    };
  } catch (error) {
    console.error("Freighter connection failed:", error);
    throw error;
  }
}
