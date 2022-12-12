import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export type Lootbox = {
    publicKey: PublicKey,
    bump: number,
    enabled: boolean,
    price: {
        amount: BN,
        mint: PublicKey | null
    },
    rewardIndex: number,
    rootConfigAddress: PublicKey
};

export type RootConfig = {
    fundsDestination: PublicKey,
    updateAuthority: PublicKey,
    rewardAuthority: PublicKey,
    lootboxIndex: number,
};

export type Reward = {
    publicKey: PublicKey,
    bump: number,
    lootboxAddress: PublicKey,
    reward: NoneReward | SolReward | TokenReward | NftReward
}

export type NoneReward = {
    TYPE: 'NONE'
}
export type SolReward = {
    TYPE: 'SOL',
    amount: BN
}
export type TokenReward = {
    TYPE: 'TOKEN'
    amount: BN,
    mint: PublicKey
}
export type NftReward = {
    TYPE: 'NFT'
}


