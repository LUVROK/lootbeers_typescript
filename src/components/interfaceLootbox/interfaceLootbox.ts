import { PublicKey } from "@solana/web3.js";

export interface CustomizedState {
    picture: any,
    price: Array<number>,
    title: String,
    colors: Array<String>,
    win_variants: Array<Object>,
    lootboxAddress: String
};
export interface Props {
    onChange: Function;
    setColor: (value: string) => void;
    setActiveMenuElement: (value: Number) => void;
    picture: any;
    price: number;
    title: String;
    URLtitle: String;
    colors: Array<string>;
    text: Array<string>;
    win_variants: any;
    lootboxAddress: String;
};
export interface lates_your_loots_props {
    colors: Array<string>;
    setActiveMenuElement: (value: Number) => void;
    stateReloadInfo: Boolean;
    setdatefromState: (value: string) => void;
    setDateFormTextState: (value: string) => void;
    lootboxaddress: String;
    open_reclaimed: (value: PublicKey, i: string) => void;
    trigger: number;
}
export interface LeavesInterface {
    image1: string,
    image2: string,
    image3: string
}
export interface AlertState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
    hideDuration?: number | null;
};
export interface Loot {
    redeemResult: string;
    id: number;
    amount?: number
};
export interface LootYour {
    loot: Loot;
    lootboxAddress: string;
    redeemedAt: string;
    ticket: string;
};
export interface LootAll {
    loot: Loot;
    lootboxAddress: string;
    redeemedAt: string;
    user: string;
    ticket: string;
};
export interface OgChance {
    ogProb: number,
    spotsGiven: number
};
export interface RandomMainLootbox {
    id: number,
    text: string
};

