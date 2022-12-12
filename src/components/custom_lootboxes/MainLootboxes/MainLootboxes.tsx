import "../../../App.css";
import "../../../fonts/fonts.css";
import React, { useEffect, useState, useRef, FC, createRef } from "react";
import $ from "jquery";
import JSConfetti from "js-confetti";
import "../../../animation.css";
import useLootboxProgram from "../../hooks/useLootboxProgram";
import useRootConfigFetcher from "../../hooks/useRootConfigFetcher";
import { RootConfig } from "../../../types/app_types";
import { getBuyTicketAccounts, redeemTicket, redeemTicket2 } from "../../../util";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import solanapng from "../../../media/solanapng.webp";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import "./../../loader.scss";
import { whitelist_win_variants } from "../../../win_variants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../../timer.scss";
import lootboxanimation from "../../../media/ezgif-3-cbc77fa118.gif";
import "./MainLootboxes.scss";
import { Props, AlertState, LootYour, LootAll, OgChance, CustomizedState, RandomMainLootbox } from "../../interfaceLootbox/interfaceLootbox";
import randomorgimgexamples from "../../../media/randomORGexamples.png";
import randomorgimg from "../../../media/randomORG.png";
import { Link } from "react-router-dom";
import nftimg from "../../../media/whitelbxNft.webp";

import ticket2_1 from "../../../media/ticket2_1.webp";
import ticket2_2 from "../../../media/ticket2_2.webp";
import ticket2_3 from "../../../media/ticket2_3.webp";
import ticket2_4 from "../../../media/whiteList.png";
import VoteLumbeer from "./MainLbxLumbeerVOTE";

import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import twitterapi from "./twitterapi";
import Lates_your_loots from "../../lates_your_loots/lates_your_loots";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Timer2 = ({ deadline = new Date().toString() }) => {
  const parsedDeadline = React.useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = React.useState(parsedDeadline - Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => setTime(parsedDeadline - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [parsedDeadline]);
  return (
    <div className="timerMini">
      {time / DAY >= 0 && (time / HOUR) % 24 >= 0 && (time / MINUTE) % 60 >= 0 && (time / SECOND) % 60 >= 0 ? (
        Object.entries({
          d: time / DAY,
          h: (time / HOUR) % 24,
          m: (time / MINUTE) % 60,
          s: (time / SECOND) % 60,
        }).map(([label, value]) => (
          <div key={label} className="Timer_boxMini">
            <div className="boxMini" role="timerMini" aria-atomic="true">
              {label === "s" ? (
                <p className="Timer_box_text_s_Mini">{`${Math.floor(value)}`.padStart(2, "0")}</p>
              ) : label === "m" ? (
                <p className="Timer_box_text_m_Mini">{`${Math.floor(value)}`.padStart(2, "0")}:</p>
              ) : label === "h" ? (
                <p className="Timer_box_text_h_Mini">{`${Math.floor(value)}`.padStart(2, "0")}:</p>
              ) : label === "d" ? (
                <p className="Timer_box_text_d_Mini" style={{ display: "none" }}>
                  {`${Math.floor(value)}`.padStart(2, "0")}:
                </p>
              ) : (
                <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

const MainLootboxes: FC<Props> = ({ onChange, setColor, setActiveMenuElement, picture, price, title, URLtitle, colors, text, win_variants, lootboxAddress }) => {
  const rootConfigFetcher = useRootConfigFetcher();
  const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;
  const [rootConfig, setRootConfig] = useState<RootConfig | null>();
  const connection = useConnection();

  const [textState, setTextState] = useState<String>("");
  const [textState_About, settextState_About] = useState<String>("");
  const [textState_About_othersText, settextState_About_othersText] = useState<String>("");
  const { publicKey, signMessage, signTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const [dataStat, setDataStat] = useState<Array<Object>>();
  const [mylootsactiveElement, setMyLootsActiveElement] = useState<Number>(2);
  const [answer, setAnswer] = useState("");
  const [timeoutID, setTimeoutID] = useState<any>();

  const [random_main_lootbox, setrandom_main_lootbox] = useState<RandomMainLootbox[]>(win_variants);
  const [ALLrandom_main_lootbox, setALLrandom_main_lootbox] = useState<Array<Array<RandomMainLootbox>>>([]);
  const [ALLrandom_main_lootboxNumbers, setALLrandom_main_lootboxNumbers] = useState<Array<number>>([]);
  const [massStatusreturnchecker, setmassStatusreturnchekers] = useState<number>(0);
  const [timeoutIDAnime, setTimeoutIDAnime] = useState<any>();
  const [opentooptip, setopentooltip] = useState<Boolean>(true);
  const [stateOpensTickets, setStateOpensTickets] = useState<Array<string>>([]);
  const [timeoutIDtrigger, setTimeoutIDtrigger] = useState<any>();

  const [stateReloadInfo, setstateReloadInfo] = useState<Boolean>(false);
  const [textStateonDS, setTextStateonDS] = useState<String>("check");
  const [textStateonTW, setTextStateonTW] = useState<String>("check");

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [trigger, setTrigger] = useState(0);

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
  const [textOpen, setTextOpen] = useState<String>(`OPEN ${price} SOL`);
  const scrollerRef = createRef<HTMLDivElement>();
  const scrollerRef2 = createRef<HTMLDivElement>();

  const [dataGetResultYourLoots, setdataGetResultYourLoots] = useState<Array<LootYour>>();
  const [dataGetAllLoots, setdataGetAllLoots] = useState<Array<LootAll>>();
  const [dataGetOgChance, setdataGetOgChance] = useState<OgChance>();
  const [DateFrom, setdatefrom] = useState<string>("");

  const spinNymber2 = useRef<Number | null>(null);
  const [ticketff, setTicketff] = useState<PublicKey | undefined>();

  const [dateFormText, setDateFormText] = useState("");

  const [imageStatecong, setImageStateCong] = useState<number>(2);

  const [closeBlock, setCloseBlock] = useState<Boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [massStatus, setMassStatus] = useState<Array<any>>([]);
  const [massStatusreturn, setMassStatusreturn] = useState<Array<any>>([]);

  function mixarr(arr: Array<any>) {
    return arr
      .map((i) => [Math.random(), i])
      .sort()
      .map((i) => i[1]);
  }

  const getOgChance = async () => {
    try {
      if (publicKey !== null) {
        let mass = [];
        const res = await axios.get<OgChance>(`${apiUrl}/api/v1/status/wlChance`, {});
        setdataGetOgChance(res.data);
      }
    } catch (e) {}
  };

  function initWheel2() {
    setALLrandom_main_lootbox([]);

    let $wheel = $(".roulette-wrapper2 .wheel2"),
      row = "";
    let indexID = -1;

    for (var x = 0; x < 5; x++) {
      row += "<div class='row MainLBS'>";

      let chengedMass = mixarr(random_main_lootbox);

      for (let i = 0; i < chengedMass.length; i++) {
        if (chengedMass[i].text === "0X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "0.5X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "1X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "2X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "5X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "15X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "30X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "60X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLD'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "120X") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLD'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Lumbeer NFT") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLD'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Free Wooden Loot Box") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXShit'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Free Carbon Loot Box") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Cheap NFT") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXShit'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Mid NFT") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "Expensive NFT") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLD'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "2 $LUM") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXShit'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "5 $LUM") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "10 $LUM") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilver'></div><div>${chengedMass[i].text}</div><\/div>`;
        } else if (chengedMass[i].text === "PopHeadz NFT") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXShit'></div><div><img src=${nftimg} alt='' class="solanaPng imageLootbeers freeMint"/></div><div>PopHeadz NFT</div><\/div>`;
        } else if (chengedMass[i].text === "Free Mint") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLDcenter'></div><img src=${ticket2_1} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (chengedMass[i].text === "OG") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXSilvercenter'></div><img src=${ticket2_2} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (chengedMass[i].text === "NOTHING") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX'></div><img src=${ticket2_3} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (chengedMass[i].text === "Whitelist") {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXGOLDcenter'></div><img src=${ticket2_4} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (chengedMass[i].text.includes("SOL") === true) {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX ${chengedMass[i].text === "1 SOL" ? "LTBXGOLD" : chengedMass[i].text === "0.5 SOL" || chengedMass[i].text === "0.25 SOL" ? "LTBXSilver" : chengedMass[i].text === "0.1 SOL" ? "LTBXShit" : ""}'></div><img src=${solanapng} alt='' class="solanaPng imageLootbeers freeMint"/><div>${chengedMass[i].text}</div><\/div>`;
        } else {
          row += `  <div class='element2 whiteLTBX' id='${chengedMass[i].text}'><div class='background_whiteLTBX LTBXShit'></div><div>${chengedMass[i].text}</div><\/div>`;
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
    }
    for (var x = 0; x < 29; x++) {
      $wheel.append(row);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveMenuElement(0);

    if (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" || title === "FREE LOOTBOX") {
      setTextOpen("FREE");
    }

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

    const filterTextMain = document.querySelector(".LootboxBacdrop");
    const LootEventBlurElement = document.querySelector(".LootEventBlurElement");

    if (title !== "FREE LOOTBOX" && title !== "LUMBEER LOOTBOX") {
      (filterTextMain as HTMLElement).style.filter = "blur(0px)";
      (filterTextMain as HTMLElement).style.pointerEvents = "all";
      (LootEventBlurElement as HTMLElement).style.display = "none";
      const el5 = document.getElementById("buttonSpin2");
      if (el5 !== null) {
        el5.style.pointerEvents = "all";
      }
      return;
    }

    if (getCookie("2fo649003ff4frnn22_DS") === "true" && getCookie("9483894ggjimg_TW") === "true") {
      // (filterTextMain as HTMLElement).style.filter = "blur(0px)";
      // (filterTextMain as HTMLElement).style.pointerEvents = "all";
      // (LootEventBlurElement as HTMLElement).style.display = "none";
      // const el5 = document.getElementById("buttonSpin2");
      // if (el5 !== null) {
      //   el5.style.pointerEvents = "all";
      // }
    }
    if (searchParams.get("code")) {
      if (searchParams.get("state") !== "twitter-state") {
        if (getCookie("2fo649003ff4frnn22_DS") === undefined) {
          getDataUserDS();
        } else {
          setTextStateonDS("DONE");
          const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
          if (checkBtnlootbox !== null) {
            (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
          }
          if (getCookie("9483894ggjimg_TW") === "true") {
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
        if (getCookie("9483894ggjimg_TW") === undefined) {
          getDataUserTW();
        } else {
          setTextStateonTW("DONE");
          const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
          if (checkBtnlootbox !== null) {
            (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
          }
          if (getCookie("2fo649003ff4frnn22_DS") === "true") {
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
    if (getCookie("2fo649003ff4frnn22_DS") === "true" && getCookie("9483894ggjimg_TW") === undefined) {
      setTextStateonDS("DONE");
      const checkBtnlootbox = document.querySelector(".discordBlock .checkBtnlootbox");
      const checkBtnlootbox2 = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (checkBtnlootbox !== null && checkBtnlootbox2 !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
        (checkBtnlootbox2 as HTMLElement).style.pointerEvents = "all";
      }
      if (getCookie("9483894ggjimg_TW") === "true") {
        (filterTextMain as HTMLElement).style.filter = "blur(0px)";
        (filterTextMain as HTMLElement).style.pointerEvents = "all";
        (LootEventBlurElement as HTMLElement).style.display = "none";
        const el5 = document.getElementById("buttonSpin2");
        if (el5 !== null) {
          el5.style.pointerEvents = "all";
        }
      }
    } else if (getCookie("9483894ggjimg_TW") === "true" && getCookie("2fo649003ff4frnn22_DS") === undefined) {
      setTextStateonTW("DONE");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      const checkBtnlootbox2 = document.querySelector(".discordBlock .checkBtnlootbox");
      if (checkBtnlootbox !== null && checkBtnlootbox2 !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
        (checkBtnlootbox2 as HTMLElement).style.pointerEvents = "all";
      }
      if (getCookie("2fo649003ff4frnn22_DS") === "true") {
        (filterTextMain as HTMLElement).style.filter = "blur(0px)";
        (filterTextMain as HTMLElement).style.pointerEvents = "all";
        (LootEventBlurElement as HTMLElement).style.display = "none";
        const el5 = document.getElementById("buttonSpin2");
        if (el5 !== null) {
          el5.style.pointerEvents = "all";
        }
      }
    } else if (getCookie("2fo649003ff4frnn22_DS") === "true" && getCookie("9483894ggjimg_TW") === "true") {
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

  useEffect(() => {
    // let n = massStatus.length;
    // let k = Number((massStatus.length / 2).toFixed(0));
    // const newArr = splitArr(massStatus, k, n);
    // setMassStatusreturn(newArr);
    // if (massStatusreturnchecker <= 1) {
    //   let n = massStatus.length;
    //   let k = Number((massStatus.length / 2).toFixed(0));
    //   const newArr = splitArr(massStatus, k, n);
    //   setMassStatusreturn(newArr);
    //   setmassStatusreturnchekers((prev) => (prev = prev + 1));
    // }

    if (massStatusreturnchecker <= 1) {
      let n = massStatus.length;
      let k = Number((massStatus.length / 2).toFixed(0));
      const newArr = splitArr(massStatus, k, n);
      setMassStatusreturn(newArr);
      setmassStatusreturnchekers((prev) => (prev = prev + 1));
    }
  }, [massStatus]);

  useEffect(() => {
    send();
    getOgChance();
  }, [wallet]);

  function getCookie(name: String) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function getRandomArrayElement(arr: Array<number>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function logMemo(message: string) {
    if (!wallet || !signMessage) {
      setAlertState({
        open: true,
        message: "Connect your wallet and sign the approval message",
        severity: "error",
      });
      return;
    }
    if (publicKey === null) {
      return;
    }
    const encodedMessage = new TextEncoder().encode(message.replaceAll("\\r", "\r").replaceAll("\\n", "\n"));
    const signedMessage = await signMessage(encodedMessage);
    return Buffer.from(signedMessage).toString("base64");
  }

  const spinClick = async (ticket: Boolean, ticketData: PublicKey | undefined) => {
    try {
      let Array0SOL: Array<RandomMainLootbox> = [];
      let Array0_02SOL: Array<RandomMainLootbox> = [];
      let Array0_05SOL: Array<RandomMainLootbox> = [];
      let Array0_1SOL: Array<RandomMainLootbox> = [];
      let Array0_25SOL: Array<RandomMainLootbox> = [];
      let Array0_5SOL: Array<RandomMainLootbox> = [];
      let Array1SOL: Array<RandomMainLootbox> = [];

      let Array0X: Array<RandomMainLootbox> = [];
      let Array2LUM: Array<RandomMainLootbox> = [];
      let Array5LUM: Array<RandomMainLootbox> = [];
      let Array10LUM: Array<RandomMainLootbox> = [];
      let Array05X: Array<RandomMainLootbox> = [];
      let Array1X: Array<RandomMainLootbox> = [];
      let Array2X: Array<RandomMainLootbox> = [];
      let Array5X: Array<RandomMainLootbox> = [];
      let Array15X: Array<RandomMainLootbox> = [];
      let ArrayLumbeerNFT: Array<RandomMainLootbox> = [];
      let ArrayCheapNFT: Array<RandomMainLootbox> = [];
      let ArrayMidNFT: Array<RandomMainLootbox> = [];
      let ArrayExpensiveNFT: Array<RandomMainLootbox> = [];
      let Array30X: Array<RandomMainLootbox> = [];
      let Array60X: Array<RandomMainLootbox> = [];
      let Array120X: Array<RandomMainLootbox> = [];
      let ArrayFreeWooden: Array<RandomMainLootbox> = [];
      let ArrayFreeCarbon: Array<RandomMainLootbox> = [];

      let ArrayNOTHING: Array<RandomMainLootbox> = [];
      let ArrayFreeMint: Array<RandomMainLootbox> = [];
      let ArrayOG: Array<RandomMainLootbox> = [];
      let ArrayWhitelist: Array<RandomMainLootbox> = [];

      let Array0SOLNumbers: Array<number> = [];
      let Array0_02SOLNumbers: Array<number> = [];
      let Array0_05SOLNumbers: Array<number> = [];
      let Array0_1SOLNumbers: Array<number> = [];
      let Array0_25SOLNumbers: Array<number> = [];
      let Array0_5SOLNumbers: Array<number> = [];
      let Array1SOLNumbers: Array<number> = [];

      let Array0XNumbers: Array<number> = [];
      let Array2LUMNumbers: Array<number> = [];
      let Array5LUMNumbers: Array<number> = [];
      let Array10LUMNumbers: Array<number> = [];
      let Array05XNumbers: Array<number> = [];
      let Array1XNumbers: Array<number> = [];
      let Array2XNumbers: Array<number> = [];
      let Array5XNumbers: Array<number> = [];
      let Array15XNumbers: Array<number> = [];
      let ArrayLumbeerNFTNumbers: Array<number> = [];
      let ArrayCheapNFTNumbers: Array<number> = [];
      let ArrayMidNFTNumbers: Array<number> = [];
      let ArrayExpensiveNFTNumbers: Array<number> = [];
      let Array30XNumbers: Array<number> = [];
      let Array60XNumbers: Array<number> = [];
      let Array120XNumbers: Array<number> = [];
      let ArrayFreeWoodenNumbers: Array<number> = [];
      let ArrayFreeCarbonNumbers: Array<number> = [];

      let ArrayNOTHINGNumbers: Array<number> = [];
      let ArrayFreeMintNumbers: Array<number> = [];
      let ArrayOGNumbers: Array<number> = [];
      let ArrayWhitelistNumbers: Array<number> = [];

      if (title === "LUMBEER LOOTBOX" || title === "FREE LOOTBOX") {
        setAlertState({
          open: true,
          message: "SOLD OUT",
          severity: "info",
        });
        return;
      }

      const lds_roller = document.querySelector(".loaderOpen");
      const textOpenel = document.querySelector(".LootboxComponent_price_position span");
      if (lds_roller !== null && textOpenel !== null) {
        // (lds_roller as HTMLElement).style.display = "block";
        (textOpenel as HTMLElement).style.position = "absolute";
        (textOpenel as HTMLElement).style.opacity = "0";
      }

      const el = document.getElementById("buttonSpin2");
      if (el !== null) {
        el.style.pointerEvents = "none";
      }

      // console.log(getCookie("fgiwf333666dksf4"));

      // if (title === "FREE LOOTBOX" && getCookie("fgiwf333666dksf4") === undefined) {
      //   setAlertState({
      //     open: true,
      //     message: "you didn't open the Lumbeer loot box",
      //     severity: "info",
      //   });
      //   return;
      // }

      const pk = new PublicKey(lootboxAddress);
      const lcltwid = localStorage.getItem("twitterIDwin32");
      const lcldsbool = localStorage.getItem("twitterIDwin32");

      if (!program || !rootConfig) {
        setAlertState({
          open: true,
          message: "A small problem, try again by reloading the page or deleting cookies",
          severity: "error",
        });
        return;
      }

      let iTicket: number;

      for (let i = 0; i < stateOpensTickets.length; i++) {
        if (ticketData !== undefined) {
          if (stateOpensTickets[i] === ticketData.toBase58()) {
            setAlertState({
              open: true,
              message: "Ticket is already open",
              severity: "info",
            });
            return;
          }
        }
      }

      if (getCookie(`${ticketData}`) === "true" || getCookie(`${ticketData}`) !== undefined) {
        setAlertState({
          open: true,
          message: "Ticket is already open",
          severity: "info",
        });
        return;
      }

      const filterTextMain = document.querySelector(".freelootbox");
      const LootEventBlurElement = document.querySelector(".LootEventBlurElement");

      // if (wallet?.publicKey.toBase58() !== "8z6VP284SXF9ZEsWXXZEmT7Y31tB278KR6NXKrSLv8dw" || wallet?.publicKey.toBase58() !== "86nVRHqtpzYJLwEi37ckeKft2yK454LX8UG2oUkgFpPt" || wallet?.publicKey.toBase58() !== "FsX9Q7pizoSE7syUQHUobhq6DmseRRLfrns6Xm9Tvmqi") {
      if (title === "FREE LOOTBOX" && (getCookie("2fo649003ff4frnn22_DS") === undefined || getCookie("9483894ggjimg_TW") === undefined || lcltwid === null || lcldsbool === null)) {
        if (filterTextMain !== null) {
          (filterTextMain as HTMLElement).style.filter = "blur(20px)";
          (filterTextMain as HTMLElement).style.pointerEvents = "none";
        }
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
      // }

      // if (wallet?.publicKey.toBase58() !== "8z6VP284SXF9ZEsWXXZEmT7Y31tB278KR6NXKrSLv8dw" || wallet?.publicKey.toBase58() !== "86nVRHqtpzYJLwEi37ckeKft2yK454LX8UG2oUkgFpPt" || wallet?.publicKey.toBase58() !== "FsX9Q7pizoSE7syUQHUobhq6DmseRRLfrns6Xm9Tvmqi") {
      if (wallet?.publicKey.toBase58() !== "FsX9Q7pizoSE7syUQHUobhq6DmseRRLfrns6Xm9Tvmqi" && title === "FREE LOOTBOX" && (getCookie("2380u48895kfo4183u4j") !== undefined || window.localStorage.getItem("2380u48895kfo4183u4j") === "2")) {
        setTimeout(() => {
          if (el5 !== null) {
            el5.style.pointerEvents = "all";
          }
        }, 2000);
        setAlertState({
          open: true,
          message: "You have opened all the available rewards for now. Stay tuned in our Twitter for more Events & Giveaways!",
          severity: "info",
        });
        return;
      }
      // }

      if (title === "FREE LOOTBOX" || title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") {
        setTextOpen(`Processing...`);
      } else {
        setTextOpen(`Processing...`);
      }

      let redult: any;
      let res: any;
      const ArrayRandom: Array<number> = title === "Wooden Loot Box" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : title === "Carbon Loot Box" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] : title === "Magnetic Loot Box" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] : title === "FREE LOOTBOX" ? [0, 1, 2, 3, 4, 5, 6] : title === "OG LOOTBOX" ? [0, 1, 2] : title === "LUMBEER LOOTBOX" ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let rendomNum: number = 0;
      let rendomNum2: any;

      // OG LOOTBOX
      if (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") {
        const redult = await logMemo(`Lootbeers wants you to sign this transaction with your Solana account: ${publicKey?.toBase58()}

Click "Sign" or "Approve" only means you have proved you are owner of this wallet.

This exact Loot Box is functioning off-chain, which means this request will not trigger any transaction or cost you anything.
Click approve if you are real OG mfer and good luck to you!

If you read through this, fuck... Why are you still here, open the damn box
                  `);

        const res = await axios.post(`${apiUrl}/api/v1/ticket/redeem`, {
          ticketAddress: "LumwEDLUuPJLJGo92QS4SQogDTwsXbyngGrbBt4qSdE",
          wallet: publicKey?.toBase58(),
        });

        // rendomNum2 = await getRandomArrayElement(ArrayRandom);
        rendomNum2 = res.data.id; // тут res.data.id
        // console.log(win_variants[rendomNum2].text);
        // setImageStateCong(res.data.id);

        settextState_About(win_variants[rendomNum2].text);
        if (win_variants[rendomNum2].text === "OG" || win_variants[rendomNum2].text === "Whitelist" || win_variants[rendomNum2].text === "Free Mint") {
          settextState_About_othersText("Congratulations! Open the support ticket in our Discord and send your wallet address, the prize will be approved within 24 hours");
        } else {
          settextState_About_othersText("");
        }
        setImageStateCong(rendomNum2);
      } else if (title === "FREE LOOTBOX") {
        if (ticketData === undefined) {
          const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);
          setTicketff(accounts.ticket.publicKey);
          const id = await program.methods
            .buyLootboxTicket()
            .accountsStrict({
              ...accounts.accounts,
            })
            .signers([accounts.ticket])
            .rpc();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (lcltwid === null) {
            setAlertState({
              open: true,
              message: "Fulfill all the conditions and try again",
              severity: "info",
            });
            return;
          }
          rendomNum2 = await redeemTicket2(accounts.ticket.publicKey, lcltwid);
          if (getCookie("28unjji278jess38995") === "true") {
            document.cookie = "2380u48895kfo4183u4j=2";
            window.localStorage.setItem("2380u48895kfo4183u4j", "2");
          } else if (getCookie("9j929krjnhnu3332") === undefined) {
            document.cookie = "28unjji278jess38995=true";
          }
          settextState_About(win_variants[rendomNum2].text);
          if (timeoutIDtrigger) {
            clearTimeout(timeoutIDtrigger);
          }
        } else {
          if (lcltwid === null) {
            setAlertState({
              open: true,
              message: "Fulfill all the conditions and try again",
              severity: "info",
            });
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
          rendomNum2 = await redeemTicket2(ticketData, lcltwid);
          if (getCookie("28unjji278jess38995") === "true") {
            document.cookie = "2380u48895kfo4183u4j=2";
            window.localStorage.setItem("2380u48895kfo4183u4j", "2");
          } else if (getCookie("9j929krjnhnu3332") === undefined) {
            document.cookie = "28unjji278jess38995=true";
          }
          settextState_About(win_variants[rendomNum2].text);

          if (timeoutIDtrigger) {
            clearTimeout(timeoutIDtrigger);
          }
          setStateOpensTickets((prev) => [...prev, ticketData.toBase58()]);
          document.cookie = `${ticketData}=true`;
        }

        // if (lcltwid === null) {
        //   setAlertState({
        //     open: true,
        //     message: "Fulfill all the conditions and try again",
        //     severity: "info",
        //   });
        //   return;
        // }
        // rendomNum2 = await redeemTicket2(accounts.ticket.publicKey, lcltwid);
        // if (getCookie("28unjji278jess38995") === "true") {
        //   document.cookie = "2380u48895kfo4183u4j=2";
        //   window.localStorage.setItem("2380u48895kfo4183u4j", "2");
        // } else if (getCookie("9j929krjnhnu3332") === undefined) {
        //   document.cookie = "28unjji278jess38995=true";
        // }
        // settextState_About(win_variants[rendomNum2].text);
      } else {
        rendomNum2 = await getRandomArrayElement(ArrayRandom);
        // console.log(ArrayRandom);
        // console.log(win_variants[rendomNum2].text);
        settextState_About(win_variants[rendomNum2].text);
        if (win_variants[rendomNum2].text === "OG" || win_variants[rendomNum2].text === "Whitelist" || win_variants[rendomNum2].text === "Free Mint") {
          settextState_About_othersText("Congratulations! Open the support ticket in our Discord and send your wallet address, the prize will be approved within 24 hours");
        }
        setImageStateCong(rendomNum2);
      }

      // if (ticketData === undefined) {
      //   const accounts = await getBuyTicketAccounts(rootConfig, pk, program.provider.publicKey!);
      //   setTicketff(accounts.ticket.publicKey);
      //   const id = await program.methods
      //     .buyLootboxTicket()
      //     .accountsStrict({
      //       ...accounts.accounts,
      //     })
      //     .signers([accounts.ticket])
      //     .rpc();
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
      //   iTicket = await redeemTicket(accounts.ticket.publicKey);
      //   if (timeoutIDtrigger) {
      //     clearTimeout(timeoutIDtrigger);
      //   }
      // } else {
      //   await new Promise((resolve) => setTimeout(resolve, 5000));
      //   iTicket = await redeemTicket(ticketData);
      //   if (timeoutIDtrigger) {
      //     clearTimeout(timeoutIDtrigger);
      //   }
      //   setStateOpensTickets((prev) => [...prev, ticketData.toBase58()]);
      //   document.cookie = `${ticketData}=true`;
      // }

      const merge3 = ALLrandom_main_lootbox.flat(1);
      let element;
      const el5 = document.getElementById("buttonSpin2");

      for (let i = 0; i < merge3.length; i++) {
        // console.log("merge3[i]");
        // console.log(merge3[i]);
        element = merge3[i];
        switch (element.text) {
          case "0 SOL":
            Array0SOL.push(element);
            Array0SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.02 SOL":
            Array0_02SOL.push(element);
            Array0_02SOLNumbers.push(element.id);
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
          case "1 SOL":
            Array1SOL.push(element);
            Array1SOLNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0X":
            Array0X.push(element);
            Array0XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "2 $LUM":
            Array2LUM.push(element);
            Array2LUMNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "5 $LUM":
            Array5LUM.push(element);
            Array5LUMNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "10 $LUM":
            Array10LUM.push(element);
            Array10LUMNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "0.5X":
            Array05X.push(element);
            Array05XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "1X":
            Array1X.push(element);
            Array1XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "2X":
            Array2X.push(element);
            Array2XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "5X":
            Array5X.push(element);
            Array5XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "15X":
            Array15X.push(element);
            Array15XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Lumbeer NFT":
            ArrayLumbeerNFT.push(element);
            ArrayLumbeerNFTNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Cheap NFT":
            ArrayCheapNFT.push(element);
            ArrayCheapNFTNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Mid NFT":
            ArrayMidNFT.push(element);
            ArrayMidNFTNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Expensive NFT":
            ArrayExpensiveNFT.push(element);
            ArrayExpensiveNFTNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "30X":
            Array30X.push(element);
            Array30XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "60X":
            Array60X.push(element);
            Array60XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "120X":
            Array120X.push(element);
            Array120XNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Free Wooden Loot Box":
            ArrayFreeWooden.push(element);
            ArrayFreeWoodenNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Free Carbon Loot Box":
            ArrayFreeCarbon.push(element);
            ArrayFreeCarbonNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "NOTHING":
            ArrayNOTHING.push(element);
            ArrayNOTHINGNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Free Mint":
            ArrayFreeMint.push(element);
            ArrayFreeMintNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "OG":
            ArrayOG.push(element);
            ArrayOGNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          case "Whitelist":
            ArrayWhitelist.push(element);
            ArrayWhitelistNumbers.push(element.id);
            setTextState(`${element.text}`);
            break;
          default:
            break;
        }
      }

      if (title === "OG LOOTBOX") {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(ArrayNOTHINGNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(ArrayFreeMintNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(ArrayOGNumbers);
            break;
          default:
            break;
        }
      }
      if (title === "FREE LOOTBOX") {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(Array0SOLNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(Array0_02SOLNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(Array0_05SOLNumbers);
            break;
          case 3:
            rendomNum = await getRandomArrayElement(Array0_1SOLNumbers);
            break;
          case 4:
            rendomNum = await getRandomArrayElement(Array0_25SOLNumbers);
            break;
          case 5:
            rendomNum = await getRandomArrayElement(Array0_5SOLNumbers);
            break;
          case 6:
            rendomNum = await getRandomArrayElement(Array1SOLNumbers);
            break;
          default:
            break;
        }
      }
      if (title === "LUMBEER LOOTBOX") {
        // document.cookie = "fgiwf333666dksf4=true";
        // console.log(rendomNum2);
        // if (typeof redult === "string") {
        // if (rendomNum2 && rendomNum2 !== null && rendomNum2 !== undefined) {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(ArrayNOTHINGNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(ArrayFreeMintNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(ArrayOGNumbers);
            break;
          case 3:
            rendomNum = await getRandomArrayElement(ArrayWhitelistNumbers);
            break;
          default:
            break;
        }
      }
      if (title === "Wooden Loot Box") {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(Array0XNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(Array2LUMNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(Array05XNumbers);
            break;
          case 3:
            rendomNum = await getRandomArrayElement(Array1XNumbers);
            break;
          case 4:
            rendomNum = await getRandomArrayElement(Array2XNumbers);
            break;
          case 5:
            rendomNum = await getRandomArrayElement(Array5XNumbers);
            break;
          case 6:
            rendomNum = await getRandomArrayElement(Array15XNumbers);
            break;
          case 7:
            rendomNum = await getRandomArrayElement(ArrayLumbeerNFTNumbers);
            break;
          case 8:
            rendomNum = await getRandomArrayElement(Array30XNumbers);
            break;
          case 9:
            rendomNum = await getRandomArrayElement(Array60XNumbers);
            break;
          case 10:
            rendomNum = await getRandomArrayElement(Array120XNumbers);
            break;
          default:
            break;
        }
      } else if (title === "Carbon Loot Box") {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(Array0XNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(Array5LUMNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(Array05XNumbers);
            break;
          case 3:
            rendomNum = await getRandomArrayElement(ArrayFreeWoodenNumbers);
            break;
          case 4:
            rendomNum = await getRandomArrayElement(Array1XNumbers);
            break;
          case 5:
            rendomNum = await getRandomArrayElement(Array2XNumbers);
            break;
          case 6:
            rendomNum = await getRandomArrayElement(Array5XNumbers);
            break;
          case 7:
            rendomNum = await getRandomArrayElement(ArrayLumbeerNFTNumbers);
            break;
          case 8:
            rendomNum = await getRandomArrayElement(Array15XNumbers);
            break;
          case 9:
            rendomNum = await getRandomArrayElement(Array30XNumbers);
            break;
          case 10:
            rendomNum = await getRandomArrayElement(ArrayCheapNFTNumbers);
            break;
          case 11:
            rendomNum = await getRandomArrayElement(Array60XNumbers);
            break;
          case 12:
            rendomNum = await getRandomArrayElement(Array120XNumbers);
            break;
          case 13:
            rendomNum = await getRandomArrayElement(ArrayMidNFTNumbers);
            break;
          default:
            break;
        }
      } else if (title === "Magnetic Loot Box") {
        switch (Number(rendomNum2)) {
          case 0:
            rendomNum = await getRandomArrayElement(Array0XNumbers);
            break;
          case 1:
            rendomNum = await getRandomArrayElement(Array10LUMNumbers);
            break;
          case 2:
            rendomNum = await getRandomArrayElement(Array05XNumbers);
            break;
          case 3:
            rendomNum = await getRandomArrayElement(ArrayFreeCarbonNumbers);
            break;
          case 4:
            rendomNum = await getRandomArrayElement(Array1XNumbers);
            break;
          case 5:
            rendomNum = await getRandomArrayElement(Array2XNumbers);
            break;
          case 6:
            rendomNum = await getRandomArrayElement(Array5XNumbers);
            break;
          case 7:
            rendomNum = await getRandomArrayElement(Array15XNumbers);
            break;
          case 8:
            rendomNum = await getRandomArrayElement(ArrayCheapNFTNumbers);
            break;
          case 9:
            rendomNum = await getRandomArrayElement(Array30XNumbers);
            break;
          case 10:
            rendomNum = await getRandomArrayElement(ArrayMidNFTNumbers);
            break;
          case 11:
            rendomNum = await getRandomArrayElement(Array60XNumbers);
            break;
          case 12:
            rendomNum = await getRandomArrayElement(Array120XNumbers);
            break;
          case 13:
            rendomNum = await getRandomArrayElement(ArrayExpensiveNFTNumbers);
            break;
          default:
            break;
        }
      }

      if (lds_roller !== null && textOpenel !== null) {
        // (lds_roller as HTMLElement).style.display = "none";
        (textOpenel as HTMLElement).style.position = "relative";
        (textOpenel as HTMLElement).style.opacity = "1";
      }
      if (title === "FREE LOOTBOX" || title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") {
        setTextOpen(`FREE`);
      } else {
        setTextOpen(`OPEN ${price} SOL`);
      }

      // console.log(rendomNum);
      // console.log(massStatusreturn);
      MainLootboxesRoll(rendomNum, rendomNum2, massStatusreturn);
      setTimeout(() => {
        if (el5 !== null) {
          el5.style.pointerEvents = "all";
        }
      }, 5000);
    } catch (e: any) {
      console.log(e);
      try {
        const lds_roller = document.querySelector(".loaderOpen");
        const el5 = document.getElementById("buttonSpin2");
        const textOpenel = document.querySelector(".LootboxComponent_price_position span");
        const el444 = document.querySelectorAll(".btnOPENlbxtd");

        if (title === "FREE LOOTBOX" || title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") {
          setTextOpen(`FREE`);
        } else {
          setTextOpen(`OPEN ${price} SOL`);
        }

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
                // (lds_roller as HTMLElement).style.display = "none";
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
                // (lds_roller as HTMLElement).style.display = "none";
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
                // (lds_roller as HTMLElement).style.display = "none";
                (textOpenel as HTMLElement).style.position = "relative";
                (textOpenel as HTMLElement).style.opacity = "1";
              }
              if (el444 !== null) {
                el444.forEach((element) => {
                  (element as HTMLElement).style.pointerEvents = "all";
                });
              }
              break;

            case "INSUFFICIENT_FUNDS":
              setAlertState({
                open: true,
                message: "You should have some SOL on your wallet to be able to open the Loot Box",
                severity: "error",
              });
              setTimeout(() => {
                const el = document.getElementById("buttonSpin2");
                if (el !== null) {
                  el.style.pointerEvents = "all";
                }
              }, 2000);
              if (lds_roller !== null && textOpenel !== null) {
                // (lds_roller as HTMLElement).style.display = "none";
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
                // (lds_roller as HTMLElement).style.display = "none";
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
        console.log(e);
        const lds_roller = document.querySelector(".loaderOpen");
        if (title === "FREE LOOTBOX" || title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") {
          setTextOpen(`FREE`);
        } else {
          setTextOpen(`OPEN ${price} SOL`);
        }
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
          // (lds_roller as HTMLElement).style.display = "none";
          (textOpenel as HTMLElement).style.position = "relative";
          (textOpenel as HTMLElement).style.opacity = "1";
        }
      }
    }
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

    // console.log(roll);
    // console.log(win_variants[numberAnimation]);
    // console.log(massive);

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

    if (document.body.clientWidth > 910) {
      var rows = title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? 4 : 2,
        card = 150 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      // var randomize = Math.floor(Math.random() * 150) - 150 / 2 + 75;
      var randomize: number;
      if (massive.length % 2 === 0) {
        randomize = Math.floor(Math.random() * (140 - 10 + 1) + 10);
      } else {
        randomize = Math.floor(Math.random() * (140 - 10 + 1) + 75);
      }
    } else if (document.body.clientWidth > 710) {
      var rows = title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? 4 : 2,
        card = 100 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      // var randomize = Math.floor(Math.random() * 100) - 100 / 2 + 50;
      var randomize: number;
      if (massive.length % 2 === 0) {
        randomize = Math.floor(Math.random() * (90 - 10 + 1) + 10);
      } else {
        randomize = Math.floor(Math.random() * (90 - 10 + 1) + 50);
      }
    } else {
      var rows = title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? 4 : 2,
        card = 75 + 0.75 * 2,
        landingPosition = rows * massive.length * card + position * card;
      // var randomize = Math.floor(Math.random() * 75) - 75 / 2 + 37.5;
      var randomize: number;
      if (massive.length % 2 === 0) {
        randomize = Math.floor(Math.random() * (65 - 10 + 1) + 10);
      } else {
        randomize = Math.floor(Math.random() * (65 - 10 + 1) + 37.5);
      }
    }

    landingPosition = landingPosition + randomize;

    var object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    };

    $wheel.css({
      "transition-timing-function": "cubic-bezier(0," + object.x + "," + object.y + ",1)",
      "transition-duration": "4s",
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

      const numberMoreAnimation = title === "LUMBEER LOOTBOX" ? 1 : title === "TEST LOOTBOX" ? 2 : title === "FREE LOOTBOX" ? 1 : 0;

      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        (AnimationLootbeers as HTMLElement).style.display = "block";
        if (numberAnimation >= numberMoreAnimation) {
          var img: any = document.getElementById("lootboxanimation");
          if (img !== null) {
            var imageUrl = img.src;
            img.src = "";
            img.src = imageUrl;
          }
          (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 1.03s ease-in-out";
        } else {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          // (ticketImage[0] as HTMLElement).style.animation = 'AnimationLootbeersKeyframes_text 76.5s';
        }
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 79.53s";

        setTimeout(() => {
          if (numberAnimation >= numberMoreAnimation) {
            (lootboxanimation as HTMLElement).style.display = "block";
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 1.03s";
          }
        }, 500);
        setTimeout(() => {
          if (numberAnimation >= numberMoreAnimation) {
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
            (lootboxanimation as HTMLElement).style.display = "none";
          }
          setCloseBlock(true);

          let massColor: Array<string> = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];

          if (numberAnimation >= numberMoreAnimation) {
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
    }, 4 * 1000);

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
    if (closeBlock === true) {
      // let LootboxComponent = document.querySelector(".LootboxComponent");
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
        // (LootboxComponent as HTMLElement).style.overflowY = "scroll";
        document.body.style.overflowY = "scroll";

        (AnimationLootbeers_background_block_text as HTMLElement).style.opacity = "0";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.opacity = "0";

        (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 0s";
        (AnimationLootbeers as HTMLElement).style.background = "#00000000";
        (AnimationLootbeers as HTMLElement).style.display = "none";
      }
    }
  };

  const OpenAgain = () => {
    let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
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
    borderColor: {
      borderColor: `${colors[1]}`,
      // background: `linear-gradient(to right, ${colors[0]}, ${colors[0]}, ${colors[1]}, ${colors[0]}, ${colors[0]})`,
    },
  };

  const ChangeActiveMenuElement_setDateFormText = (value: string) => {
    setDateFormText(value);
  };
  const ChangeActiveMenuElement_setdatefrom = (value: string) => {
    setdatefrom(value);
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

  useEffect(() => {
    const el = document.querySelector(".datatool");
    const elcontentToolTipBlock = document.querySelector(".contentToolTipBlock");
    if (el !== null && elcontentToolTipBlock !== null) {
      if (opentooptip === false) {
        if (timeoutIDAnime) {
          clearTimeout(timeoutIDAnime);
        }
        (el as HTMLElement).style.height = "80%";
        (elcontentToolTipBlock as HTMLElement).style.visibility = "visible";
        (elcontentToolTipBlock as HTMLElement).style.opacity = "1";
      } else if (opentooptip === true) {
        if (timeoutIDAnime) {
          clearTimeout(timeoutIDAnime);
        }
        (el as HTMLElement).style.height = "auto";
        (elcontentToolTipBlock as HTMLElement).style.visibility = "hidden";
        (elcontentToolTipBlock as HTMLElement).style.opacity = "0";
      }
      if (timeoutIDAnime) {
        clearTimeout(timeoutIDAnime);
      }
    }
  }, [opentooptip]);

  async function getDataUserTW() {
    try {
      const loaderClose = document.querySelector(".twitterBlock .loaderOpen2");
      const checkBtnlootbox = document.querySelector(".twitterBlock .checkBtnlootbox");
      if (loaderClose !== null && checkBtnlootbox !== null) {
        (checkBtnlootbox as HTMLElement).style.pointerEvents = "none";
      }

      const codeToken = await searchParams.get("code");
      if (codeToken) {
        // const res: any = await axios.post(`https://lootbeers.com/twitter?code=${codeToken}&url=https://lootbeers.com/${URLtitle}`, {});
        const res: any = await axios.post(`https://lootbeers.com/twitter?code=${codeToken}&url=http://localhost:3000/${URLtitle}`, {});
        // console.log(codeToken);
        console.log(res);
        localStorage.setItem("twitterIDwin32", res.data.id);

        if (res.data.liked === true && res.data.retweeted === true && res.data.commented === true) {
          document.cookie = `9483894ggjimg_TW=true`;
          const filterTextMain = document.querySelector(".LootboxBacdrop");
          const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
          setTextStateonTW("DONE");
          if (getCookie("2fo649003ff4frnn22_DS") === "true") {
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
        } else if (res.data.liked === false && res.data.retweeted === true && res.data.commented === true) {
          setAlertState({
            open: true,
            message: "Like our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === true && res.data.retweeted === false && res.data.commented === true) {
          setAlertState({
            open: true,
            message: "Retweet our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === false && res.data.retweeted === false && res.data.commented === true) {
          setAlertState({
            open: true,
            message: "Like & Retweet our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === false && res.data.retweeted === false && res.data.commented === false) {
          setAlertState({
            open: true,
            message: "Like, Retweet and leave a comment under our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === true && res.data.retweeted === false && res.data.commented === false) {
          setAlertState({
            open: true,
            message: "Retweet and leave a comment under our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === false && res.data.retweeted === true && res.data.commented === false) {
          setAlertState({
            open: true,
            message: "Like and leave a comment under our pinned tweet",
            severity: "info",
          });
          (checkBtnlootbox as HTMLElement).style.pointerEvents = "all";
        } else if (res.data.liked === true && res.data.retweeted === true && res.data.commented === false) {
          setAlertState({
            open: true,
            message: "Leave a comment under our pinned tweet",
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
        const REDIRECT_URI = "http://localhost:3000/free_lootbox/";
        // const REDIRECT_URI = "https://lootbeers.com/free_lootbox/";
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
              document.cookie = `2fo649003ff4frnn22_DS=true`;
              const filterTextMain = document.querySelector(".LootboxBacdrop");
              const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
              if (getCookie("9483894ggjimg_TW") === "true") {
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
                {imageStatecong === 0 && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? <img src={ticket2_3} alt="" className="" style={{ height: "140px", marginBottom: "0px" }} /> : imageStatecong === 1 && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? <img src={ticket2_1} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} /> : imageStatecong === 2 && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? <img src={ticket2_2} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} /> : imageStatecong === 3 && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? <img src={ticket2_4} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} /> : imageStatecong === 9 && title === "TEST LOOTBOX" ? <img src={nftimg} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} /> : <img src={solanapng} alt="" className="" style={{ height: "140px", marginBottom: "20px" }} />}
                <div className="header_a_block">{textState_About}</div>
                {title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? (
                  <div className="header_a_block" style={{ fontSize: "13px", marginBottom: "20px", marginTop: "5px", lineHeight: "140%", width: "90%", left: 0, right: 0, marginLeft: "auto", marginRight: "auto" }}>
                    {textState_About_othersText}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="buttons_AnimationLootbeers">
                {/* {textState === win_variants[1].text || textState === win_variants[0].text ? (
                  <a className="header_a supportTextSvg supportTextSvgBtn tweetBtn" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: "0px" }}>
                    DISCORD
                  </a>
                ) : (
                  <a></a>
                )} */}
                {textState_About === whitelist_win_variants[0].text ? (
                  <a style={style1.borderColor} href="https://twitter.com/intent/tweet?text=ATTENTION%3A%20Have%20you%20opened%20a%20COMPLETELY%20FREE%20LOOT%20BOX%20from%20%40lumbeers%20%3F%20%0A%0AI%20got%20NOTHING%20from%20a%20Free%20Loot%20Box.%20Don%27t%20Fade%20or%20else...%20your%20luck%20will%20be%20like%20mine%20%F0%9F%92%80%0A%0AHop%20on%20the%20last%20train%3A%20lootbeers.com%20%28takes%20like%2030%20seconds%29" target={"_blank"} className="tweetBtn">
                    <div className="contentLineLBX" style={style1.background2}></div>
                    TWEET ABOUT IT
                  </a>
                ) : textState_About === whitelist_win_variants[1].text ? (
                  <a style={style1.borderColor} href="https://twitter.com/intent/tweet?text=ATTENTION%3A%20Have%20you%20opened%20a%20COMPLETELY%20FREE%20LOOT%20BOX%20from%20%40lumbeers%20%3F%20%0A%0AI%20just%20got%20FREE%20MINT%20from%20a%20Free%20Loot%20Box.%20Don%27t%20Fade%20or%20else...%20%F0%9F%8D%80%0A%0AHop%20on%20the%20last%20train%3A%20lootbeers.com%20%28takes%20like%2030%20seconds%29" target={"_blank"} className="tweetBtn">
                    <div className="contentLineLBX" style={style1.background2}></div>
                    TWEET ABOUT IT
                  </a>
                ) : textState_About === whitelist_win_variants[2].text ? (
                  <a style={style1.borderColor} href="https://twitter.com/intent/tweet?text=ATTENTION%3A%20Have%20you%20opened%20a%20COMPLETELY%20FREE%20LOOT%20BOX%20from%20%40lumbeers%20%3F%20%0A%0AI%20just%20got%20OG%20from%20a%20Free%20Loot%20Box.%20Don%27t%20Fade%20or%20else...%20%F0%9F%8D%80%0A%0AHop%20on%20the%20last%20train%3A%20lootbeers.com%20%28takes%20like%2030%20seconds%29" target={"_blank"} className="tweetBtn">
                    <div className="contentLineLBX" style={style1.background2}></div>
                    TWEET ABOUT IT
                  </a>
                ) : textState_About === whitelist_win_variants[3].text ? (
                  <a style={style1.borderColor} href="https://twitter.com/intent/tweet?text=ATTENTION%3A%20Have%20you%20opened%20a%20COMPLETELY%20FREE%20LOOT%20BOX%20from%20%40lumbeers%20%3F%20%0A%0AI%20just%20got%20WHITELIST%20from%20a%20Free%20Loot%20Box.%20Don%27t%20Fade%20or%20else...%20%F0%9F%8D%80%0A%0AHop%20on%20the%20last%20train%3A%20lootbeers.com%20%28takes%20like%2030%20seconds%29" target={"_blank"} className="tweetBtn">
                    <div className="contentLineLBX" style={style1.background2}></div>
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
        <div className="LootEventBlurElement" style={{ display: "block" }}>
          {title === "LUMBEER LOOTBOX" ? <VoteLumbeer title={title} /> : <VoteLumbeer title={title} />}
          {/* {wallet?.publicKey.toBase58() === "8z6VP284SXF9ZEsWXXZEmT7Y31tB278KR6NXKrSLv8dw" || wallet?.publicKey.toBase58() === "86nVRHqtpzYJLwEi37ckeKft2yK454LX8UG2oUkgFpPt" || wallet?.publicKey.toBase58() === "FsX9Q7pizoSE7syUQHUobhq6DmseRRLfrns6Xm9Tvmqi" ? null : ( */}
          <div className="LootboxComponent_stat" style={title === "FREE2 LOOTBOX" ? { display: "flex" } : { display: "none" }}>
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
                href="https://discord.com/oauth2/authorize?response_type=code&client_id=1037296170290130986&scope=identify%20guilds.join%20guilds&state=15773059ghq9183habn&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffree_lootbox%2F"
                // href="https://discord.com/oauth2/authorize?response_type=code&client_id=1037296170290130986&scope=identify%20guilds.join%20guilds&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Flootbeers.com%2Ffree_lootbox%2F"
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
                  TWITTER.&nbsp;
                </a>
                <span>
                  <br />
                  Like, Retweet and leave a comment under our &nbsp;
                </span>
                <a href="https://twitter.com/lumbeers/status/1596845580680331265?t=58AHKEeqzOLxP-gcbpyjfw&s=19" target={"_blank"}>
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
          {/* )} */}
        </div>
        <div className="datatool" style={{ height: "auto" }}>
          <svg onClick={() => setopentooltip((prev) => !prev)} style={{ right: "-30px" }} width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
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
        <div className="LootboxBacdrop freelootbox" style={wallet?.publicKey.toBase58() === "8z6VP284SXF9ZEsWXXZEmT7Y31tB278KR6NXKrSLv8dw" || wallet?.publicKey.toBase58() === "86nVRHqtpzYJLwEi37ckeKft2yK454LX8UG2oUkgFpPt" || wallet?.publicKey.toBase58() === "FsX9Q7pizoSE7syUQHUobhq6DmseRRLfrns6Xm9Tvmqi" ? { filter: "blur(20px)", pointerEvents: "none" } : { filter: "blur(20px)", pointerEvents: "none" }}>
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
            <div className="LootboxComponent_price buttonSpin2 right" onClick={() => spinClick(false, undefined)} id="buttonSpin2" style={{ pointerEvents: "all" }}>
              <div className="content" style={style1.backgroundBtn}></div>
              <div className="LootboxComponent_price_position">
                <span style={{ position: "relative", opacity: 1 }}>{textOpen}</span>
                {/* <div className="lds-roller" style={{ display: 'none' }}><div></div><div></div><div></div><div></div></div> */}
                {/* <div className="loaderOpen" id="loaderOpen" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div> */}
              </div>
            </div>
            <div className="LootboxComponent_price buttonSpin2 righttwo" onClick={undefined} id="buttonSpin3" style={{ pointerEvents: "all" }}>
              <div className="content righttwo"></div>
              {/* <div className="LootboxComponent_price_position righttwo">INCREASE THE CHANCES BY 100 $LUM</div> */}
            </div>
          </div>
          {title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? (
            <div className="LootboxComponent_stat">
              <div className="LootboxComponent_stat_text LootboxComponent_stat_textOG ogchancestyle">Chance of getting Whitelist - {dataGetOgChance !== undefined && dataGetOgChance !== null ? Number(dataGetOgChance.ogProb * 100).toFixed(2) : 50}%</div>
              {/* <div className="blinking-leghtRed">
                <div className="blinking-darkRed"></div>
              </div> */}
            </div>
          ) : null}
          {DateFrom === "" && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? <div className="timerMini">{dateFormText}</div> : title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX" ? <Timer2 deadline={DateFrom} /> : null}
          {dataGetResultYourLoots !== undefined && (title === "OG LOOTBOX" || title === "LUMBEER LOOTBOX") ? (
            <a target={"_blank"} href={dataGetResultYourLoots[0].loot.redeemResult === "FREE_MINT" ? `https://twitter.com/intent/tweet?text=I%20am%20certified%20diamond-handed%20Top%20G%2C%20no%20one%20can%20beat%20me%20%F0%9F%A4%91%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F87BMlKFgH5` : dataGetResultYourLoots[0].loot.redeemResult === "OG" ? `https://twitter.com/intent/tweet?text=I%20am%20certified%20Top%20G%20now%2C%20time%20to%20show%20some%20respect%20%F0%9F%98%8E%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FYlIU7fKdXi` : `https://twitter.com/intent/tweet?text=I%20wish%20I%20was%20luckier%2C%20need%20to%20prove%20that%20I%20am%20truly%20the%20Top%20G%20%F0%9F%8D%80%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F3MrOCGaEMg`} className="LootboxComponent_stat tweetAboutItforpeoplewhoaccidentallyclosedthewinwindow">
              Tweet about your last prize
            </a>
          ) : null}
        </div>
      </div>
      <Lates_your_loots colors={colors} setActiveMenuElement={setActiveMenuElement} stateReloadInfo={stateReloadInfo} setdatefromState={ChangeActiveMenuElement_setdatefrom} setDateFormTextState={ChangeActiveMenuElement_setDateFormText} lootboxaddress={lootboxAddress} open_reclaimed={bad_ticket_data_openAgain} trigger={trigger} />
    </div>
  );
};

export default MainLootboxes;
