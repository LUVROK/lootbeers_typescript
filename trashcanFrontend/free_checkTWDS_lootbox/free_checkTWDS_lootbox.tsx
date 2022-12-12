import "../../../App.css";
import "../../../fonts/fonts.css";
import { useEffect, useState, FC } from "react";
import $ from "jquery";
import JSConfetti from "js-confetti";
import "../../../animation.css";
import useRootConfigFetcher from "./../../hooks/useRootConfigFetcher";
import { RootConfig } from "../../../types/app_types";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import "../../loader.scss";
import axios from "axios";
import { FREE_TWDS_lootbox, OG_win_variants } from "../../../win_variants";
import { PublicKey } from "@solana/web3.js";
import { getBuyTicketAccounts, redeemTicket2 } from "../../../util";
import useLootboxProgram from "../../hooks/useLootboxProgram";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import "../../timer.scss";
import lootboxanimation from "../../../media/ezgif-3-cbc77fa118.gif";

import { Props, AlertState } from "../../interfaceLootbox/interfaceLootbox";
import "./free_checkTWDS_lootbox.scss";

import twitterapi from "../MainLootboxes/twitterapi";
import { useSearchParams } from "react-router-dom";
import solanapng from "../../../media/solanapng.webp";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import Lates_your_loots from "../../lates_your_loots/lates_your_loots";

const Free_checkTWDS_lootbox: FC<Props> = ({ onChange, setColor, setActiveMenuElement, picture, price, title, URLtitle, colors, text, win_variants, lootboxAddress }) => {
  const rootConfigFetcher = useRootConfigFetcher();
  const [rootConfig, setRootConfig] = useState<RootConfig | null>();
  const program = useLootboxProgram();
  const [textState, setTextState] = useState<String>("");
  const [stateReloadInfo, setstateReloadInfo] = useState<Boolean>(false);

  const [trigger, setTrigger] = useState(0);

  const [textStateonDS, setTextStateonDS] = useState<String>("check");
  const [textStateonTW, setTextStateonTW] = useState<String>("check");

  const [textState_About, settextState_About] = useState<String>("");
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const connection = useConnection();

  const [timeoutID, setTimeoutID] = useState<any>();

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

  const jsConfetti = new JSConfetti();
  const [textOpen, setTextOpen] = useState<String>(`OPEN ${price} SOL`);
  const [closeBlock, setCloseBlock] = useState<Boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dateFormText, setDateFormText] = useState<string>("");
  const [DateFrom, setdatefrom] = useState<string>("");

  useEffect(() => {
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
      });
    }

    initWheel2();
    function initWheel2() {
      var $wheel = $(".roulette-wrapper2 .wheel2"),
        row = "";
      row += "<div class='row'>";
      for (let i = 0; i < FREE_TWDS_lootbox.length; i++) {
        if (FREE_TWDS_lootbox[i].text === "0.5 SOL") {
          row += `  <div class='element2 f05solbackground' id='${FREE_TWDS_lootbox[i].text}'
                    ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        } else if (FREE_TWDS_lootbox[i].text === "0.25 SOL") {
          row += `  <div class='element2 f025solbackground' id='${FREE_TWDS_lootbox[i].text}'
                    ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        } else if (FREE_TWDS_lootbox[i].text === "0.1 SOL") {
          row += `  <div class='element2 f01solbackground' id='${FREE_TWDS_lootbox[i].text}'
                    ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        } else if (FREE_TWDS_lootbox[i].text === "0.05 SOL") {
          row += `  <div class='element2 f005solbackground' id='${FREE_TWDS_lootbox[i].text}'
                    ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        } else if (FREE_TWDS_lootbox[i].text === "0.02 SOL") {
          row += `  <div class='element2 f002solbackground' id='${FREE_TWDS_lootbox[i].text}'
                    ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        } else {
          row += `  <div class='element2' id='${FREE_TWDS_lootbox[i].text}'            ><img src=${solanapng} alt='' class="element2_img solanapng"/><div>${FREE_TWDS_lootbox[i].text}</div><\/div>`;
        }
      }
      row += "</div>";
      for (var x = 0; x < 29; x++) {
        $wheel.append(row);
      }
    }

    const elements2 = document.querySelectorAll(".imageLootbeers");
    if (elements2 !== null) {
      for (let i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener("load", function () {
          (elements2[i] as HTMLElement).style.height = "auto";
        });
      }
    }

    const filterTextMain = document.querySelector(".freelootbox");
    const LootEventBlurElement = document.querySelector(".LootEventBlurElement");

    if (getCookie("24980dfg27hdjijfnn22_DS") === "true" && getCookie("9485duie34ggjimg_TW") === "true") {
      (filterTextMain as HTMLElement).style.filter = "blur(0px)";
      (filterTextMain as HTMLElement).style.pointerEvents = "all";
      (LootEventBlurElement as HTMLElement).style.display = "none";
      const el5 = document.getElementById("buttonSpin2");
      if (el5 !== null) {
        el5.style.pointerEvents = "all";
      }
    }
    if (searchParams.get("code")) {
      if (searchParams.get("state") !== "twitter-state") {
        if (getCookie("24980dfg27hdjijfnn22_DS") === undefined) {
          getDataUserDS();
        } else {
          setTextStateonDS("DONE");
          const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
          if (checkBtnlootbox !== null) {
            (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
          }
          if (getCookie("9485duie34ggjimg_TW") === "true") {
            (filterTextMain as HTMLElement).style.filter = "blur(0px)";
            (filterTextMain as HTMLElement).style.pointerEvents = "all";
            (LootEventBlurElement as HTMLElement).style.display = "none";
            const el5 = document.getElementById("buttonSpin2");
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }
        }
      } else if (searchParams.get("state") === "twitter-state") {
        if (getCookie("9485duie34ggjimg_TW") === undefined) {
          getDataUserTW();
        } else {
          setTextStateonTW("DONE");
          const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
          if (checkBtnlootbox !== null) {
            (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
          }
          if (getCookie("24980dfg27hdjijfnn22_DS") === "true") {
            (filterTextMain as HTMLElement).style.filter = "blur(0px)";
            (filterTextMain as HTMLElement).style.pointerEvents = "all";
            (LootEventBlurElement as HTMLElement).style.display = "none";
            const el5 = document.getElementById("buttonSpin2");
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }
        }
      }
    }
    if (getCookie("24980dfg27hdjijfnn22_DS") === "true" && getCookie("9485duie34ggjimg_TW") === undefined) {
      setTextStateonDS("DONE");
      const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
      const checkBtnlootbox2 = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (checkBtnlootbox !== null && checkBtnlootbox2 !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
        (checkBtnlootbox2 as HTMLElement).style.pointerEvents = "all";
      }
      if (getCookie("9485duie34ggjimg_TW") === "true") {
        (filterTextMain as HTMLElement).style.filter = "blur(0px)";
        (filterTextMain as HTMLElement).style.pointerEvents = "all";
        (LootEventBlurElement as HTMLElement).style.display = "none";
        const el5 = document.getElementById("buttonSpin2");
        if (el5 !== null) {
          el5.style.pointerEvents = "all";
        }
      }
    } else if (getCookie("9485duie34ggjimg_TW") === "true" && getCookie("24980dfg27hdjijfnn22_DS") === undefined) {
      setTextStateonTW("DONE");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      const checkBtnlootbox2 = document.querySelector(".discordBlock .checkBtnlootbox");
      if (checkBtnlootbox !== null && checkBtnlootbox2 !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
        (checkBtnlootbox2 as HTMLElement).style.pointerEvents = "all";
      }
      if (getCookie("24980dfg27hdjijfnn22_DS") === "true") {
        (filterTextMain as HTMLElement).style.filter = "blur(0px)";
        (filterTextMain as HTMLElement).style.pointerEvents = "all";
        (LootEventBlurElement as HTMLElement).style.display = "none";
        const el5 = document.getElementById("buttonSpin2");
        if (el5 !== null) {
          el5.style.pointerEvents = "all";
        }
      }
    } else if (getCookie("24980dfg27hdjijfnn22_DS") === "true" && getCookie("9485duie34ggjimg_TW") === "true") {
      setTextStateonTW("DONE");
      setTextStateonDS("DONE");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (checkBtnlootbox !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
      }
      (filterTextMain as HTMLElement).style.filter = "blur(0px)";
      (filterTextMain as HTMLElement).style.pointerEvents = "all";
      (LootEventBlurElement as HTMLElement).style.display = "none";
      const el5 = document.getElementById("buttonSpin2");
      if (el5 !== null) {
        el5.style.pointerEvents = "all";
      }
    }
  }, []);

  function getCookie(name: String) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  async function getDataUserTW() {
    try {
      const loaderClose = document.querySelector(".twitterBlock .loaderOpen2");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (loaderClose !== null && checkBtnlootbox !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
      }

      const codeToken = await searchParams.get("code");
      if (codeToken) {
        const res: any = await axios.post(`https://lootbeers.com/twitter?code=${codeToken}&url=http://localhost:3000/free_lootbox/`, {});
        // console.log(codeToken);
        // console.log(res);
        localStorage.setItem("twitterIDwin32", res.data.id);

        if (res.data.liked === true && res.data.retweeted === true) {
          document.cookie = `9485duie34ggjimg_TW=true`;
          const filterTextMain = document.querySelector(".freelootbox");
          const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
          setTextStateonTW("DONE");
          if (getCookie("24980dfg27hdjijfnn22_DS") === "true") {
            (filterTextMain as HTMLElement).style.filter = "blur(0px)";
            (filterTextMain as HTMLElement).style.pointerEvents = "all";
            (LootEventBlurElement as HTMLElement).style.display = "none";
            const el5 = document.getElementById("buttonSpin2");
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }
          setAlertState({
            open: true,
            message: "success",
            severity: "success",
          });
        } else if (res.data.liked === false && res.data.retweeted === true) {
          setAlertState({
            open: true,
            message: "Like our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === true && res.data.retweeted === false) {
          setAlertState({
            open: true,
            message: "RT our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === false && res.data.retweeted === false) {
          setAlertState({
            open: true,
            message: "Like & RT our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        }

        if (loaderClose !== null && checkBtnlootbox !== null) {
          (loaderClose as HTMLElement).style.display = "none";
        }
      }
    } catch (e) {
      // console.log(e);
      const loaderClose = document.querySelector(".twitterBlock .loaderOpen2");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (loaderClose !== null && checkBtnlootbox !== null) {
        (loaderClose as HTMLElement).style.display = "none";
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
      }
      setTextStateonTW("check again");
      setAlertState({
        open: true,
        message: "unknown error",
        severity: "error",
      });
    }
  }

  async function getDataUserDS() {
    try {
      const loaderClose = document.querySelector(".discordBlock .loaderOpen2");
      const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
      setTextStateonDS("");
      if (loaderClose !== null && checkBtnlootbox !== null) {
        (loaderClose as HTMLElement).style.display = "block";
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
      }

      const accessToken = searchParams.get("code");
      const tokenType = searchParams.get("state");

      if (accessToken !== null) {
        const API_ENDPOINT = "https://discord.com/api/v10";
        const CLIENT_ID = "1037296170290130986";
        const CLIENT_SECRET = "NzgX8DXeb6KMxVw6aUiZC_zO2Ql28cfa";
        const REDIRECT_URI = "https://lootbeers.com/free_lootbox/";
        const grant_type = "authorization_code";

        const data = {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          code: accessToken,
          redirect_uri: REDIRECT_URI,
        };
        const response = await fetch(`https://discord.com/api/v10/oauth2/token`, {
          method: "POST",
          body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=${grant_type}&code=${accessToken}&redirect_uri=${REDIRECT_URI}`,
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        });
        const json = await response.json();
        let stateEM = false;

        fetch("https://discord.com/api/v9/users/@me/guilds", {
          headers: {
            authorization: `${json.token_type} ${json.access_token}`,
          },
        })
          .then((result) => result.json())
          .then((response) => {
            response.forEach((element: any) => {
              if (element.name === "LUMBEERS | LOOT BOXES" && stateEM === false) {
                stateEM = true;
              }
            });
            if (stateEM === true) {
              setTextStateonDS("DONE");
              if (loaderClose !== null && checkBtnlootbox !== null) {
                (loaderClose as HTMLElement).style.display = "none";
                (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
              }
              localStorage.setItem("discordIDwin32", "true");
              setAlertState({
                open: true,
                message: "success",
                severity: "success",
              });
              document.cookie = `24980dfg27hdjijfnn22_DS=true`;
              const filterTextMain = document.querySelector(".freelootbox");
              const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
              if (getCookie("9485duie34ggjimg_TW") === "true") {
                (filterTextMain as HTMLElement).style.filter = "blur(0px)";
                (filterTextMain as HTMLElement).style.pointerEvents = "all";
                (LootEventBlurElement as HTMLElement).style.display = "none";
                const el5 = document.getElementById("buttonSpin2");
                if (el5 !== null) {
                  el5.style.pointerEvents = "all";
                }
              }
            } else {
              setTextStateonDS("check again");
              if (loaderClose !== null && checkBtnlootbox !== null) {
                (loaderClose as HTMLElement).style.display = "none";
                (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
              }
              setAlertState({
                open: true,
                message: "you are not in the server",
                severity: "error",
              });
            }
          })
          .catch(console.error);
      }
    } catch (e: any) {
      const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
      const loaderClose = document.querySelector(".discordBlock .loaderOpen2");
      if (loaderClose !== null && checkBtnlootbox !== null) {
        (loaderClose as HTMLElement).style.display = "none";
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
      }
      setTextStateonDS("check again");
      setAlertState({
        open: true,
        message: "unknown error",
        severity: "error",
      });
    }
  }

  useEffect(() => {
    send();
  }, [wallet]);

  function getRandomArrayElement(arr: Array<number>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const spinClick = async () => {
    try {
      if (!wallet) {
        setAlertState({
          open: true,
          message: "Connect your wallet and sign the approval message",
          severity: "error",
        });
        return;
      }

      const filterTextMain = document.querySelector(".freelootbox");
      const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      const lcltwid = localStorage.getItem("twitterIDwin32");
      const lcldsbool = localStorage.getItem("twitterIDwin32");

      if (getCookie("24980dfg27hdjijfnn22_DS") === undefined || getCookie("9485duie34ggjimg_TW") === undefined || lcltwid === null || lcldsbool === null) {
        (filterTextMain as HTMLElement).style.filter = "blur(20px)";
        (filterTextMain as HTMLElement).style.pointerEvents = "none";
        (LootEventBlurElement as HTMLElement).style.display = "block";
        const el5 = document.getElementById("buttonSpin2");
        if (el5 !== null) {
          el5.style.pointerEvents = "none";
        }
        setAlertState({
          open: true,
          message: "Follow the conditions and try again",
          severity: "info",
        });
        return;
      }

      if (getCookie("2380ufjnikfo4183u4j") !== undefined || window.localStorage.getItem("2380ufjnikfo4183u4j") === "2") {
        setAlertState({
          open: true,
          message: "You have opened all the available rewards for now. Stay tuned in our Twitter for more Events & Giveaways!",
          severity: "info",
        });
        return;
      }

      const el5 = document.getElementById("buttonSpin2");
      if (el5 !== null) {
        el5.style.pointerEvents = "none";
      }

      const lds_roller = document.querySelector(".loaderOpen");
      const textOpenel = document.querySelector(".LootboxComponent_price_position");
      // setTextOpen("");
      if (lds_roller !== null && textOpenel !== null) {
        (lds_roller as HTMLElement).style.display = "block";
        (textOpenel as HTMLElement).style.position = "absolute";
        (textOpenel as HTMLElement).style.opacity = "0";
      }

      try {
        const pk = new PublicKey(lootboxAddress);

        if (!program || !rootConfig) {
          setAlertState({
            open: true,
            message: "A small problem, try again by reloading the page or deleting cookies(ctrl+shift+r)",
            severity: "error",
          });
          return;
        }
        const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);

        const id = await program.methods
          .buyLootboxTicket()
          .accountsStrict({
            ...accounts.accounts,
          })
          .signers([accounts.ticket])
          .rpc();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const i = await redeemTicket2(accounts.ticket.publicKey, lcltwid);

        setstateReloadInfo((prev) => !prev);

        if (getCookie("28unjji278jess") === "true") {
          document.cookie = "2380ufjnikfo4183u4j=2";
          window.localStorage.setItem("2380ufjnikfo4183u4j", "2");
        } else if (getCookie("9j929krjnhnu") === undefined) {
          document.cookie = "28unjji278jess=true";
        }

        const lds_roller = document.querySelector(".loaderOpen");
        const textOpenel = document.querySelector(".LootboxComponent_price_position");
        // setTextOpen("");
        if (lds_roller !== null && textOpenel !== null) {
          (lds_roller as HTMLElement).style.display = "none";
          (textOpenel as HTMLElement).style.position = "relative";
          (textOpenel as HTMLElement).style.opacity = "1";
        }
        // setTextOpen("OPEN");

        setAlertState({
          open: true,
          message: "Successful transaction",
          severity: "success",
        });
        const Array0: Array<number> = [0, 2];
        const Array1: Array<number> = [1, 9, 11];
        const Array2: Array<number> = [3, 5, 6];
        const Array3: Array<number> = [4, 7, 12];
        const Array4: Array<number> = [8];
        const Array5: Array<number> = [10];
        const Array6: Array<number> = [13];
        const ArrayMain: Array<number> = [0, 1, 2, 3, 4, 5, 6];
        let rendomNum: number;

        let rendomNum2 = i;
        if (Number(rendomNum2) === 0) {
          rendomNum = await getRandomArrayElement(Array0);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 1) {
          rendomNum = await getRandomArrayElement(Array1);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 2) {
          rendomNum = await getRandomArrayElement(Array2);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 3) {
          rendomNum = await getRandomArrayElement(Array3);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 4) {
          rendomNum = await getRandomArrayElement(Array4);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 5) {
          rendomNum = await getRandomArrayElement(Array5);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        } else if (Number(rendomNum2) === 6) {
          rendomNum = await getRandomArrayElement(Array6);
          settextState_About("");
          settextState_About(FREE_TWDS_lootbox[rendomNum].text);
          spinFREELootbox(rendomNum, rendomNum2);
          setTextState(`${FREE_TWDS_lootbox[rendomNum].text}`);
        }

        setTimeout(() => {
          if (el5 !== null) {
            el5.style.pointerEvents = "all";
          }
        }, 2000);
      } catch (e: any) {
        if ((e.response as any) !== undefined) {
          switch (e.response.data.title) {
            case "LOOTBOX_TIMEOUT":
              setAlertState({
                open: true,
                message: "Free OG Loot Box is available every 6 hours",
                severity: "info",
              });
              break;
            case "INSUFFICIENT_FUNDS":
              setAlertState({
                open: true,
                message: "You need to have at least 0.01 solana on your account",
                severity: "info",
              });
              break;
            case "LOOTBOX_NOT_FOUND":
              setAlertState({
                open: true,
                message: "LOOTBOX_NOT_FOUND",
                severity: "info",
              });
              break;
            case "LOOTBOX_LIMIT":
              setAlertState({
                open: true,
                message: "You have opened all the available rewards for now. Stay tuned in our Twitter for more Events & Giveaways!",
                severity: "info",
              });
              break;
            default:
              setAlertState({
                open: true,
                message: "The problem is on the server, contact us",
                severity: "error",
              });
              break;
          }
          // setTextOpen("OPEN");
          const lds_roller = document.querySelector(".loaderOpen");
          const textOpenel = document.querySelector(".LootboxComponent_price_position");
          if (lds_roller !== null && textOpenel !== null) {
            (lds_roller as HTMLElement).style.display = "none";
            (textOpenel as HTMLElement).style.position = "relative";
            (textOpenel as HTMLElement).style.opacity = "1";
          }
          setTimeout(() => {
            if (el5 !== null) {
              el5.style.pointerEvents = "all";
            }
          }, 2000);
        }
        return;
      }
    } catch (e: any) {
      try {
        if (e.response.data.title) {
          switch (e.response.data.title) {
            case "TICKET_NOT_REDEEMED":
              setAlertState({
                open: true,
                message: "TICKET_NOT_REDEEMED",
                severity: "error",
              });
              break;
            case "BAD_TICKET_DATA":
              setAlertState({
                open: true,
                message: "BAD_TICKET_DATA",
                severity: "error",
              });
              break;
            case "LOOTBOX_NOT_FOUND":
              setAlertState({
                open: true,
                message: "LOOTBOX_NOT_FOUND",
                severity: "error",
              });
              break;
            default:
              setAlertState({
                open: true,
                message: "The problem is on the server, contact us",
                severity: "error",
              });
              break;
          }
        }
      } catch (e) {}
      const lds_roller = document.querySelector(".loaderOpen");
      // setTextOpen("OPEN");
      const textOpenel = document.querySelector(".LootboxComponent_price_position");
      if (lds_roller !== null && textOpenel !== null) {
        (lds_roller as HTMLElement).style.display = "none";
        (textOpenel as HTMLElement).style.position = "relative";
        (textOpenel as HTMLElement).style.opacity = "1";
      }
      setTimeout(() => {
        const el = document.getElementById("buttonSpin2");
        if (el !== null) {
          el.style.pointerEvents = "all";
        }
      }, 2000);
    }
  };

  function spinFREELootbox(roll: number, numberAnimation: number) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    setCloseBlock(false);
    let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
    let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
    let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
    let lootboxanimation = document.querySelector(".lootboxanimation");
    let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
    var $wheel = $(".roulette-wrapper2 .wheel2"),
      order = [7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6],
      position = order.indexOf(roll);

    if (document.body.clientWidth > 910) {
      var rows = 6,
        card = 150 + 0.75 * 2,
        landingPosition = rows * 14 * card + position * card;
      var randomize = Math.floor(Math.random() * 150) - 150 / 2 + 75;
    } else if (document.body.clientWidth > 710) {
      var rows = 6,
        card = 100 + 0.75 * 2,
        landingPosition = rows * 14 * card + position * card;
      var randomize = Math.floor(Math.random() * 100) - 100 / 2 + 50;
    } else {
      var rows = 6,
        card = 75 + 0.75 * 2,
        landingPosition = rows * 14 * card + position * card;
      var randomize = Math.floor(Math.random() * 75) - 75 / 2 + 37.5;
    }

    landingPosition = landingPosition + randomize;

    var object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    $wheel.css({
      "transition-timing-function": "cubic-bezier(0," + object.x + "," + object.y + ",1)",
      "transition-duration": "8s",
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
        if (numberAnimation >= 1) {
          (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 1.03s ease-in-out";
        } else {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
        }
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 79.53s";
        setTimeout(() => {
          if (numberAnimation >= 1) {
            (lootboxanimation as HTMLElement).style.display = "block";
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 1.03s";
          }
        }, 500);
        setTimeout(() => {
          if (numberAnimation >= 1) {
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
            (lootboxanimation as HTMLElement).style.display = "none";
          }
          setCloseBlock(true);
          let massColor: Array<string> = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];
          if (numberAnimation >= 1) {
            jsConfetti.addConfetti({
              confettiNumber: 100,
              confettiColors: massColor,
            });
          }
        }, 1530);
        setTimeout(() => {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
        }, 1530);
      }
    }, 8 * 1000);

    setTimeout(function () {
      //     getYourLoots();
      //     getAllLoots();
    }, 10 * 1000);

    const timeout = setTimeout(function () {
      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        document.body.style.overflowY = "scroll";
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
    if (closeBlock === true) {
      let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
      let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
      let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
      let lootboxanimation = document.querySelector(".lootboxanimation");
      let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
      (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
      (lootboxanimation as HTMLElement).style.display = "none";
      (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 0s";
      (lootboxAnimationImage as HTMLElement).style.opacity = "0";
      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        document.body.style.overflowY = "scroll";
        (AnimationLootbeers_background_block_text as HTMLElement).style.opacity = "0";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.opacity = "0";
        (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 0s";
        (AnimationLootbeers as HTMLElement).style.background = "#00000000";
        (AnimationLootbeers as HTMLElement).style.display = "none";
        // getYourLoots();
        // getAllLoots();
      }
    }
  };

  const OpenAgain = () => {
    closeAnimationLootbeers();
    setTimeout(() => {
      spinClick();
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

  const bad_ticket_data_openAgain = (value: PublicKey, i: string) => {
    // console.log(value);
    // spinClick(true);
  };

  return (
    <div className="LootboxComponent" id="LootboxComponentID" style={{ overflowY: "hidden" }}>
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
                <img src={solanapng} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} />
                <br />
                {textState_About}
                <br />
                <div className="header_a_block"></div>
              </div>
              <div className="buttons_AnimationLootbeers">
                {textState === OG_win_variants[1].text || textState === OG_win_variants[0].text ? (
                  <a className="header_a supportTextSvg supportTextSvgBtn tweetBtn" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: "0px" }}>
                    DISCORD
                  </a>
                ) : (
                  <a></a>
                )}
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
        <div className="LootEventBlurElement" style={{ display: "block" }}>
          <div className="LootboxComponent_stat">
            <div className="LootboxComponent_stat_text discordBlock">
              <div className="textCheckLootEvent">
                <span>join our&nbsp;</span>
                <a href="https://discord.gg/lumbeers" target={"_blank"}>
                  DISCORD
                </a>
              </div>
              <a
                onClick={() => {
                  document.cookie = `statusActiveSocialBtnClickDS333=discord`;
                }}
                href="https://discord.com/oauth2/authorize?response_type=code&client_id=1037296170290130986&scope=identify%20guilds.join%20guilds&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Flootbeers.com%2Ffree_lootbox%2F"
                className="checkBtnlootbox"
                style={{ pointerEvents: "all" }}
              >
                {textStateonDS}
                <div className="loaderOpen2" id="loaderOpen2" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div>
              </a>
            </div>
            <div className="LootboxComponent_stat_text twitterBlock">
              <div className="textCheckLootEvent">
                <span>FOLLOW our&nbsp;</span>
                <a href="https://twitter.com/lumbeers" target={"_blank"}>
                  TWITTER
                </a>
                <span>
                  <br />
                  like and retweet the&nbsp;
                </span>
                <a href="https://twitter.com/lumbeers/status/1589271851230179330?t=iuOqU-CCmdjoyhLOjPG7fg&s=19" target={"_blank"}>
                  pinned tweet
                </a>
              </div>
              <a
                href={twitterapi(URLtitle)}
                className="checkBtnlootbox"
                style={{ pointerEvents: "all" }}
                onClick={() => {
                  document.cookie = `statusActiveSocialBtnClickTW333=twitter`;
                }}
              >
                {textStateonTW}
                <div className="loaderOpen2" id="loaderOpen2" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div>
              </a>
            </div>
          </div>
        </div>
        <div className="LootboxBacdrop freelootbox" style={{ filter: "blur(20px)", pointerEvents: "none" }}>
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
            style={{
              border: `2px solid ${colors[1]}`,
              borderImage: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[0]}) 1`,
            }}
          >
            <div className="wheel2"></div>
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
            <div className="LootboxComponent_price buttonSpin2 right" onClick={spinClick} id="buttonSpin2" style={{ pointerEvents: "none" }}>
              <div className="content" style={style1.backgroundBtn}></div>
              <div className="LootboxComponent_price_position" style={{ position: "relative", opacity: 1 }}>
                {textOpen}
                <div className="loaderOpen" id="loaderOpen" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div>
              </div>
            </div>
            <div className="LootboxComponent_price buttonSpin2 righttwo" onClick={undefined} id="buttonSpin3" style={{ pointerEvents: "all" }}>
              <div className="content righttwo"></div>
            </div>
          </div>
        </div>
      </div>
      <Lates_your_loots colors={colors} setActiveMenuElement={setActiveMenuElement} stateReloadInfo={stateReloadInfo} setdatefromState={ChangeActiveMenuElement_setdatefrom} setDateFormTextState={ChangeActiveMenuElement_setDateFormText} lootboxaddress={lootboxAddress} open_reclaimed={bad_ticket_data_openAgain} trigger={trigger} />
    </div>
  );
};

export default Free_checkTWDS_lootbox;
