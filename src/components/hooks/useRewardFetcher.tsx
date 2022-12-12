import { PublicKey } from "@solana/web3.js";
import useLootboxProgram from "./useLootboxProgram";

export default function useRewardFetcher() {

    const program = useLootboxProgram();

    if (program == null) {
        return null;
    }

    return (lootboxAddress: PublicKey) => program.account.rewardAccount.all(
        [{
            dataSize: 84
        }, {
            memcmp: {
                offset: 8,
                bytes: lootboxAddress.toBase58()
            }
        }]
    )
}