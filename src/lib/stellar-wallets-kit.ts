import {
    StellarWalletsKit,
    Networks,
} from "@creit-tech/stellar-wallets-kit";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { FREIGHTER_ID as F_ID } from "@creit-tech/stellar-wallets-kit/modules/freighter";

let initialized = false;

export function initWalletKit() {
    if (initialized) return;

    StellarWalletsKit.init({
        network: Networks.TESTNET,
        // @ts-ignore - The type definition might be slightly off or string literal mismatch, but this is the ID
        selectedWalletId: F_ID,
        modules: defaultModules(),
    });

    initialized = true;
}
