import { Address, web3 } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { NftReward, NoneReward, RootConfig, SolReward, TokenReward } from "../types/app_types"

export const mapRewards = (rewards: any[]) => rewards.map(r => {

    const sol: any = r.account.reward.rewardType['solReward']
    const none: any = r.account.reward.rewardType['noneReward']
    const token: any = r.account.reward.rewardType['tokenReward']
    const nft: any = r.account.reward.rewardType['nftReward']

    let reward: NoneReward | SolReward | TokenReward | NftReward | null = null;

    if (sol) {
        reward = {
            TYPE: 'SOL',
            amount: sol.amount
        }
    } else if (none) {
        reward = {
            TYPE: 'NONE'
        }
    } else if (token) {
        reward = {
            TYPE: 'TOKEN',
            amount: token.amount,
            mint: token.mint
        }
    } else if (nft) {
        reward = {
            TYPE: 'NFT'
        }
    }

    return {
        publicKey: r.publicKey,
        bump: r.account.bump,
        lootboxAddress: r.account.lootboxAddress,
        reward: reward ?? { TYPE: 'NONE' }
    }
});

export interface BuyTicketAccounts {
    user: Address,
    ticket: Address,
    lootbox: Address,
    rootConfig: Address,
    fundsDestination: Address,
    systemProgram: Address
}

export async function getBuyTicketAccounts(rootConfig: RootConfig, lootbox: PublicKey, user: PublicKey): Promise<{accounts: BuyTicketAccounts, ticket: Keypair}> {
    
    const rootConfigAddress = new PublicKey(process.env.REACT_APP_LOOTBOX_ROOT_CONFIG!);
    const fundsDestination = rootConfig.fundsDestination;
    const ticket = new Keypair();

    return {
        accounts: {
            user,
            ticket: ticket.publicKey,
            lootbox,
            rootConfig: rootConfigAddress,
            fundsDestination,
            systemProgram: web3.SystemProgram.programId
        },
        ticket
    };
}

export interface TicketRedeemResponse {
    id: number
};

export async function redeemTicket(ticket: PublicKey): Promise<number> {
    
    const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;

    const response = await axios.post<TicketRedeemResponse>(`${apiUrl}/api/v1/ticket/redeem`, {
        ticketAddress: ticket.toBase58()
    });

    return response.data.id;
}