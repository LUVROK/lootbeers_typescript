import '../App.css';
import '../fonts/fonts.css';
import React, { useEffect, useState, useRef, FC, createRef } from 'react';
import { useLocation } from "react-router-dom";
import $ from 'jquery';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Link } from 'react-router-dom';
import LogoImg from '../media/logo1.webp';
import JSConfetti from 'js-confetti';
import '../animation.css';
import useLootboxProgram from './hooks/useLootboxProgram';
import useRootConfigFetcher from './hooks/useRootConfigFetcher';
import { RootConfig } from '../types/app_types';
import { getBuyTicketAccounts, redeemTicket } from '../util';
import { useWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import solanapng from '../media/solanapng.webp'
import Alert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import './loader.scss';
import ScrollBar from 'smooth-scrollbar';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from 'axios';
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { OG_win_variants, OG_win_variants2 } from '../win_variants';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import './timer.scss';
import lootboxanimation from '../media/ezgif-3-cbc77fa118.gif';

import ticket2_1 from '../media/ticket2_1.webp';
import ticket2_2 from '../media/ticket2_2.webp';
import ticket2_3 from '../media/ticket2_3.webp';

import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'

// declare global {
//     interface Window { phantom: any; }
// }

interface CustomizedState {
    picture: any,
    price: Array<number>,
    title: String,
    colors: Array<String>,
    win_variants: Array<Object>,
    lootboxAddress: String
}

interface Props {
    onChange: Function;
    setColor: (value: string) => void;
    setActiveMenuElement: (value: Number) => void;
}

interface AlertState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
    hideDuration?: number | null;
}

interface Loot {
    redeemResult: string;
    id: number;
}

interface LootYour {
    loot: Loot;
    lootboxAddress: string;
    redeemedAt: string;
    ticket: string;
}

interface LootAll {
    loot: Loot;
    lootboxAddress: string;
    redeemedAt: string;
    user: string;
}

interface OgChance {
    ogProb: number,
    spotsGiven: number
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Timer2 = ({ deadline = new Date().toString() }) => {
    const parsedDeadline = React.useMemo(() => Date.parse(deadline), [deadline]);
    const [time, setTime] = React.useState(parsedDeadline - Date.now());

    React.useEffect(() => {
        const interval = setInterval(
            () => setTime(parsedDeadline - Date.now()),
            1000,
        );
        return () => clearInterval(interval);
    }, [parsedDeadline]);

    //s: (time / SECOND) % 60,
    return (
        <div className="timerMini">
            {
                time / DAY >= 0 && (time / HOUR) % 24 >= 0 && (time / MINUTE) % 60 >= 0 && (time / SECOND) % 60 >= 0 ?
                    Object.entries({
                        d: time / DAY,
                        h: (time / HOUR) % 24,
                        m: (time / MINUTE) % 60,
                        s: (time / SECOND) % 60
                    }).map(([label, value]) => (
                        <div key={label} className="Timer_boxMini">
                            <div className="boxMini" role="timerMini" aria-atomic="true">
                                {
                                    label === 's' ? <p className="Timer_box_text_s_Mini">{`${Math.floor(value)}`.padStart(2, "0")}</p>
                                        : label === 'm' ? <p className="Timer_box_text_m_Mini">{`${Math.floor(value)}`.padStart(2, "0")}:</p>
                                            : label === 'h' ? <p className="Timer_box_text_h_Mini">{`${Math.floor(value)}`.padStart(2, "0")}:</p>
                                                : label === 'd' ? <p className="Timer_box_text_d_Mini" style={{ display: 'none' }}>{`${Math.floor(value)}`.padStart(2, "0")}:</p>
                                                    : <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
                                }
                            </div>
                        </div>
                    ))
                    :
                    <div>

                    </div>
            }

        </div>
    );
};

const LootboxComponent: FC<Props> = ({ onChange, setColor, setActiveMenuElement }) => {

    const rootConfigFetcher = useRootConfigFetcher();
    const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;
    const [rootConfig, setRootConfig] = useState<RootConfig | null>();
    const [textState, setTextState] = useState<String>('');
    const [textState_About, settextState_About] = useState<String>('');
    const { publicKey, signMessage, signTransaction } = useWallet();
    const wallet = useAnchorWallet();
    // const { connection } = useConnection();
    const [dataStat, setDataStat] = useState<Array<Object>>();
    const [mylootsactiveElement, setMyLootsActiveElement] = useState<Number>(2);
    const [answer, setAnswer] = useState('');

    const [responseStatNumber, setResponseStatNumber] = useState<number>();
    const [timeoutID, setTimeoutID] = useState<any>()

    const [timeoutFuck, setTimeoutFuck] = useState<string>()

    const [alertState, setAlertState] = useState<AlertState>({
        open: false,
        message: '',
        severity: undefined
    });

    TimeAgo.setDefaultLocale(en.locale);
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
        // async function call() {
        //     if (rootConfigFetcher && !rootConfig) {
        //         setRootConfig(await rootConfigFetcher());
        //     }
        // }
        // call();

        setColor(`${colors[1]}`);

        const footer = document.querySelector('.footer');
        if (footer !== null) { (footer as HTMLElement).style.display = 'none'; (footer as HTMLElement).style.position = 'absolute' }

    }, [rootConfigFetcher]);

    const send = async () => {
        try {
            if (publicKey != null) {
                const solana = new Connection("https://clean-fragrant-scion.solana-mainnet.discover.quiknode.pro/7c6be677f6c5a289bc3b743f956405cf2a63a485/");

                let balance = await solana.getBalance(publicKey, 'confirmed');
                onChange(balance / LAMPORTS_PER_SOL);

                // console.log(balance / LAMPORTS_PER_SOL);
            }
        }
        catch (e) {

        }
    }

    const location = useLocation();
    const state = location.state as CustomizedState;
    const { price, picture, title, colors, win_variants, lootboxAddress } = state;
    const [priceState, setPriceState] = useState(price[0]);
    const [value2, setValue2] = useState('');
    // const network = WalletAdapterNetwork.Mainnet;
    const jsConfetti = new JSConfetti();
    const program = useLootboxProgram();
    const [textOpen, setTextOpen] = useState<String>(`OPEN ${price} SOL`);
    const scrollerRef = createRef<HTMLDivElement>();
    const scrollerRef2 = createRef<HTMLDivElement>();

    const [dataGetResultYourLoots, setdataGetResultYourLoots] = useState<Array<LootYour>>();
    const [dataGetAllLoots, setdataGetAllLoots] = useState<Array<LootAll>>();
    const [dataGetOgChance, setdataGetOgChance] = useState<OgChance>();
    const [DateFrom, setdatefrom] = useState<string>('');

    const spinNymber2 = useRef<Number | null>(null);

    const [dateFormText, setDateFormText] = useState('');

    const [imageStatecong, setImageStateCong] = useState<number>(2);

    const [closeBlock, setCloseBlock] = useState<Boolean>(false);

    useEffect(() => {
        setActiveMenuElement(0);

        // gsap.registerPlugin(ScrollTrigger);
        // let bodyScrollBar: any;

        // const scroller: HTMLElement | null = document.querySelector(".scroller");

        // if (scroller !== null) {
        //     bodyScrollBar = ScrollBar.init(scroller);
        // }

        // ScrollTrigger.scrollerProxy(scroller, {
        //     scrollTop(value) {
        //         if (arguments.length) {
        //             bodyScrollBar.scrollTop = value;
        //         }
        //         return bodyScrollBar.scrollTop;
        //     }
        // });
        // bodyScrollBar.addListener(ScrollTrigger.update);


        const MenuElementFocus = document.getElementById('menu');
        const checkbox = document.getElementById('checkbox');
        const LootboxComponent = document.querySelector('.LootboxComponent');

        // console.log((checkbox as HTMLInputElement).checked)

        if (MenuElementFocus !== null && LootboxComponent !== null && checkbox !== null) {
            LootboxComponent.addEventListener('click', (e) => {
                // console.log((checkbox as HTMLInputElement).checked)
                const withinBoundaries = e.composedPath().includes(MenuElementFocus);
                if (!withinBoundaries) {
                    //   console.log((checkbox as HTMLInputElement).checked)
                    if ((checkbox as HTMLInputElement).checked === true) {
                        (checkbox as HTMLInputElement).checked = false;
                    }
                }
            });
            checkbox.addEventListener('click', (e) => {
                const withinBoundaries = e.composedPath().includes(MenuElementFocus);
                if (!withinBoundaries) {
                    //   console.log((checkbox as HTMLInputElement).checked)
                }
            })
        }

        document.querySelectorAll('.typeLootBox_block')[0].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[0].classList.add('active');
            document.querySelectorAll('.typeLootBox_block')[1].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.remove('active');
        })
        document.querySelectorAll('.typeLootBox_block')[1].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[1].classList.add('active');
            document.querySelectorAll('.typeLootBox_block')[0].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.remove('active');
        })
        document.querySelectorAll('.typeLootBox_block')[2].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[0].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[1].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.add('active');
        })

        initWheel2();

        function initWheel2() {
            var $wheel = $('.roulette-wrapper2 .wheel2'),
                row = "";
            row += "<div class='row'>";
            for (let i = 0; i < win_variants.length; i++) {
                if (Object.values(win_variants[i])[1].toString() === '0X' || Object.values(win_variants[i])[1].toString() === '0.5X' || Object.values(win_variants[i])[1].toString() === '1X' || Object.values(win_variants[i])[1].toString() === '2X' || Object.values(win_variants[i])[1].toString() === '5X' || Object.values(win_variants[i])[1].toString() === '15X' || Object.values(win_variants[i])[1].toString() === '30X' || Object.values(win_variants[i])[1].toString() === '60X' || Object.values(win_variants[i])[1].toString() === '120X') {
                    // console.log(Object.values(win_variants[i])[1].toString())
                    row += `  <div class='element2' id='${Object.values(win_variants[i])[1].toString()}'><img src=${solanapng} alt='' class="element2_img"/><div>${Object.values(win_variants[i])[1].toString()}</div><\/div>`;
                    // row += `  <div class='element2 red'>${Object.values(win_variants[i])[1].toString()}<\/div>`;
                }
                else if (Object.values(win_variants[i])[1].toString() === 'FREE MINT') {
                    // console.log(Object.values(win_variants[i])[1].toString())
                    row += `  <div class='element2' id='${Object.values(win_variants[i])[1].toString()}'><img src=${ticket2_1} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
                }
                else if (Object.values(win_variants[i])[1].toString() === 'OG RULE') {
                    // console.log(Object.values(win_variants[i])[1].toString())
                    row += `  <div class='element2' id='${Object.values(win_variants[i])[1].toString()}'><img src=${ticket2_2} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
                }
                else if (Object.values(win_variants[i])[1].toString() === 'NOTHING') {
                    // console.log(Object.values(win_variants[i])[1].toString())
                    row += `  <div class='element2' id='${Object.values(win_variants[i])[1].toString()}'><img src=${ticket2_3} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
                }
                else {
                    // console.log(Object.values(win_variants[i])[1].toString())
                    row += `  <div class='element2' id='${Object.values(win_variants[i])[1].toString()}'><div>${Object.values(win_variants[i])[1].toString()}</div><\/div>`;
                }

                // lazy-load-image-background blur lazy-load-image-loaded
                // row += `  <div class='element2 red'>${Object.values(win_variants[i])[1].toString()}<\/div>`;

            }
            row += "<\/div>";
            // console.log(row)

            if (title === 'OG LOOTBOX') {
                for (var x = 0; x < 29; x++) {
                    $wheel.append(row);
                }
            }
            else {
                for (var x = 0; x < 29; x++) {
                    $wheel.append(row);
                }
            }
        }

        if (title === 'OG LOOTBOX') {
            setTextOpen(`FREE`);
        }

        if (document.body.clientWidth <= 734) {
            setMyLootsActiveElement(0);
        }

        const elements2 = document.querySelectorAll('.imageLootbeers');
        if (elements2 !== null) {
            for (let i = 0; i < elements2.length; i++) {
                elements2[i].addEventListener('load', function() {
                    (elements2[i] as HTMLElement).style.height = 'auto';
                })
            }
        }
    }, [])

    useEffect(() => {
        send();
        getYourLoots();
        getAllLoots();
        getOgChance();
        // const el = document.getElementById("buttonSpin2");
        // if (el !== null && publicKey !== null) { el.style.pointerEvents = 'all' };
    }, [wallet])

    const getOgChance = async () => {
        try {
            if (publicKey !== null) {
                let mass = [];
                const res = await axios.get<OgChance>(`${apiUrl}/api/v1/status/ogChance`, {})
                // console.log(res)
                setdataGetOgChance(res.data);
            }
        }
        catch (e) {

        }
    }

    const getYourLoots = async () => {
        try {
            if (publicKey !== null) {
                let mass = [];
                const res = await axios.get<LootYour[]>(`${apiUrl}/api/v1/ticket/recentLoots?count=10&wallet=${publicKey.toBase58()}`, {})
                // [{"loot":{"redeemResult":"NONE","id":2},"lootboxAddress":"ogtoah5LB7pry5YPK9LVZyN3ZzMVZPxFmLwj3BYyPg1","redeemedAt":"2022-10-09T16:52:22.983513Z"}]
                // console.log(res)
                for (let i = 0; i < res.data.length; i++) {
                    // console.log(res.data[i].redeemedAt)
                    // console.log(res.data[i].loot.redeemResult)
                    mass.push(res.data[i]);
                }
                // console.log(res.data[0].redeemedAt)
                // console.log(res.data[0].redeemedAt.slice(0, -1))

                const date1 = new Date(res.data[0].redeemedAt);
                // console.log(date1)
                // console.log(date1.toUTCString())
                // const date2 = new Date(res.data[0].redeemedAt.slice(0, -1)).toUTCString();;
                // console.log(date2)
                const utcStr = new Date().toUTCString();
                // const utcStr2 = new Date();

                date1.setHours(date1.getHours() + 6);
                // console.log(utcStr);
                // console.log(date1.toUTCString());

                setdatefrom(date1.toUTCString());
                setDateFormText('Loading...');


                // console.log('------')
                // console.log(date1.getUTCHours())
                // console.log(date1.getUTCMinutes())
                // console.log(date1.getUTCSeconds())


                setdataGetResultYourLoots(mass);
                const el = document.querySelector('.tweetAboutItforpeoplewhoaccidentallyclosedthewinwindow');
                if (el !== null) {
                    (el as HTMLElement).style.pointerEvents = 'all';
                }
                // console.log(res.data[0].loot)
            }
        }
        catch (e) {
            setDateFormText('');
            setdatefrom('');
        }
    }

    const getAllLoots = async () => {
        if (publicKey !== null) {
            let mass = [];
            const res = await axios.get<LootAll[]>(`${apiUrl}/api/v1/ticket/recentLoots?count=10`, {})
            // [{"loot":{"redeemResult":"NONE","id":2},"lootboxAddress":"ogtoah5LB7pry5YPK9LVZyN3ZzMVZPxFmLwj3BYyPg1","redeemedAt":"2022-10-09T16:52:22.983513Z"}]
            for (let i = 0; i < res.data.length; i++) {
                // console.log(res.data[i])
                // console.log(res.data[i].loot.redeemResult)
                mass.push(res.data[i]);
                // console.log(new Date(res.data[i].redeemedAt).toLocaleTimeString())

                const date1 = new Date(res.data[i].redeemedAt);
                const utcStr = new Date().toUTCString();
                // date1.setHours(date1.getHours() + 6);
                // console.log(new Date(res.data[i].redeemedAt).toLocaleString());
            }
            setdataGetAllLoots(mass);

            // console.log(res)
        }
    }

    function getRandomArrayElement(arr: Array<number>) {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    const spinClick = async () => {
        try {

            if (!wallet) {
                setAlertState({
                    open: true,
                    message: 'Connect your wallet and sign the approval message',
                    severity: 'error'
                });
                return;
            }

            const el5 = document.getElementById("buttonSpin2");
            if (el5 !== null) {
                el5.style.pointerEvents = 'none';
            }

            const redult = await logMemo(`Lootbeers wants you to sign this transaction with your Solana account: ${publicKey?.toBase58()}

Click "Sign" or "Approve" only means you have proved you are owner of this wallet.

This exact Loot Box is functioning off-chain, which means this request will not trigger any transaction or cost you anything.
Click approve if you are real OG mfer and good luck to you! 

If you read through this, fuck... Why are you still here, open the damn box
            `);

            const lds_roller = document.querySelector('.loaderOpen');
            setTextOpen('');
            if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'block' }

            if (typeof (redult) === 'string') {
                if (price.toString() === '0') {
                    try {
                        const res = await axios.post(`${apiUrl}/api/v1/ticket/redeem`, {
                            ticketAddress: 'ogtoah5LB7pry5YPK9LVZyN3ZzMVZPxFmLwj3BYyPg1',
                            wallet: publicKey?.toBase58()
                        })

                        setTextOpen(`FREE`);
                        if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'none' }

                        setAlertState({
                            open: true,
                            message: 'Successful transaction',
                            severity: 'success'
                        });

                        const Array1: Array<number> = [1, 3, 5, 7, 9, 11, 13, 15]
                        const Array2: Array<number> = [2, 4, 6, 8, 10, 12, 14, 16, 17]
                        const Array3: Array<number> = [0, 1, 2]
                        let rendomNum: number;

                        // let rendomNum2 = await getRandomArrayElement(Array3);

                        // setResponseStatNumber(rendomNum2);
                        // setImageStateCong(rendomNum2);

                        // if (Number(rendomNum2) === 0) {
                        //     rendomNum = 0;
                        //     spinWheel3(rendomNum, rendomNum2);
                        //     settextState_About('Open the ticket in the Discord to claim your prize! Valid for 24 hours');
                        //     setTextState(`${OG_win_variants2[rendomNum].text}`);
                        //     setTimeout(() => {
                        //         if (el5 !== null) { el5.style.pointerEvents = 'all' };
                        //     }, 2000);
                        // }
                        // else if (Number(rendomNum2) === 1) {
                        //     rendomNum = await getRandomArrayElement(Array1);
                        //     spinWheel3(rendomNum, rendomNum2);
                        //     settextState_About('Open the ticket in the Discord to claim your prize! Valid for 24 hours');
                        //     setTextState(`${OG_win_variants2[rendomNum].text}`);
                        //     setTimeout(() => {
                        //         if (el5 !== null) { el5.style.pointerEvents = 'all' };
                        //     }, 2000);
                        // }
                        // else if (Number(rendomNum2) === 2) {
                        //     rendomNum = await getRandomArrayElement(Array2);
                        //     spinWheel3(rendomNum, rendomNum2);
                        //     settextState_About('');
                        //     setTextState(`${OG_win_variants2[rendomNum].text}`);
                        //     setTimeout(() => {
                        //         if (el5 !== null) { el5.style.pointerEvents = 'all' };
                        //     }, 2000);
                        // }

                        if (res.data.id && res.data.id !== null && res.data.id !== undefined) {

                            setResponseStatNumber(res.data.id);
                            setImageStateCong(res.data.id);

                            if (Number(res.data.id) === 0) {
                                rendomNum = 0;
                                spinWheel3(rendomNum, res.data.id);
                                settextState_About('Open the ticket in the Discord to claim your prize! Valid for 24 hours');
                                setTextState(`${OG_win_variants2[rendomNum].text}`);
                                setTimeout(() => {
                                    if (el5 !== null) { el5.style.pointerEvents = 'all' };
                                }, 2000);
                            }
                            else if (Number(res.data.id) === 1) {
                                rendomNum = await getRandomArrayElement(Array1);
                                spinWheel3(rendomNum, res.data.id);
                                settextState_About('Open the ticket in the Discord to claim your prize! Valid for 24 hours');
                                setTextState(`${OG_win_variants2[rendomNum].text}`);
                                setTimeout(() => {
                                    if (el5 !== null) { el5.style.pointerEvents = 'all' };
                                }, 2000);
                            }
                            else if (Number(res.data.id) === 2) {
                                rendomNum = await getRandomArrayElement(Array2);
                                spinWheel3(rendomNum, res.data.id);
                                settextState_About('');
                                setTextState(`${OG_win_variants2[rendomNum].text}`);
                                setTimeout(() => {
                                    if (el5 !== null) { el5.style.pointerEvents = 'all' };
                                }, 2000);
                            }
                        }
                        else {
                            setAlertState({
                                open: true,
                                message: "Something went wrong",
                                severity: 'error'
                            });
                        }
                    }
                    catch (e: any) {
                        console.log(e);
                        // console.log(OG_win_variants[1].text)

                        if (e.response as any !== undefined) {

                            switch (e.response.data.title) {
                                case 'LOOTBOX_TIMEOUT':
                                    setAlertState({
                                        open: true,
                                        message: "Free OG Loot Box is available every 6 hours",
                                        severity: 'info'
                                    });
                                    break;

                                case 'INSUFFICIENT_FUNDS':
                                    setAlertState({
                                        open: true,
                                        message: "You need to have at least 0.01 solana on your account",
                                        severity: 'info'
                                    });
                                    break;

                                case 'LOOTBOX_NOT_FOUND':
                                    setAlertState({
                                        open: true,
                                        message: "LOOTBOX_NOT_FOUND",
                                        severity: 'info'
                                    });
                                    break;

                                default:
                                    setAlertState({
                                        open: true,
                                        message: "The problem is on the server, contact us",
                                        severity: 'error'
                                    });
                                    break;
                            }

                            if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'none' }
                            setTextOpen(`FREE`);

                            setTimeout(() => {
                                if (el5 !== null) { el5.style.pointerEvents = 'all' };
                            }, 2000)

                        }
                    }
                    return;
                }
            }
            else {
                return;
            }

            const pk = new PublicKey(lootboxAddress);

            if (!program || !rootConfig) {
                setAlertState({
                    open: true,
                    message: "A small problem, try again by reloading the page or deleting cookies",
                    severity: 'error'
                });
                return;
            }
            const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);

            setTextOpen('');

            if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'block' }

            const el = document.getElementById("buttonSpin2");
            if (el !== null) {
                el.style.pointerEvents = 'none';
            }

            // try {
            const id = await program.methods
                .buyLootboxTicket()
                .accountsStrict({
                    ...accounts.accounts
                })
                .signers([accounts.ticket])
                .rpc();
            await new Promise(resolve => setTimeout(resolve, 1000));

            send();
            getYourLoots();
            getAllLoots();
            getOgChance();

            const i = await redeemTicket(accounts.ticket.publicKey);

            if (typeof (i) === 'number') {
                spinNymber2.current = i;
                setValue2(i.toString());
                setTextState(Object.values(win_variants[i])[1].toString());
                if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'none' }
                setTextOpen(`OPEN ${price} SOL`);
                setAlertState({
                    open: true,
                    message: 'Successful transaction',
                    severity: 'success'
                });
                spinWheel2(Number(i));
            }
            else {
                if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'none' }
                setTextOpen(`OPEN ${price} SOL`);
                setAlertState({
                    open: true,
                    message: 'Failed to get a prize, check your prize history',
                    severity: 'error'
                });
                if (el !== null) { el.style.pointerEvents = 'all' };
            }
            setTimeout(() => {
                if (el !== null) { el.style.pointerEvents = 'all' };
                send();
                getYourLoots();
                getAllLoots();
                getOgChance();
            }, 10000)

        }
        catch (e: any) {

            console.log(e)

            try {
                if (e.response.data.title) {
                    switch (e.response.data.title) {
                        case 'TICKET_NOT_REDEEMED':
                            setAlertState({
                                open: true,
                                message: "TICKET_NOT_REDEEMED",
                                severity: 'error'
                            });
                            break;

                        case 'BAD_TICKET_DATA':
                            setAlertState({
                                open: true,
                                message: "BAD_TICKET_DATA",
                                severity: 'error'
                            });
                            break;

                        case 'LOOTBOX_NOT_FOUND':
                            setAlertState({
                                open: true,
                                message: "LOOTBOX_NOT_FOUND",
                                severity: 'error'
                            });
                            break;

                        default:
                            setAlertState({
                                open: true,
                                message: "The problem is on the server, contact us",
                                severity: 'error'
                            });
                            break;
                    }
                }
            }
            catch (e) {
                // console.log(e);
            }
            // if (e.message.indexOf('account but found no recrd of a prior credit.') === -1) {
            //     setAlertState({
            //         open: true,
            //         message: "Insufficient funds on the account",
            //         severity: 'error'
            //     });
            // }
            // else {
            //     setAlertState({
            //         open: true,
            //         message: "Something is clearly wrong, but it's not your fault, contact us pls",
            //         severity: 'error'
            //     });
            // }

            // setTextOpen(`OPEN ${price} SOL`);
            const lds_roller = document.querySelector('.loaderOpen');
            if (lds_roller !== null) { (lds_roller as HTMLElement).style.display = 'none' }
            setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) { el.style.pointerEvents = 'all' };
            }, 2000);
        }
    }

    async function logMemo(message: string) {
        // 1. Declare Keypair to sign transaction 

        if (!wallet || !signMessage) {
            setAlertState({
                open: true,
                message: 'Connect your wallet and sign the approval message',
                severity: 'error'
            });
            return;
        }
        if (publicKey === null) { return; }

        const encodedMessage = new TextEncoder()
            .encode(message
                .replaceAll('\\r', '\r')
                .replaceAll('\\n', '\n')
            );

        const signedMessage = await signMessage(encodedMessage);
        setAnswer(_ => Buffer.from(signedMessage).toString('base64'));

        return Buffer.from(signedMessage).toString('base64');
    }

    function spinWheel3(roll: number, numberAnimation: number) {
        if (timeoutID) { clearTimeout(timeoutID) }
        setCloseBlock(false);
        let AnimationLootbeers = document.querySelector('.AnimationLootbeers');
        let AnimationLootbeers_background_block_text = document.querySelector('.AnimationLootbeers_background_block_text');
        let AnimationLootbeers_background_block_btn = document.querySelectorAll('.AnimationLootbeers_background_block_btn');
        let lootboxanimation = document.querySelector('.lootboxanimation');
        let lootboxAnimationImage = document.querySelector('.lootboxAnimationImage');
        let ticketImage = document.querySelectorAll('.ticketImage');
        let LootboxComponent = document.querySelector('.LootboxComponent');
        // let tweetBtn = document.querySelector('.tweetBtn');

        var $wheel = $('.roulette-wrapper2 .wheel2'),
            // order = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 1, 2, 1, 2, 1, 2, 1, 2],
            order = [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8],
            position = order.indexOf(roll);

        if (document.body.clientWidth > 910) {
            var rows = 6,
                card = 150 + 1.75 * 2,
                landingPosition = (rows * 18 * card) + (position * card);
            var randomize = Math.floor(Math.random() * 150) - (150 / 2) + 75;
        }
        else if (document.body.clientWidth > 710) {
            var rows = 6,
                card = 100 + 1.75 * 2,
                landingPosition = (rows * 18 * card) + (position * card);
            var randomize = Math.floor(Math.random() * 100) - (100 / 2) + 50;
        }
        else {
            var rows = 6,
                card = 75 + 1.75 * 2,
                landingPosition = (rows * 18 * card) + (position * card);
            var randomize = Math.floor(Math.random() * 75) - (75 / 2) + 37.5;
        }

        landingPosition = landingPosition + randomize;

        var object = {
            x: Math.floor(Math.random() * 50) / 100,
            y: Math.floor(Math.random() * 20) / 100
        };

        $wheel.css({
            'transition-timing-function': 'cubic-bezier(0,' + object.x + ',' + object.y + ',1)',
            'transition-duration': '8s',
            'transform': 'translate3d(-' + landingPosition + 'px, 0px, 0px)'
        });

        setTimeout(function () {
            (LootboxComponent as HTMLElement).style.overflowY = 'hidden';
            (LootboxComponent as HTMLElement).scrollTo(0, 0);

            $wheel.css({
                'transition-timing-function': '',
                'transition-duration': '',
            });

            var resetTo = -(position * card + randomize);
            $wheel.css('transform', 'translate3d(' + resetTo + 'px, 0px, 0px)');

            if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
                (AnimationLootbeers as HTMLElement).style.display = 'block';
                if (numberAnimation !== 2) {
                    // (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                    (lootboxAnimationImage as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text2 1.03s ease-in-out';
                    // (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                    // (AnimationLootbeers_background_block_btn[1] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                    // (tweetBtn as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 78s';
                }
                else {
                    (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                    (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                    (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                }
                (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 79.53s';

                setTimeout(() => {
                    // (lootboxanimation as HTMLElement).style.animationPlayState = 'running'; 
                    if (numberAnimation !== 2) {
                        // if (lootboxanimation !== null) { $("#lootboxanimation").attr('src', image.src); }
                        (lootboxanimation as HTMLElement).style.display = 'block';
                        (lootboxanimation as HTMLElement).style.animation = 'lootboxanimationkeyframes 1.03s';
                    }
                }, 500);
                setTimeout(() => {
                    if (numberAnimation !== 2) {
                        // if (lootboxanimation !== null) { $("lootboxanimation").remove('src'); }
                        // (lootboxanimation as HTMLElement).style.animationPlayState = 'paused';

                        (lootboxanimation as HTMLElement).style.animation = 'lootboxanimationkeyframes 0s';
                        (lootboxanimation as HTMLElement).style.display = 'none';
                        // (lootboxAnimationImage as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text2 0s';
                    }
                    setCloseBlock(true);

                    let massColor: Array<string> = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];

                    if ((numberAnimation !== 2)) {
                        jsConfetti.addConfetti({
                            confettiNumber: 200,
                            confettiColors: massColor
                        })
                    }

                }, 1530);
                setTimeout(() => {
                    (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                    (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                    (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
                    // if (numberAnimation !== 2) {
                    //     (tweetBtn as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 78s';
                    // }
                }, 1530)

            }
        }, 8 * 1000);

        setTimeout(function () {
            // (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
            // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';
            // (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
            getYourLoots();
            getAllLoots();
            getOgChance();
            // (AnimationLootbeers as HTMLElement).style.display = 'none';

            // (AnimationLootbeers_background_block_btn[1] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        }, 10 * 1000)

        // setTimeout(function () {
        //     if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        //         (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        //         // (AnimationLootbeers as HTMLElement).style.display = 'none';
        //         (LootboxComponent as HTMLElement).style.overflowY = 'scroll';
        //         // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';

        //         (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        //         (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        //         setTimeout(() => {
        //             (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';
        //             (AnimationLootbeers as HTMLElement).style.display = 'none';
        //         }, 1000)
        //     }
        // }, 61.03 * 1000)

        //81.03

        // idTimOut;

        const timeout = setTimeout(function () {
            if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
                (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                // (AnimationLootbeers as HTMLElement).style.display = 'none';
                (LootboxComponent as HTMLElement).style.overflowY = 'scroll';
                // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';

                (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                setTimeout(() => {
                    (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';
                    (AnimationLootbeers as HTMLElement).style.display = 'none';
                }, 1000)
            }
        }, 79.53 * 1000)
        setTimeoutID(timeout);

    }

    function spinWheel2(roll: number) {
        let AnimationLootbeers = document.querySelector('.AnimationLootbeers');
        let AnimationLootbeers_background_block_text = document.querySelector('.AnimationLootbeers_background_block_text');
        let AnimationLootbeers_background_block_btn = document.querySelectorAll('.AnimationLootbeers_background_block_btn');

        if (price.toString() === '0') {
            var $wheel = $('.roulette-wrapper2 .wheel2'),
                order = [3, 1, 2],
                position = order.indexOf(roll);

            if (document.body.clientWidth > 910) {
                var rows = 6,
                    card = 150 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 150) - (150 / 2) + 75;
            }
            else if (document.body.clientWidth > 710) {
                var rows = 6,
                    card = 100 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 100) - (100 / 2) + 50;
            }
            else {
                var rows = 6,
                    card = 75 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 75) - (75 / 2) + 37.5;
            }
        }
        else if (price.toString() === '0.2') {
            var $wheel = $('.roulette-wrapper2 .wheel2'),
                order = [7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6],
                position = order.indexOf(roll);

            if (document.body.clientWidth > 910) {
                var rows = 6,
                    card = 150 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 150) - (150 / 2) + 75;
            }
            else if (document.body.clientWidth > 710) {
                var rows = 6,
                    card = 100 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 100) - (100 / 2) + 50;
            }
            else {
                var rows = 6,
                    card = 75 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 75) - (75 / 2) + 37.5;
            }
        }
        else if (price.toString() === '0.5') {
            var $wheel = $('.roulette-wrapper2 .wheel2'),
                order = [7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6],
                position = order.indexOf(roll);

            if (document.body.clientWidth > 910) {
                var rows = 6,
                    card = 150 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 150) - (150 / 2) + 75;
            }
            else if (document.body.clientWidth > 710) {
                var rows = 6,
                    card = 100 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 100) - (100 / 2) + 50;
            }
            else {
                var rows = 6,
                    card = 75 + 1.75 * 2,
                    landingPosition = (rows * 14 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 75) - (75 / 2) + 37.5;
            }
        }
        else {
            var $wheel = $('.roulette-wrapper2 .wheel2'),
                order = [5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4],
                position = order.indexOf(roll);
            if (document.body.clientWidth > 910) {
                var rows = 6,
                    card = 150 + 1.75 * 2,
                    landingPosition = (rows * 11 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 150) - (150 / 2);
            }
            else if (document.body.clientWidth > 710) {
                var rows = 6,
                    card = 100 + 1.75 * 2,
                    landingPosition = (rows * 11 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 100) - (100 / 2);
            }
            else {
                var rows = 6,
                    card = 75 + 1.75 * 2,
                    landingPosition = (rows * 11 * card) + (position * card);
                var randomize = Math.floor(Math.random() * 75) - (75 / 2);
            }
        }

        landingPosition = landingPosition + randomize;

        var object = {
            x: Math.floor(Math.random() * 50) / 100,
            y: Math.floor(Math.random() * 20) / 100
        };

        $wheel.css({
            'transition-timing-function': 'cubic-bezier(0,' + object.x + ',' + object.y + ',1)',
            'transition-duration': '8s',
            'transform': 'translate3d(-' + landingPosition + 'px, 0px, 0px)'
        });

        setTimeout(function () {
            $wheel.css({
                'transition-timing-function': '',
                'transition-duration': '',
            });

            var resetTo = -(position * card + randomize);
            $wheel.css('transform', 'translate3d(' + resetTo + 'px, 0px, 0px)');

            if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
                (AnimationLootbeers as HTMLElement).style.display = 'block';
                (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                // (AnimationLootbeers_background_block_btn[1] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 8s';
                (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 8s';

                let massColor: Array<string> = [];

                switch (price.toString()) {
                    case '0':
                        massColor = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];
                        break;
                    case '0.05':
                        massColor = ["#7ab0b8", "#6aa7af", "#66a5ad", "#599da6", "#508d95", "#477d85"];
                        break;
                    case '0.2':
                        massColor = ["#f7d722", "#f6d309", "#ebc808", "#ddbd08", "#c5a807", "#ac9306"];
                        break;
                    case '0.5':
                        massColor = ["#9e22f7", "#9309f6", "#8e08eb", "#8508dd", "#7607c5", "#6706ac"];
                        break;
                }

                if ((roll >= 4 && title === 'Wooden Loot Box')) {
                    jsConfetti.addConfetti({
                        confettiNumber: 100,
                        confettiColors: massColor
                    })
                }
                else if (title === 'OG LOOTBOX') {
                    jsConfetti.addConfetti({
                        confettiNumber: 100,
                        confettiColors: massColor
                    })
                }
                else if (roll > 4) {
                    jsConfetti.addConfetti({
                        confettiNumber: 100,
                        confettiColors: massColor
                    })
                }
            }
        }, 8 * 1000);

        setTimeout(function () {
            if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
                (AnimationLootbeers as HTMLElement).style.display = 'none';
                (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';

                (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                // (AnimationLootbeers_background_block_btn[1] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
            }
        }, 16 * 1000)
    }

    const closeAnimationLootbeers = () => {
        // clearTimeout();
        if (closeBlock === true) {
            let LootboxComponent = document.querySelector('.LootboxComponent');
            let AnimationLootbeers = document.querySelector('.AnimationLootbeers');
            let AnimationLootbeers_background_block_text = document.querySelector('.AnimationLootbeers_background_block_text');
            let AnimationLootbeers_background_block_btn = document.querySelectorAll('.AnimationLootbeers_background_block_btn');
            let ticketImage = document.querySelectorAll('.ticketImage');
            let lootboxanimation = document.querySelector('.lootboxanimation');
            let lootboxAnimationImage = document.querySelector('.lootboxAnimationImage');
            // let tweetBtn = document.querySelector('.tweetBtn');

            (lootboxanimation as HTMLElement).style.animation = 'lootboxanimationkeyframes 0s';
            (lootboxanimation as HTMLElement).style.display = 'none';
            (lootboxAnimationImage as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text2 0s';
            (lootboxAnimationImage as HTMLElement).style.opacity = '0';


            if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
                (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                (ticketImage[0] as HTMLElement).style.opacity = '0';
                // (AnimationLootbeers as HTMLElement).style.display = 'none';
                (LootboxComponent as HTMLElement).style.overflowY = 'scroll';
                // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';


                (AnimationLootbeers_background_block_text as HTMLElement).style.opacity = '0';
                (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.opacity = '0';

                (AnimationLootbeers_background_block_text as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
                // setTimeout(() => {
                (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';
                (AnimationLootbeers as HTMLElement).style.background = '#00000000';
                (AnimationLootbeers as HTMLElement).style.display = 'none';
                // }, 1000)
                getYourLoots();
                getAllLoots();
                getOgChance();

            }
            // if (tweetBtn !== null) {
            //     (tweetBtn as HTMLElement).style.opacity = '0';
            //     (tweetBtn as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
            // }
        }
    }

    const OpenAgain = () => {
        let AnimationLootbeers = document.querySelector('.AnimationLootbeers');
        let AnimationLootbeers_background_block_text = document.querySelector('.AnimationLootbeers_background_block_text');

        if (AnimationLootbeers !== null) {
            (AnimationLootbeers as HTMLElement).style.display = 'none';
        }

        setTimeout(() => {
            spinClick();
        }, 1000)
    }

    const correctPrice = (name: String) => {
        switch (name) {
            case 'NORMIE': {
                setPriceState(price[0]);
                break;
            }
            case 'DEGEN': {
                setPriceState(price[1]);
                break;
            }
            case 'WHALE': {
                setPriceState(price[2]);
                break;
            }
        }
    }

    const style1 = {
        'background': {
            background: `linear-gradient(to right, ${colors[0]}, ${colors[1]} 50%, ${colors[0]})`
        },
        'background2': {
            background: `linear-gradient(to right, ${colors[0]}, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[0]})`
        },
        'backgroundBtn': {
            background: `${colors[1]}`
        },
        'borderOnfoItem': {
            border: `1px solid ${colors[1]}`
        }
    }

    const MyLootsActive = {
        'Active': {
            color: '#ffc000',
            textShadow: '-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            borderBottom: `1px solid ${colors[1]}`
        },
        'Inactive': {
            color: '#ffffff',
            textShadow: 'none',
            borderBottom: `1px solid ${colors[1]}`
        }
    }

    const MenuElementState = (index: number) => {
        setActiveMenuElement(index);
        setColor(`#ffc000`);
        const footerPosition = document.querySelector('.footer');

        if (index !== 0) {
            if (footerPosition !== null) {
                (footerPosition as HTMLElement).style.position = 'absolute';
            }
        }
        else {
            if (footerPosition !== null) {
                (footerPosition as HTMLElement).style.position = 'absolute';
            }
        }

        const checkbox = document.getElementById('checkbox');

        if (checkbox !== null) {
            if ((checkbox as HTMLInputElement).checked === true) {
                (checkbox as HTMLInputElement).checked = false;
            }
        }
    }

    const tweet = async () => {

    }

    const tweetLast = () => {
        if (dataGetResultYourLoots !== undefined) {
            // console.log(dataGetResultYourLoots[0].loot.redeemResult);
        }

        if (dataGetResultYourLoots !== undefined) {
            dataGetResultYourLoots[0].loot.redeemResult === 'FREE_MINT' ?
                console.log(1) :
                dataGetResultYourLoots[0].loot.redeemResult === 'OG' ?
                    console.log(2) :
                    console.log(3)
        }
    }

    return (
        <div className="LootboxComponent" id="LootboxComponentID" style={{ overflowY: 'scroll' }}>
            <Snackbar
                open={alertState.open}
                autoHideDuration={
                    alertState.hideDuration === undefined ? 6000 : alertState.hideDuration
                }
                onClose={() => setAlertState({ ...alertState, open: false })}
            >
                <Alert
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    severity={alertState.severity}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
            <div className="AnimationLootbeers" style={{ display: 'none' }}>
                <div className="close" onClick={closeAnimationLootbeers}></div>
                <div className="AnimationLootbeers_background">
                    <div className="AnimationLootbeers_background_block">
                        <div className='BackgroundClick' onClick={closeAnimationLootbeers}></div>
                        {
                            imageStatecong === 0 ?
                                <img src={ticket2_1} alt="" className='ticketImage' /> :
                                imageStatecong === 1 ?
                                    <img src={ticket2_2} alt="" className='ticketImage' /> :
                                    imageStatecong === 2 ?
                                        <img src={ticket2_3} alt="" className='ticketImage' /> :
                                        <div></div>
                        }
                        <img src={lootboxanimation} alt="" id="lootboxanimation" className='lootboxanimation' style={{ display: 'none', animationPlayState: 'paused', mixBlendMode: 'screen' }}></img>
                        <img src={picture} alt="" className='lootboxAnimationImage' />
                        <div className="AnimationLootbeers_background_block_text">
                            {/* {textState} */}
                            {textState === OG_win_variants[1].text || textState === OG_win_variants[0].text ? (
                                <div className='AnimationLootbeers_background_block_text_mini'>
                                    <br />{textState_About}<br />
                                    <div className='header_a_block'>
                                        {/* <a className="header_a supportTextSvg" href="https://discord.gg/KRahEBWQea" target="_blank" rel="noopener noreferrer" style={{ marginRight: '0px' }}>
                                            <svg className="header_a_svg" fill="#FFFFFF" viewBox="0 0 71 55" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0)">
                                                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                                                </g>
                                            </svg>
                                        </a> */}
                                    </div>
                                </div>
                            ) : null}
                            <div className='buttons_AnimationLootbeers'>
                                {textState === OG_win_variants[1].text || textState === OG_win_variants[0].text ? (
                                    <a className="header_a supportTextSvg supportTextSvgBtn tweetBtn" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: '0px' }}>
                                        DISCORD
                                    </a>
                                )
                                    :
                                    <a></a>
                                }
                                {textState === OG_win_variants[0].text ?
                                    <a href='https://twitter.com/intent/tweet?text=I%20am%20certified%20diamond-handed%20Top%20G%2C%20no%20one%20can%20beat%20me%20%F0%9F%A4%91%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F9ri8kWl1ah' target={'_blank'} className='tweetBtn' onClick={tweet}>TWEET ABOUT IT</a>
                                    : textState === OG_win_variants[1].text ?
                                        <a href='https://twitter.com/intent/tweet?text=I%20am%20certified%20Top%20G%20now%2C%20time%20to%20show%20some%20respect%20%F0%9F%98%8E%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FpD0hfxR1rc' target={'_blank'} className='tweetBtn' onClick={tweet}>TWEET ABOUT IT</a>
                                        : textState === OG_win_variants[2].text ?
                                            <a href='https://twitter.com/intent/tweet?text=I%20wish%20I%20was%20luckier%2C%20need%20to%20prove%20that%20I%20am%20truly%20the%20Top%20G%20%F0%9F%8D%80%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FBCIqAtE4Yw' target={'_blank'} className='tweetBtn' onClick={tweet}>TWEET ABOUT IT</a>
                                            : null
                                }
                            </div>
                        </div>
                        {/* <div className='AnimationLootbeers_background_block_buttons'> */}
                        {/* <Link to='/' className='LootboxComponent_price AnimationLootbeers_background_block_btn' style={{ pointerEvents: 'all' }} onClick={() => MenuElementState(1)}>
                                <div className='content' style={style1.backgroundBtn}></div>
                                <div className='LootboxComponent_price_position'>
                                    take me to the home screen
                                </div>
                            </Link> */}
                        <div className='LootboxComponent_price AnimationLootbeers_background_block_btn' style={{ pointerEvents: 'all', display: 'none' }} onClick={OpenAgain}>
                            <div className='content' style={style1.backgroundBtn}></div>
                            <div className='LootboxComponent_price_position'>
                                open again
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
            {/* <div className='LogoImg'>
                <img src={LogoImg} alt="" className='LogoImg_img' />
            </div> */}
            <div className='TextMain'>
                <div className='background_TextMain'></div>
                <div className="LootboxBacdrop">
                    <div className='LootboxComponent_title'>
                        <div className='LootboxComponent_title_bottom' style={style1.background}></div>
                        {title}
                    </div>
                    <div className='LootboxComponent_image_block'>
                        <div className='LootboxComponent_image_block_background'>
                            <div className='radial' style={{ background: `radial-gradient(ellipse closest-side at center center, ${colors[1]}, rgba(0, 0, 0, 0))` }}></div>
                        </div>
                        <LazyLoadImage src={picture} effect="blur" alt={""} className='LootboxComponent_image' />
                    </div>
                    <div className='typeLootBox'>
                        <div className='NORMIE typeLootBox_block active' onClick={() => correctPrice('NORMIE')}>NORMIE</div>
                        <div className='DEGEN typeLootBox_block' onClick={() => correctPrice('DEGEN')}>DEGEN</div>
                        <div className='WHALE typeLootBox_block' onClick={() => correctPrice('WHALE')}>WHALE</div>
                    </div>
                    <div className='roulette-wrapper2' style={{
                        border: `2px solid ${colors[1]}`,
                        borderImage: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[0]}) 1`
                    }}>
                        <div className='wheel2'></div>
                        <div className='win2line'></div>
                        <div className='win2'>
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                width="30.000000pt" xHeight="30.000000pt" viewBox="0 0 30.000000 30.000000"
                                preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
                                    fill="#ffffff3d" stroke="none">
                                    <path d="M90 174 c-30 -26 -56 -55 -58 -65 -5 -27 4 -24 60 21 28 22 55 40 60 40 5 0 31 -18 57 -40 53 -45 61 -48 61 -21 0 14 -107 112 -122 111 -1 0 -28 -21 -58 -46z" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className='LootboxComponent_block_open'>
                        <div className='contentLine' style={style1.background2}></div>
                        <div className='LootboxComponent_price buttonSpin2 right' onClick={spinClick} id='buttonSpin2' style={{ pointerEvents: 'all' }}>
                            <div className='content' style={style1.backgroundBtn}></div>
                            <div className='LootboxComponent_price_position'>
                                {textOpen}
                                {/* <div className="lds-roller" style={{ display: 'none' }}><div></div><div></div><div></div><div></div></div> */}
                                <div className='loaderOpen' id="loaderOpen" style={{ display: 'none', borderTopColor: `${colors[1]}` }}></div>
                            </div>
                        </div>
                        <div className='LootboxComponent_price buttonSpin2 righttwo' onClick={undefined} id='buttonSpin3' style={{ pointerEvents: 'all' }}>
                            <div className='content righttwo'></div>
                            {/* <div className='LootboxComponent_price_position righttwo'>
                                INCREASE THE CHANCES BY 100 $LUM
                            </div> */}
                        </div>
                    </div>
                    <div className='LootboxComponent_stat'>
                        <div className='LootboxComponent_stat_text'>Chance of getting OG - {(dataGetOgChance !== undefined && dataGetOgChance !== null) ? Number(dataGetOgChance.ogProb * 100).toFixed(2) : 0}%</div>
                        <div className="blinking-leghtRed">
                            <div className="blinking-darkRed">
                            </div>
                        </div>
                    </div>
                    {
                        DateFrom === '' ?
                            <div className='timerMini'>{dateFormText}</div> :
                            <Timer2 deadline={DateFrom} />
                    }
                    {
                        dataGetResultYourLoots !== undefined ?
                            <a target={'_blank'} href={
                                dataGetResultYourLoots[0].loot.redeemResult === 'FREE_MINT' ?
                                    `https://twitter.com/intent/tweet?text=I%20am%20certified%20diamond-handed%20Top%20G%2C%20no%20one%20can%20beat%20me%20%F0%9F%A4%91%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F9ri8kWl1ah` :
                                    dataGetResultYourLoots[0].loot.redeemResult === 'OG' ?
                                        `https://twitter.com/intent/tweet?text=I%20am%20certified%20Top%20G%20now%2C%20time%20to%20show%20some%20respect%20%F0%9F%98%8E%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FpD0hfxR1rc` :
                                        `https://twitter.com/intent/tweet?text=I%20wish%20I%20was%20luckier%2C%20need%20to%20prove%20that%20I%20am%20truly%20the%20Top%20G%20%F0%9F%8D%80%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FBCIqAtE4Yw`
                            } className='LootboxComponent_stat tweetAboutItforpeoplewhoaccidentallyclosedthewinwindow'>
                                Tweet about your last prize
                            </a>
                            :
                            null
                    }
                </div>
            </div>
            <div className='StatBlock'>
                <div className='StatBlock_content'>
                    <div className='StatBlock_content_blockFirst' style={{ borderRight: `1px solid ${colors[1]}` }}>
                        <div className='StatBlock_content_first_title textSelect' style={{ borderBottom: `2px solid ${colors[1]}` }}>
                            Latest Loots
                        </div>
                        <div className='StatBlock_content_first'>
                            <div className='StatBlock_content_first_scroller'>
                                {
                                    dataGetAllLoots?.slice(0, 10).map((data, i) =>
                                        <li className='Loots_element Latest_Loots_element' key={i}>
                                            <div className='Loots_element_gradientBackground' style={{ border: `2px solid ${colors[1]}`, background: `none`, backdropFilter: 'blur(10px)' }}></div>
                                            <div className='textSelect'>{data.user.slice(0, 7)}...&nbsp;</div>
                                            <div className='Your_Loots_element_stat'>
                                                <div className='textSelect'>opened <span>
                                                                {
                                                                    data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? 'FREE LOOTBOX' : 'OG LOOTBOX'
                                                                }
                                                            </span>&nbsp;</div>
                                                <div className='textSelect'>and won {
                                                    data.loot.redeemResult === 'NONE' ?
                                                        <span>NOTHING</span> :
                                                        data.loot.redeemResult === 'OG' ?
                                                            <span>OG</span> :
                                                            data.loot.redeemResult === 'FREE_MINT' ?
                                                            <span>FREE MINT</span> :
                                                            <span>{data.loot.redeemResult}</span>
                                                }</div>
                                                {/* {(new Date(data.redeemedAt).getMinutes() >= 10) ?
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                    }}>{new Date(data.redeemedAt).getHours().toString()}:{new Date(data.redeemedAt).getMinutes().toString()}</div> :
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                    }}>{new Date(data.redeemedAt).getHours().toString()}:0{new Date(data.redeemedAt).getMinutes().toString()}</div>
                                                } */}
                                                {(new Date(data.redeemedAt).getMinutes() >= 10) ?
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                    }} onClick={
                                                        () => console.log(timeAgo.format(new Date(data.redeemedAt)))
                                                    }>{timeAgo.format(new Date(data.redeemedAt))}</div> :
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '10px',
                                                    }}>{timeAgo.format(new Date(data.redeemedAt))}</div>
                                                }
                                            </div>
                                        </li>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className='StatBlock_content_blockSecond' style={{ borderLeft: `0px solid ${colors[1]}` }}>
                        <div className='StatBlock_content_text_titles'>
                            <div className='StatBlock_content_first_title MyLootsActive firstOnlyMobileStatBlock' style={mylootsactiveElement === 0 ? MyLootsActive.Active : MyLootsActive.Inactive} onClick={() => {
                                mylootsactiveElement === 0 ? setActiveMenuElement(mylootsactiveElement) : setMyLootsActiveElement(0)
                            }}>LATEST LOOTS
                            </div>
                            {/* <div className='StatBlock_content_first_title MyLootsActive' style={mylootsactiveElement === 1 ? MyLootsActive.Active : MyLootsActive.Inactive} onClick={() => {
                                mylootsactiveElement === 1 ? setMyLootsActiveElement(mylootsactiveElement) : setMyLootsActiveElement(1)
                            }}>Unclaimed Loots
                            </div> */}
                            <div className='StatBlock_content_first_title MyLootsActive lastOnlyMobileStatBlock' style={mylootsactiveElement === 2 ? MyLootsActive.Active : MyLootsActive.Inactive} onClick={() => {
                                mylootsactiveElement === 2 ? setMyLootsActiveElement(mylootsactiveElement) : setMyLootsActiveElement(2)
                            }}>YOUR LOOTS
                            </div>
                        </div>
                        <div className='StatBlock_content_second'>
                            <div className='StatBlock_content_first_scroller'>
                                {
                                    mylootsactiveElement === 2 ? (
                                        dataGetResultYourLoots?.slice(0, 10).map((data, i) =>
                                            data.ticket !== undefined ?
                                                <div className='Loots_element Your_Loots_element' key={i}>
                                                    <div className='Loots_element_gradientBackground' style={{ border: `2px solid ${colors[1]}`, background: `none`, backdropFilter: 'blur(10px)' }}></div>
                                                    <div className='Your_Loots_element_stat'>
                                                        <div className='textSelect'>You opened <span>
                                                                {
                                                                    data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? 'FREE LOOTBOX' : 'OG LOOTBOX'
                                                                }
                                                            </span> and won {
                                                            data.loot.redeemResult === 'NONE' ?
                                                                <span>NOTHING</span> :
                                                                data.loot.redeemResult === 'OG' ?
                                                                    <span>OG</span> :
                                                                    data.loot.redeemResult === 'FREE_MINT' ?
                                                                    <span>FREE MINT</span> :
                                                                    <span>{data.loot.redeemResult}</span>
                                                        }</div>
                                                        {(new Date(data.redeemedAt).getMinutes() >= 10) ?
                                                            <div style={{
                                                                position: 'absolute',
                                                                right: '10px',
                                                            }} onClick={
                                                                () => console.log(timeAgo.format(new Date(data.redeemedAt)))
                                                            }>{timeAgo.format(new Date(data.redeemedAt))}</div> :
                                                            <div style={{
                                                                position: 'absolute',
                                                                right: '10px',
                                                            }}>{timeAgo.format(new Date(data.redeemedAt))}</div>
                                                        }
                                                        {/* <a href={`https://api.random.org/tickets/form?ticket=${data.ticket}`} style={{
                                                            position: 'absolute',
                                                            right: '10px'
                                                        }}>info</a> */}
                                                        {/* <div className='textSelect'>Replay */}
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" xHeight="32" viewBox="0 0 48 48" fill='#FFFFFF'><path d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z" /></svg> */}
                                                        {/* </div> */}
                                                    </div>
                                                </div>
                                                :
                                                null
                                        )
                                    )
                                        : mylootsactiveElement === 1 ?
                                            (
                                                dataStat?.slice(0, 10).map((data, i) =>
                                                    <div className='Loots_element Your_Loots_element' key={i}>
                                                        <div className='Loots_element_gradientBackground' style={{ border: `2px solid ${colors[1]}`, background: `none`, backdropFilter: 'blur(10px)' }}></div>
                                                        <div className='Your_Loots_element_stat'>
                                                            <div className='textSelect'>You didn't open the LootBox - &nbsp;</div>
                                                            <div className='textSelect'>Open
                                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" xHeight="32" viewBox="0 0 48 48" fill='#FFFFFF'><path d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z" /></svg> */}
                                                            </div>
                                                        </div>
                                                        {/* <div style={{
                                                            position: 'absolute',
                                                            right: '10px',
                                                        }}>{new Date(data.redeemedAt).toLocaleTimeString()}</div> */}
                                                    </div>
                                                )
                                            )
                                            :
                                            (
                                                dataGetAllLoots?.slice(0, 10).map((data, i) =>
                                                    <li className='Loots_element Latest_Loots_element' key={i}>
                                                        <div className='Loots_element_gradientBackground' style={{ border: `2px solid ${colors[1]}`, background: `none`, backdropFilter: 'blur(10px)' }}></div>
                                                        <div className='textSelect'>{data.user.slice(0, 5)}...&nbsp;</div>
                                                        <div className='Your_Loots_element_stat'>
                                                            <div className='textSelect'>opened <span>
                                                                {
                                                                    data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? 'FREE LOOTBOX' : 'OG LOOTBOX'
                                                                }
                                                            </span>&nbsp;</div>
                                                            <div className='textSelect'>and won {
                                                                data.loot.redeemResult === 'NONE' ?
                                                                    <span>NOTHING</span> :
                                                                    data.loot.redeemResult === 'OG' ?
                                                                        <span>OG</span> :
                                                                        data.loot.redeemResult === 'FREE_MINT' ?
                                                                        <span>FREE MINT</span> :
                                                                        <span>{data.loot.redeemResult}</span>
                                                            }</div>
                                                            {(new Date(data.redeemedAt).getMinutes() >= 10) ?
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    right: '10px',
                                                                }} onClick={
                                                                    () => console.log(timeAgo.format(new Date(data.redeemedAt)))
                                                                }>{timeAgo.format(new Date(data.redeemedAt))}</div> :
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    right: '10px',
                                                                }}>{timeAgo.format(new Date(data.redeemedAt))}</div>
                                                            }
                                                        </div>
                                                    </li>
                                                )
                                            )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default LootboxComponent;
