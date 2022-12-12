import "../../../App.css";
import "../../../fonts/fonts.css";
import { useEffect, useState, useRef, FC, createRef } from "react";
import $ from "jquery";
import JSConfetti from "js-confetti";
import { PublicKey } from "@solana/web3.js";
import "../../../animation.css";
import { Link } from "react-router-dom";
import useLootboxProgram from "../../hooks/useLootboxProgram";
import useRootConfigFetcher from "../../hooks/useRootConfigFetcher";
import { RootConfig } from "../../../types/app_types";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import solanapng from "../../../media/solanapng.webp";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import "./../../loader.scss";
import { display_FREE_TWDS_lootbox, OG_win_variants } from "../../../win_variants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../../timer.scss";
import lootboxanimation from "../../../media/ezgif-3-cbc77fa118.gif";
import "../MainLootboxes/MainLootboxes.scss";
import { Props, AlertState, LootYour, LootAll, OgChance, RandomMainLootbox } from "../../interfaceLootbox/interfaceLootbox";
import { getBuyTicketAccounts, redeemTicket2 } from "../../../util";

import { useSearchParams } from "react-router-dom";
import nftimg from "../../../media/whitelbxNft.webp";
import "./free_lootbox_2.scss";
import twitterapi from "../MainLootboxes/twitterapi";
import Lates_your_loots from "../../lates_your_loots/lates_your_loots";
import randomorgimg from "../../../media/randomORG.png";
import randomorgimgexamples from "../../../media/randomORGexamples.png";

const Free_lootbox_2: FC<Props> = ({ onChange, setColor, setActiveMenuElement, picture, price, title, URLtitle, colors, text, win_variants, lootboxAddress }) => {
  const rootConfigFetcher = useRootConfigFetcher();
  const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;
  const [rootConfig, setRootConfig] = useState<RootConfig | null>();
  const connection = useConnection();
  const [trigger, setTrigger] = useState(0);

  const [textState, setTextState] = useState<String>("");
  const [textState_About, settextState_About] = useState<String>("");
  const { publicKey, signMessage, signTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [dataStat, setDataStat] = useState<Array<Object>>();
  const [mylootsactiveElement, setMyLootsActiveElement] = useState<Number>(2);
  const [answer, setAnswer] = useState("");
  const [timeoutID, setTimeoutID] = useState<any>();

  const [random_main_lootbox, setrandom_main_lootbox] = useState<RandomMainLootbox[]>(win_variants);
  const [ALLrandom_main_lootbox, setALLrandom_main_lootbox] = useState<Array<Array<RandomMainLootbox>>>([]);
  const [ALLrandom_main_lootboxNumbers, setALLrandom_main_lootboxNumbers] = useState<Array<number>>([]);

  const [stateReloadInfo, setstateReloadInfo] = useState<Boolean>(false);
  const [timeoutIDAnime, setTimeoutIDAnime] = useState<any>();

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  useEffect(() => {
    async function call() {
      if (rootConfigFetcher && !rootConfig) {
        setRootConfig(await rootConfigFetcher());
      }
    }
    call();

    setColor(`${colors[1]}`);

    const footer = document.querySelector(".footer");
    if (footer !== null) {
      (footer as HTMLElement).style.display = "block";
      (footer as HTMLElement).style.position = "absolute";
    }
  }, [rootConfigFetcher]);

  const send = async () => {
    try {
      if (publicKey != null) {
        let balance = await connection.connection.getBalance(publicKey, "confirmed");
        onChange(balance / LAMPORTS_PER_SOL);
      }
    } catch (e) {}
  };

  const [statusDiscordGuilds, setStatusDiscordGuilds] = useState<Boolean>(false);
  const [value2, setValue2] = useState("");
  const jsConfetti = new JSConfetti();
  const program = useLootboxProgram();
  const [textOpen, setTextOpen] = useState<String>(`FREE`);
  const scrollerRef = createRef<HTMLDivElement>();
  const scrollerRef2 = createRef<HTMLDivElement>();

  const [dataGetResultYourLoots, setdataGetResultYourLoots] = useState<Array<LootYour>>();
  const [dataGetAllLoots, setdataGetAllLoots] = useState<Array<LootAll>>();
  const [dataGetOgChance, setdataGetOgChance] = useState<OgChance>();
  const [DateFrom, setdatefrom] = useState<string>("");

  const spinNymber2 = useRef<Number | null>(null);

  const [dateFormText, setDateFormText] = useState("");

  const [imageStatecong, setImageStateCong] = useState<number>(2);

  const [closeBlock, setCloseBlock] = useState<Boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [massStatus, setMassStatus] = useState<Array<any>>([]);
  const [massStatusreturn, setMassStatusreturn] = useState<Array<any>>([]);
  const [massStatusreturnchecker, setmassStatusreturnchekers] = useState<number>(0);

  const [ticketff, setTicketff] = useState<PublicKey | undefined>();
  // const [reranderUNCLEIMED, setreranderUNCLEIMED] = useState<Boolean>(false);

  // useEffect(()=> {
  //   if(reranderUNCLEIMED === false) {
  //     console.log('reranderUNCLEIMED')
  //   }
  // }, [reranderUNCLEIMED]);

  // const rerenderUNCLEIMED = (value: string) => {
  //   setreranderUNCLEIMED(value);
  // }

  function mixarr(arr: Array<any>) {
    return arr
      .map((i) => [Math.random(), i])
      .sort()
      .map((i) => i[1]);
  }

  function initWheel2() {
    let masssStateee = [];
    setALLrandom_main_lootbox([]);

    let $wheel = $(".roulette-wrapper2 .wheel2"),
      row = "";
    let indexID = -1;

    for (var x = 0; x < 5; x++) {
      // let row = "";
      row += "<div class='row'>";

      let chengedMass = mixarr(random_main_lootbox);
      // console.log(chengedMass);

      for (let i = 0; i < chengedMass.length; i++) {
        if (chengedMass[i].text === "0.5 SOL") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'
                      ><div class='background_whiteLTBX LTBXShit'></div><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "0.25 SOL") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'
                      ><div class='background_whiteLTBX LTBXGOLD'></div><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "0.1 SOL") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'
                      ><div class='background_whiteLTBX LTBXSilver'></div><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "0.05 SOL") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'
                      ><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "0.02 SOL") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'
                      ><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        } else {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div>
          <img src=${solanapng} alt='' class="element2_img solanapng"/><div>${chengedMass[i].text}</div><\/div>`;
        }
      }

      row += "</div>";
      let masschengedMass = chengedMass;

      let i: any = masschengedMass.map((el) => {
        indexID++;
        return {
          id: indexID,
          text: el.text,
        };
      });

      setALLrandom_main_lootbox((prev: any) => [...prev, i]);

      for (let i2 = 0; i2 < chengedMass.length; i2++) {
        setALLrandom_main_lootboxNumbers((prev: any) => [...prev, i[i2].id]);
        setMassStatus((prev: any) => [...prev, i[i2].id]);
      }

      // setALLrandom_main_lootboxNumbers((prev: any) => [...prev, i[x].id])
    }
    for (var x = 0; x < 29; x++) {
      $wheel.append(row);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveMenuElement(0);

    const MenuElementFocus = document.getElementById("menu");
    const checkbox = document.getElementById("checkbox");
    const LootboxComponent = document.querySelector(".LootboxComponent");

    if (MenuElementFocus !== null && LootboxComponent !== null && checkbox !== null) {
      LootboxComponent.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(MenuElementFocus);
        if (!withinBoundaries) {
          if ((checkbox as HTMLInputElement).checked === true) {
            (checkbox as HTMLInputElement).checked = false;
          }
        }
      });
      checkbox.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(MenuElementFocus);
        if (!withinBoundaries) {
        }
      });
    }

    const checkuseEffectSession = document.querySelectorAll(".row")[0];

    //HERE
    // (document.getElementById("wheel2id") as HTMLElement).innerHTML = "";

    if (checkuseEffectSession === undefined || checkuseEffectSession === null) {
      // console.log("initWhell");
      initWheel2();
    }

    if (document.body.clientWidth <= 734) {
      setMyLootsActiveElement(0);
    }

    const elements2 = document.querySelectorAll(".imageLootbeers");
    if (elements2 !== null) {
      for (let i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener("load", function () {
          (elements2[i] as HTMLElement).style.height = "auto";
        });
      }
    }

    const el = document.querySelector(".datatool");
    const elcontentToolTipBlock = document.querySelector(".contentToolTipBlock");
    (el as HTMLElement).addEventListener("mouseleave", function () {
      if (timeoutIDAnime) {
        clearTimeout(timeoutIDAnime);
      }
      // console.log(2);
      (el as HTMLElement).style.height = "auto";
      const timeout1 = setTimeout(function () {
        (elcontentToolTipBlock as HTMLElement).style.visibility = "hidden";
        setopentooltip(true);
      }, 500);
      setTimeoutIDAnime(timeout1);
      (elcontentToolTipBlock as HTMLElement).style.opacity = "0";
    });
    // if (opentooptip === true) {
    //   if (timeoutIDAnime) {
    //     clearTimeout(timeoutIDAnime);
    //   }
    //   // console.log(1);
    //   (el as HTMLElement).style.height = "auto";
    //   (elcontentToolTipBlock as HTMLElement).style.visibility = "hidden";
    //   (elcontentToolTipBlock as HTMLElement).style.opacity = "0";
    // }
    // if (timeoutIDAnime) {
    //   clearTimeout(timeoutIDAnime);
    // }
  }, []);

  useEffect(() => {
    let mass: Array<any> = [];
    // console.log(massStatusreturnchecker);

    if (massStatusreturnchecker <= 1) {
      // console.log(massStatus);
      // console.log(massStatusreturn);

      let n = massStatus.length;
      let k = Number((massStatus.length / 2).toFixed(0));
      const newArr = splitArr(massStatus, k, n);
      // setMassStatus(newArr);
      setMassStatusreturn(newArr);
      setmassStatusreturnchekers((prev) => (prev = prev + 1));
    }
  }, [massStatus]);

  useEffect(() => {
    send();
    // getYourLoots();
    // getAllLoots();
    // getOgChance();
    // const el = document.getElementById("buttonSpin2");
    // if (el !== null && publicKey !== null) { el.style.pointerEvents = 'all' };
  }, [wallet]);

  function getRandomArrayElement(arr: Array<number>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const spinClick = async (ticket: Boolean, ticketData: PublicKey | undefined) => {
    try {
      let Array0SOL: Array<RandomMainLootbox> = [];
      let Array0_01SOL: Array<RandomMainLootbox> = [];
      let Array0_2SOL: Array<RandomMainLootbox> = [];
      let Array0_05SOL: Array<RandomMainLootbox> = [];
      let Array0_1SOL: Array<RandomMainLootbox> = [];
      let Array0_25SOL: Array<RandomMainLootbox> = [];
      let Array0_5SOL: Array<RandomMainLootbox> = [];

      let Array0SOLNumbers: Array<number> = [];
      let Array0_01SOLNumbers: Array<number> = [];
      let Array0_2SOLNumbers: Array<number> = [];
      let Array0_05SOLNumbers: Array<number> = [];
      let Array0_1SOLNumbers: Array<number> = [];
      let Array0_25SOLNumbers: Array<number> = [];
      let Array0_5SOLNumbers: Array<number> = [];

      const lds_roller = document.querySelector(".loaderOpen");
      const textOpenel = document.querySelector(".LootboxComponent_price_position span");
      if (lds_roller !== null && textOpenel !== null) {
        (lds_roller as HTMLElement).style.display = "block";
        (textOpenel as HTMLElement).style.position = "absolute";
        (textOpenel as HTMLElement).style.opacity = "0";
      }
      const el = document.getElementById("buttonSpin2");
      if (el !== null) {
        el.style.pointerEvents = "none";
      }

      const pk = new PublicKey(lootboxAddress);

      if (!program || !rootConfig) {
        setAlertState({
          open: true,
          message: "A small problem, try again by reloading the page or deleting cookies",
          severity: "error",
        });
        return;
      }

      let iTicket: number;

      //   if (ticketData === undefined) {
      //     const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);
      //     setTicketff(accounts.ticket.publicKey);
      //     const id = await program.methods
      //       .buyLootboxTicket()
      //       .accountsStrict({
      //         ...accounts.accounts,
      //       })
      //       .signers([accounts.ticket])
      //       .rpc();
      //     await new Promise((resolve) => setTimeout(resolve, 5000));
      //     iTicket = await redeemTicket(accounts.ticket.publicKey);
      //   } else {
      //     await new Promise((resolve) => setTimeout(resolve, 5000));
      //     iTicket = await redeemTicket(ticketData);
      //   }

      const merge3 = ALLrandom_main_lootbox.flat(1);
      let element;
      const el5 = document.getElementById("buttonSpin2");

      for (let i = 0; i < merge3.length; i++) {
        element = merge3[i];
        switch (element.text) {
          case "0 SOL":
            Array0SOL.push(element);
            Array0SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.01 SOL":
            Array0_01SOL.push(element);
            Array0_01SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.02 SOL":
            Array0_2SOL.push(element);
            Array0_2SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.05 SOL":
            Array0_05SOL.push(element);
            Array0_05SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.1 SOL":
            Array0_1SOL.push(element);
            Array0_1SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.25 SOL":
            Array0_25SOL.push(element);
            Array0_25SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.5 SOL":
            Array0_5SOL.push(element);
            Array0_5SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          default:
            break;
        }
      }

      //   let rendomNum2 = iTicket; // тут res.data.id
      const ArrayRandom: Array<number> = [0, 1, 2, 3, 4, 5, 6];

      //   const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);

      //     const id = await program.methods
      //       .buyLootboxTicket()
      //       .accountsStrict({
      //         ...accounts.accounts,
      //       })
      //       .signers([accounts.ticket])
      //       .rpc();
      //     await new Promise((resolve) => setTimeout(resolve, 1000));

      //     const i = await redeemTicket2(accounts.ticket.publicKey, lcltwid); //twitter (free check twds)

      let rendomNum2 = getRandomArrayElement(ArrayRandom); // тут res.data.id
      // console.log(Array0_25SOLNumbers);
      // console.log(win_variants[rendomNum2].text);

      settextState_About(win_variants[rendomNum2].text);
      setImageStateCong(rendomNum2);

      let rendomNum: number = 0;

      switch (Number(rendomNum2)) {
        case 0:
          rendomNum = await getRandomArrayElement(Array0SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 1:
          rendomNum = await getRandomArrayElement(Array0_01SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 2:
          rendomNum = await getRandomArrayElement(Array0_2SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 3:
          rendomNum = await getRandomArrayElement(Array0_05SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 4:
          rendomNum = await getRandomArrayElement(Array0_1SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 5:
          rendomNum = await getRandomArrayElement(Array0_25SOLNumbers);
          // console.log(rendomNum);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        case 6:
          rendomNum = await getRandomArrayElement(Array0_5SOLNumbers);
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 5000);
          break;
        default:
          break;
      }
    } catch (e: any) {
      try {
        const lds_roller = document.querySelector(".loaderOpen");
        const el5 = document.getElementById("buttonSpin2");
        const textOpenel = document.querySelector(".LootboxComponent_price_position span");
        const el444 = document.querySelectorAll(".btnOPENlbxtd");

        if (e.response.data.title) {
          switch (e.response.data.title) {
            case "TICKET_NOT_REDEEMED":
              setAlertState({
                open: true,
                message: "Loot Box isn't opened - claim your Loot in 'Unclaimed Loots' section",
                severity: "warning",
              });
              setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) {
                  el.style.pointerEvents = "all";
                }
              }, 2000);
              if (lds_roller !== null && textOpenel !== null) {
                (lds_roller as HTMLElement).style.display = "none";
                (textOpenel as HTMLElement).style.position = "relative";
                (textOpenel as HTMLElement).style.opacity = "1";
              }
              if (el444 !== null) {
                el444.forEach((element) => {
                  (element as HTMLElement).style.pointerEvents = "all";
                });
              }
              break;

            case "BAD_TICKET_DATA":
              setAlertState({
                open: true,
                message: "Loot Box isn't opened - claim your Loot in 'Unclaimed Loots' section",
                severity: "info",
              });
              setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) {
                  el.style.pointerEvents = "all";
                }
              }, 2000);
              if (lds_roller !== null && textOpenel !== null) {
                (lds_roller as HTMLElement).style.display = "none";
                (textOpenel as HTMLElement).style.position = "relative";
                (textOpenel as HTMLElement).style.opacity = "1";
              }
              if (el444 !== null) {
                el444.forEach((element) => {
                  (element as HTMLElement).style.pointerEvents = "all";
                });
              }
              break;

            case "LOOTBOX_NOT_FOUND":
              setAlertState({
                open: true,
                message: "LOOTBOX_NOT_FOUND",
                severity: "error",
              });
              setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) {
                  el.style.pointerEvents = "all";
                }
              }, 2000);
              if (lds_roller !== null && textOpenel !== null) {
                (lds_roller as HTMLElement).style.display = "none";
                (textOpenel as HTMLElement).style.position = "relative";
                (textOpenel as HTMLElement).style.opacity = "1";
              }
              if (el444 !== null) {
                el444.forEach((element) => {
                  (element as HTMLElement).style.pointerEvents = "all";
                });
              }
              break;

            default:
              setAlertState({
                open: true,
                message: "The problem is on the server, contact us",
                severity: "error",
              });
              setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) {
                  el.style.pointerEvents = "all";
                }
              }, 2000);
              if (lds_roller !== null && textOpenel !== null) {
                (lds_roller as HTMLElement).style.display = "none";
                (textOpenel as HTMLElement).style.position = "relative";
                (textOpenel as HTMLElement).style.opacity = "1";
              }
              if (el444 !== null) {
                el444.forEach((element) => {
                  (element as HTMLElement).style.pointerEvents = "all";
                });
              }
              break;
          }
        }
      } catch (e) {
        const lds_roller = document.querySelector(".loaderOpen");
        const el5 = document.getElementById("buttonSpin2");
        const textOpenel = document.querySelector(".LootboxComponent_price_position span");
        setAlertState({
          open: true,
          message: "Transaction canceled",
          severity: "error",
        });
        setTimeout(() => {
          if (el5 !== null) {
            el5.style.pointerEvents = "all";
          }
        }, 2000);
        if (lds_roller !== null && textOpenel !== null) {
          (lds_roller as HTMLElement).style.display = "none";
          (textOpenel as HTMLElement).style.position = "relative";
          (textOpenel as HTMLElement).style.opacity = "1";
        }
      }
    }
  };

  const bad_ticket_data_openAgain = (value: PublicKey, i: string) => {
    const el = document.querySelectorAll(".btnOPENlbxtd");
    if (el !== null) {
      el.forEach((element) => {
        (element as HTMLElement).style.pointerEvents = "none";
      });
    }
    spinClick(true, value);
  };

  function rvereseArray(arr: Array<number>, start: number, end: number) {
    while (start < end) {
      let temp = arr[start];
      arr[start] = arr[end];
      arr[end] = temp;
      start++;
      end--;
    }
  }

  function splitArr(arr: Array<number>, k: number, n: number) {
    const arr2 = arr;
    rvereseArray(arr2, 0, n - 1);
    rvereseArray(arr2, 0, n - k - 1);
    rvereseArray(arr2, n - k, n - 1);
    return arr2;
  }

  function MainLootboxesRoll(roll: number, numberAnimation: number, massive: Array<number>) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    setCloseBlock(false);

    let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
    let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
    let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
    let lootboxanimation = document.querySelector(".lootboxanimation");
    let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
    // let ticketImage = document.querySelectorAll('.ticketImage');

    var $wheel = $(".roulette-wrapper2 .wheel2"),
      order = massive,
      // order = [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8],

      position = order.indexOf(roll);
    // console.log(order);

    if (document.body.clientWidth > 910) {
      var rows = 3,
        card = 150 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      var randomize = Math.floor(Math.random() * 150) - 150 / 2 + 75;
      randomize = Math.floor(Math.random() * (140 - 10 + 1) + 75);
    } else if (document.body.clientWidth > 710) {
      var rows = 3,
        card = 100 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      var randomize = Math.floor(Math.random() * 100) - 100 / 2 + 50;
      randomize = Math.floor(Math.random() * (90 - 10 + 1) + 50);
    } else {
      var rows = 3,
        card = 75 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      var randomize = Math.floor(Math.random() * 75) - 75 / 2 + 37.5;
      randomize = Math.floor(Math.random() * (65 - 10 + 1) + 37.5);
    }

    landingPosition = landingPosition + randomize;

    var object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    $wheel.css({
      "transition-timing-function": "cubic-bezier(0," + object.x + "," + object.y + ",1)",
      "transition-duration": "3s",
      transform: "translate3d(-" + landingPosition + "px, 0px, 0px)",
    });

    setTimeout(function () {
      document.body.style.overflowY = "hidden";
      window.scrollTo({ top: 0, behavior: "smooth" });

      $wheel.css({
        "transition-timing-function": "",
        "transition-duration": "",
      });

      var resetTo = -(position * card + randomize);
      $wheel.css("transform", "translate3d(" + resetTo + "px, 0px, 0px)");

      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        (AnimationLootbeers as HTMLElement).style.display = "block";
        if (numberAnimation > 1) {
          (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 1.03s ease-in-out";
        } else {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          // (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
        }
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 79.53s";

        setTimeout(() => {
          if (numberAnimation > 1) {
            (lootboxanimation as HTMLElement).style.display = "block";
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 1.03s";
          }
        }, 500);
        setTimeout(() => {
          if (numberAnimation > 1) {
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
            (lootboxanimation as HTMLElement).style.display = "none";
          }
          setCloseBlock(true);

          let massColor: Array<string> = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];

          if (numberAnimation > 1) {
            jsConfetti.addConfetti({
              confettiNumber: 100,
              confettiColors: massColor,
            });
          }
        }, 1530);
        setTimeout(() => {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          // (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
        }, 1530);
      }
      send();
      setTrigger((trigger) => trigger + 1);
      const el = document.querySelectorAll(".btnOPENlbxtd");
      if (el !== null) {
        el.forEach((element) => {
          (element as HTMLElement).style.pointerEvents = "all";
        });
      }
    }, 3 * 1000);

    const timeout = setTimeout(function () {
      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        // (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        // (AnimationLootbeers as HTMLElement).style.display = 'none';
        document.body.style.overflowY = "scroll";
        // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';

        (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        setTimeout(() => {
          (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 0s";
          (AnimationLootbeers as HTMLElement).style.display = "none";
        }, 1000);
      }
    }, 79.53 * 1000);
    setTimeoutID(timeout);
  }

  const closeAnimationLootbeers = () => {
    // clearTimeout();
    if (closeBlock === true) {
      let LootboxComponent = document.querySelector(".LootboxComponent");
      let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
      let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
      let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
      // let ticketImage = document.querySelectorAll('.ticketImage');
      let lootboxanimation = document.querySelector(".lootboxanimation");
      let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
      // let tweetBtn = document.querySelector('.tweetBtn');

      (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
      (lootboxanimation as HTMLElement).style.display = "none";
      (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 0s";
      (lootboxAnimationImage as HTMLElement).style.opacity = "0";

      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        // (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 0s';
        // (ticketImage[0] as HTMLElement).style.opacity = '0';
        // (AnimationLootbeers as HTMLElement).style.display = 'none';
        // (LootboxComponent as HTMLElement).style.overflowY = "scroll";
        document.body.style.overflowY = "scroll";
        // (AnimationLootbeers as HTMLElement).style.animation = 'AnimationLootbeersKeyframes 0s';

        (AnimationLootbeers_background_block_text as HTMLElement).style.opacity = "0";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.opacity = "0";

        (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        // setTimeout(() => {
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 0s";
        (AnimationLootbeers as HTMLElement).style.background = "#00000000";
        (AnimationLootbeers as HTMLElement).style.display = "none";
        // }, 1000)
        // getYourLoots();
        // getAllLoots();
        // getOgChance();
      }
    }
  };

  const OpenAgain = () => {
    let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
    let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");

    if (AnimationLootbeers !== null) {
      (AnimationLootbeers as HTMLElement).style.display = "none";
    }

    setTimeout(() => {
      spinClick(false, undefined);
    }, 1000);
  };

  const style1 = {
    background: {
      background: `linear-gradient(to right, ${colors[0]}, ${colors[1]} 50%, ${colors[0]})`,
    },
    background2: {
      background: `linear-gradient(to right, ${colors[0]}, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[0]})`,
    },
    backgroundBtn: {
      background: `${colors[1]}`,
    },
    borderOnfoItem: {
      border: `2px solid ${colors[1]}`,
    },
  };

  const ChangeActiveMenuElement_setDateFormText = (value: string) => {
    setDateFormText(value);
  };
  const ChangeActiveMenuElement_setdatefrom = (value: string) => {
    setdatefrom(value);
  };

  const [opentooptip, setopentooltip] = useState<Boolean>(true);

  useEffect(() => {
    const el = document.querySelector(".datatool");
    const elcontentToolTipBlock = document.querySelector(".contentToolTipBlock");

    if (el !== null && elcontentToolTipBlock !== null) {
      // console.log(opentooptip);
      if (opentooptip === false) {
        if (timeoutIDAnime) {
          clearTimeout(timeoutIDAnime);
        }
        // console.log(1);
        (el as HTMLElement).style.height = "80%";
        (elcontentToolTipBlock as HTMLElement).style.visibility = "visible";
        (elcontentToolTipBlock as HTMLElement).style.opacity = "1";
      } else if (opentooptip === true) {
        if (timeoutIDAnime) {
          clearTimeout(timeoutIDAnime);
        }
        // console.log(1);
        (el as HTMLElement).style.height = "auto";
        (elcontentToolTipBlock as HTMLElement).style.visibility = "hidden";
        (elcontentToolTipBlock as HTMLElement).style.opacity = "0";
      }
      if (timeoutIDAnime) {
        clearTimeout(timeoutIDAnime);
      }
      // console.log(2);
      // (el as HTMLElement).style.height = "auto";
      // const timeout1 = setTimeout(function () {
      //   (elcontentToolTipBlock as HTMLElement).style.visibility = "hidden";
      // }, 500);
      // setTimeoutIDAnime(timeout1);
      // (elcontentToolTipBlock as HTMLElement).style.opacity = "0";
    }
  }, [opentooptip]);

  return (
    <div className="LootboxComponent" id="LootboxComponentID" style={{ overflowY: "scroll" }}>
      <Snackbar open={alertState.open} autoHideDuration={alertState.hideDuration === undefined ? 6000 : alertState.hideDuration} onClose={() => setAlertState({ ...alertState, open: false })}>
        <Alert onClose={() => setAlertState({ ...alertState, open: false })} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
      <div className="AnimationLootbeers" style={{ display: "none" }}>
        <div className="close" onClick={closeAnimationLootbeers}></div>
        <div className="AnimationLootbeers_background">
          <div className="AnimationLootbeers_background_block">
            <div className="BackgroundClick" onClick={closeAnimationLootbeers}></div>
            <img src={lootboxanimation} alt="" id="lootboxanimation" className="lootboxanimation" style={{ display: "none", animationPlayState: "paused", mixBlendMode: "screen" }}></img>
            <img src={picture} alt="" className="lootboxAnimationImage" />
            <div className="AnimationLootbeers_background_block_text">
              <div className="AnimationLootbeers_background_block_text_mini">
                {imageStatecong === 9 ? <img src={nftimg} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} /> : <img src={solanapng} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} />}
                <br />
                <br />
                <div className="header_a_block">{textState_About}</div>
              </div>
              <div className="buttons_AnimationLootbeers">
                {textState === OG_win_variants[1].text || textState === OG_win_variants[0].text ? (
                  <a className="header_a supportTextSvg supportTextSvgBtn tweetBtn" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: "0px" }}>
                    DISCORD
                  </a>
                ) : (
                  <a></a>
                )}
                {textState === OG_win_variants[0].text ? (
                  <a href="https://twitter.com/intent/tweet?text=I%20am%20certified%20diamond-handed%20Top%20G%2C%20no%20one%20can%20beat%20me%20%F0%9F%A4%91%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F9ri8kWl1ah" target={"_blank"} className="tweetBtn">
                    TWEET ABOUT IT
                  </a>
                ) : textState === OG_win_variants[1].text ? (
                  <a href="https://twitter.com/intent/tweet?text=I%20am%20certified%20Top%20G%20now%2C%20time%20to%20show%20some%20respect%20%F0%9F%98%8E%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FpD0hfxR1rc" target={"_blank"} className="tweetBtn">
                    TWEET ABOUT IT
                  </a>
                ) : textState === OG_win_variants[2].text ? (
                  <a href="https://twitter.com/intent/tweet?text=I%20wish%20I%20was%20luckier%2C%20need%20to%20prove%20that%20I%20am%20truly%20the%20Top%20G%20%F0%9F%8D%80%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FBCIqAtE4Yw" target={"_blank"} className="tweetBtn">
                    TWEET ABOUT IT
                  </a>
                ) : null}
              </div>
            </div>
            <div className="LootboxComponent_price AnimationLootbeers_background_block_btn" style={{ pointerEvents: "all", display: "none" }} onClick={OpenAgain}>
              <div className="content" style={style1.backgroundBtn}></div>
              <div className="LootboxComponent_price_position">open again</div>
            </div>
          </div>
        </div>
      </div>
      <div className="TextMain">
        <div className="background_TextMain"></div>
        <div className="datatool" style={{ height: "auto" }}>
          <svg onClick={() => setopentooltip((prev) => !prev)} width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path data-name="layer1" d="M56 12A33 33 0 0 1 32 2 33 33 0 0 1 8 12S5.9 48 32 62c26.1-14 24-50 24-50z" fill="#FFFFFF"></path>
            <path data-name="opacity" d="M8 12S5.9 48 32 62V2A33 33 0 0 1 8 12z" fill="#000064" opacity=".1"></path>
            <path data-name="stroke" d="M56 12A33 33 0 0 1 32 2 33 33 0 0 1 8 12S5.9 48 32 62c26.1-14 24-50 24-50z" fill="none" stroke="#2e4369" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <div className="contentToolTipBlock" style={{ visibility: "hidden", opacity: 0 }}>
            <div className="topBlockToolTip">
              <div className="leftblocktooltip">
                Lootbeers platform is using{" "}
                <a target={"_blank"} href="https://api.random.org/tickets/form">
                  random.org
                </a>{" "}
                to generate truly random numbers for each opening.
              </div>
              <svg onClick={() => setopentooltip((prev) => !prev)} className="svgclosetooltip" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.406999 14.411C-0.0699219 14.8879 -0.079655 15.7346 0.416732 16.231C0.922852 16.7274 1.76963 16.7177 2.23682 16.2505L7.9988 10.4885L13.751 16.2408C14.2377 16.7274 15.0747 16.7274 15.5711 16.231C16.0675 15.7249 16.0675 14.8976 15.5809 14.411L9.82861 8.6587L15.5809 2.89673C16.0675 2.41007 16.0772 1.57303 15.5711 1.07664C15.0747 0.580254 14.2377 0.580254 13.751 1.06691L7.9988 6.81915L2.23682 1.06691C1.76963 0.589987 0.913119 0.570521 0.416732 1.07664C-0.079655 1.57303 -0.0699219 2.42954 0.406999 2.89673L6.15925 8.6587L0.406999 14.411Z" fill="#3C3C43" fillOpacity="0.9" />
              </svg>
            </div>
            <br />
            <img src={randomorgimg} alt="" />
            <br />
            During transaction confirmation, our program sends a request to{" "}
            <a target={"_blank"} href="https://api.random.org/tickets/form">
              random.org
            </a>
            . Website generates a truly random number at the set chances, which can be found in{" "}
            <Link to="/faq" style={{ textTransform: "uppercase" }}>
              FAQ
            </Link>
            .
            <br />
            <br />
            All information on a specific opening can be seen on the{" "}
            <a target={"_blank"} href="https://api.random.org/tickets/form">
              api.random.org/tickets/
            </a>{" "}
            website by entering the ticket number, which can be found in the "Latest Loots" section under every recorded opening.
            <img src={randomorgimgexamples} alt="" />
          </div>
        </div>
        <div className="LootboxBacdrop zIndexLXBackdrop">
          <div className="LootboxComponent_title">
            <div className="LootboxComponent_title_bottom" style={style1.background}></div>
            {title}
          </div>
          <div className="LootboxComponent_image_block">
            <div className="LootboxComponent_image_block_background">
              <div className="radial" style={{ background: `radial-gradient(ellipse closest-side at center center, ${colors[1]}, rgba(0, 0, 0, 0))` }}></div>
            </div>
            <LazyLoadImage src={picture} effect="blur" alt={""} className="LootboxComponent_image" />
          </div>
          <div
            className="roulette-wrapper2"
            id="wrapper2"
            style={{
              border: `2px solid ${colors[1]}`,
              borderImage: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[0]}) 1`,
            }}
          >
            <div className="wheel2" id="wheel2id"></div>
            <div className="win2line"></div>
            <div className="win2">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="30.000000pt" xHeight="30.000000pt" viewBox="0 0 30.000000 30.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)" fill="#ffffff3d" stroke="none">
                  <path d="M90 174 c-30 -26 -56 -55 -58 -65 -5 -27 4 -24 60 21 28 22 55 40 60 40 5 0 31 -18 57 -40 53 -45 61 -48 61 -21 0 14 -107 112 -122 111 -1 0 -28 -21 -58 -46z" />
                </g>
              </svg>
            </div>
          </div>
          <div className="LootboxComponent_block_open">
            <div className="contentLine" style={style1.background2}></div>
            <div className="LootboxComponent_price buttonSpin2 right" onClick={() => spinClick(false, undefined)} id="buttonSpin2" style={{ pointerEvents: "all" }}>
              <div className="content" style={style1.backgroundBtn}></div>
              <div className="LootboxComponent_price_position">
                <span style={{ position: "relative", opacity: 1 }}>{textOpen}</span>
                {/* <div className="lds-roller" style={{ display: 'none' }}><div></div><div></div><div></div><div></div></div> */}
                <div className="loaderOpen" id="loaderOpen" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div>
              </div>
            </div>
            <div className="LootboxComponent_price buttonSpin2 righttwo" onClick={undefined} id="buttonSpin3" style={{ pointerEvents: "all" }}>
              <div className="content righttwo"></div>
              {/* <div className="LootboxComponent_price_position righttwo">INCREASE THE CHANCES BY 100 $LUM</div> */}
            </div>
          </div>
        </div>
      </div>
      <Lates_your_loots colors={colors} setActiveMenuElement={setActiveMenuElement} stateReloadInfo={stateReloadInfo} setdatefromState={ChangeActiveMenuElement_setdatefrom} setDateFormTextState={ChangeActiveMenuElement_setDateFormText} lootboxaddress={lootboxAddress} open_reclaimed={bad_ticket_data_openAgain} trigger={trigger} />
    </div>
  );
};

export default Free_lootbox_2;
