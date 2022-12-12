import { PublicKey } from "@solana/web3.js";
import useLootboxProgram from "./useLootboxProgram";

export default function useRootConfigFetcher() {

    const rootConfig = new PublicKey(process.env.REACT_APP_LOOTBOX_ROOT_CONFIG!);
    const program = useLootboxProgram();
    
    if (program == null) {
        return null;
    }

    return () => program.account.rootConfig.fetch(rootConfig);
}