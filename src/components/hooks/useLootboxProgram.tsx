import { Program } from "@project-serum/anchor";
import { useMemo } from "react"
import { useAnchorProvider } from "../../provider/walletProvider"
import { IDL } from "../../types/lootbox_opener"

export default function useLootboxProgram() {

    const provider = useAnchorProvider();
    const program = useMemo(() => provider == null ? null : new Program(IDL, IDL.metadata.address, provider), [provider]);
    return program;
}