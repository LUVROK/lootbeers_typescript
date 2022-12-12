import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import useLootboxProgram from "./useLootboxProgram";

export default function useLootboxListFetcher() {

    const rootConfig = new PublicKey(process.env.REACT_APP_LOOTBOX_ROOT_CONFIG!);
    const program = useLootboxProgram();

    if (program == null) {
        return null;
    }

    return () => program.account.lootBox.all(
        [{
            dataSize: 84
        }, {
            memcmp: {
                bytes: rootConfig.toBase58(),
                offset: 8 + 3
            }
        }, {
            memcmp: {
                bytes: '2',
                offset: 8 + 2
            }
        }
        ])
}