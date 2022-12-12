import "../../../App.css";
import "../../../fonts/fonts.css";
import React, { useEffect, useState, FC } from "react";
import $ from "jquery";
import JSConfetti from "js-confetti";
import "../../../animation.css";
import useRootConfigFetcher from "./../../hooks/useRootConfigFetcher";
import { RootConfig } from "../../../types/app_types";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import "../../loader.scss";
import axios from "axios";
import { OG_win_variants, OG_win_variants2 } from "../../../win_variants";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import "../../timer.scss";
import lootboxanimation from "../../../media/ezgif-3-cbc77fa118.gif";

import ticket2_1 from "../../../media/ticket2_1.webp";
import ticket2_2 from "../../../media/ticket2_2.webp";
import ticket2_3 from "../../../media/ticket2_3.webp";

import Lates_your_loots from "../../lates_your_loots/lates_your_loots";

import { Props, AlertState, LootYour, LootAll, OgChance } from "../../interfaceLootbox/interfaceLootbox";
import "./og_lootbox.scss";

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

const OgLootbox: FC<Props> = ({ onChange, setColor, setActiveMenuElement, picture, price, title, URLtitle, colors, text, win_variants, lootboxAddress }) => {
  const rootConfigFetcher = useRootConfigFetcher();
  const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;
  const [textState, setTextState] = useState<String>("");
  const [textState_About, settextState_About] = useState<String>("");
  const { publicKey, signMessage } = useWallet();
  const wallet = useAnchorWallet();
  const connection = useConnection();
  const [timeoutID, setTimeoutID] = useState<any>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [trigger, setTrigger] = useState(0);


  useEffect(() => {
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

  const [dataGetResultYourLoots, setdataGetResultYourLoots] = useState<Array<LootYour>>();
  const [dataGetOgChance, setdataGetOgChance] = useState<OgChance>();
  const [imageStatecong, setImageStateCong] = useState<number>(2);
  const [closeBlock, setCloseBlock] = useState<Boolean>(false);

  const [dateFormText, setDateFormText] = useState<string>("");
  const [DateFrom, setdatefrom] = useState<string>("");
  const [stateReloadInfo, setstateReloadInfo] = useState<Boolean>(false);

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
      for (let i = 0; i < OG_win_variants2.length; i++) {
        if (OG_win_variants2[i].text === "FREE MINT") {
          row += `  <div class='element2' id='${OG_win_variants2[i].text}'><img src=${ticket2_1} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (Object.values(OG_win_variants2[i])[1].toString() === "OG RULE") {
          row += `  <div class='element2' id='${OG_win_variants2[i].text}'><img src=${ticket2_2} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else if (Object.values(OG_win_variants2[i])[1].toString() === "NOTHING") {
          row += `  <div class='element2' id='${OG_win_variants2[i].text}'><img src=${ticket2_3} alt="" class="imageLootbeers freeMint" style="height: 0"/><\/div>`;
        } else {
          row += `  <div class='element2' id='${OG_win_variants2[i].text}'><div>${OG_win_variants2[i].text}</div><\/div>`;
        }
      }
      row += "</div>";

      if (title === "OG LOOTBOX") {
        for (var x = 0; x < 29; x++) {
          $wheel.append(row);
        }
      } else {
        for (var x = 0; x < 29; x++) {
          $wheel.append(row);
        }
      }
    }

    if (title === "OG LOOTBOX") {
      setTextOpen(`FREE`);
    }

    const elements2 = document.querySelectorAll(".imageLootbeers");
    if (elements2 !== null) {
      for (let i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener("load", function () {
          (elements2[i] as HTMLElement).style.height = "auto";
        });
      }
    }
  }, []);

  useEffect(() => {
    send();
    // getYourLoots();
    // getAllLoots();
    getOgChance();
  }, [wallet]);

  const getOgChance = async () => {
    try {
      if (publicKey !== null) {
        let mass = [];
        const res = await axios.get<OgChance>(`${apiUrl}/api/v1/status/ogChance`, {});
        setdataGetOgChance(res.data);
      }
    } catch (e) {}
  };

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
      const el5 = document.getElementById("buttonSpin2");
      if (el5 !== null) {
        el5.style.pointerEvents = "none";
      }
      const redult = await logMemo(`Lootbeers wants you to sign this transaction with your Solana account: ${publicKey?.toBase58()}

Click "Sign" or "Approve" only means you have proved you are owner of this wallet.

This exact Loot Box is functioning off-chain, which means this request will not trigger any transaction or cost you anything.
Click approve if you are real OG mfer and good luck to you! 

If you read through this, fuck... Why are you still here, open the damn box
            `);

      const lds_roller = document.querySelector(".loaderOpen");
      setTextOpen("");
      if (lds_roller !== null) {
        (lds_roller as HTMLElement).style.display = "block";
      }

      if (typeof redult === "string") {
        if (price.toString() === "0") {
          try {
            const res = await axios.post(`${apiUrl}/api/v1/ticket/redeem`, {
              ticketAddress: "ogtoah5LB7pry5YPK9LVZyN3ZzMVZPxFmLwj3BYyPg1",
              wallet: publicKey?.toBase58(),
            });
            setTextOpen(`FREE`);
            if (lds_roller !== null) {
              (lds_roller as HTMLElement).style.display = "none";
            }
            setAlertState({
              open: true,
              message: "Successful transaction",
              severity: "success",
            });
            const Array1: Array<number> = [1, 3, 5, 7, 9, 11, 13, 15];
            const Array2: Array<number> = [2, 4, 6, 8, 10, 12, 14, 16, 17];
            const Array3: Array<number> = [0, 1, 2];
            let rendomNum: number;

            if (res.data.id && res.data.id !== null && res.data.id !== undefined) {
              setImageStateCong(res.data.id);
              if (Number(res.data.id) === 0) {
                rendomNum = 0;
                spinOgLootbox(rendomNum, res.data.id);
                settextState_About("Open the ticket in the Discord to claim your prize! Valid for 24 hours");
                setTextState(`${OG_win_variants2[rendomNum].text}`);
                setTimeout(() => {
                  if (el5 !== null) {
                    el5.style.pointerEvents = "all";
                  }
                }, 2000);
              } else if (Number(res.data.id) === 1) {
                rendomNum = await getRandomArrayElement(Array1);
                spinOgLootbox(rendomNum, res.data.id);
                settextState_About("Open the ticket in the Discord to claim your prize! Valid for 24 hours");
                setTextState(`${OG_win_variants2[rendomNum].text}`);
                setTimeout(() => {
                  if (el5 !== null) {
                    el5.style.pointerEvents = "all";
                  }
                }, 2000);
              } else if (Number(res.data.id) === 2) {
                rendomNum = await getRandomArrayElement(Array2);
                spinOgLootbox(rendomNum, res.data.id);
                settextState_About("");
                setTextState(`${OG_win_variants2[rendomNum].text}`);
                setTimeout(() => {
                  if (el5 !== null) {
                    el5.style.pointerEvents = "all";
                  }
                }, 2000);
              }
            } else {
              setAlertState({
                open: true,
                message: "Something went wrong",
                severity: "error",
              });
            }
            setstateReloadInfo((prev) => !prev);
          } catch (e: any) {
            // console.log(e);
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
                default:
                  setAlertState({
                    open: true,
                    message: "The problem is on the server, contact us",
                    severity: "error",
                  });
                  break;
              }
              if (lds_roller !== null) {
                (lds_roller as HTMLElement).style.display = "none";
              }
              setTextOpen(`FREE`);
              setTimeout(() => {
                if (el5 !== null) {
                  el5.style.pointerEvents = "all";
                }
              }, 2000);
            }
          }
          return;
        }
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
      if (lds_roller !== null) {
        (lds_roller as HTMLElement).style.display = "none";
      }
      setTimeout(() => {
        const el = document.getElementById("buttonSpin2");
        if (el !== null) {
          el.style.pointerEvents = "all";
        }
      }, 2000);
    }
  };

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

  function spinOgLootbox(roll: number, numberAnimation: number) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    setCloseBlock(false);
    let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
    let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
    let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
    let lootboxanimation = document.querySelector(".lootboxanimation");
    let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
    let ticketImage = document.querySelectorAll(".ticketImage");
    var $wheel = $(".roulette-wrapper2 .wheel2"),
      order = [9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 1, 2, 3, 4, 5, 6, 7, 8],
      position = order.indexOf(roll);

    if (document.body.clientWidth > 910) {
      var rows = 6,
        card = 150 + 1.75 * 2,
        landingPosition = rows * 18 * card + position * card;
      var randomize = Math.floor(Math.random() * 150) - 150 / 2 + 75;
    } else if (document.body.clientWidth > 710) {
      var rows = 6,
        card = 100 + 1.75 * 2,
        landingPosition = rows * 18 * card + position * card;
      var randomize = Math.floor(Math.random() * 100) - 100 / 2 + 50;
    } else {
      var rows = 6,
        card = 75 + 1.75 * 2,
        landingPosition = rows * 18 * card + position * card;
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
        if (numberAnimation !== 2) {
          (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 1.03s ease-in-out";
        } else {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (ticketImage[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
        }
        (AnimationLootbeers as HTMLElement).style.animation = "AnimationLootbeersKeyframes 79.53s";

        setTimeout(() => {
          if (numberAnimation !== 2) {
            (lootboxanimation as HTMLElement).style.display = "block";
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 1.03s";
          }
        }, 500);
        setTimeout(() => {
          if (numberAnimation !== 2) {
            (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
            (lootboxanimation as HTMLElement).style.display = "none";
          }
          setCloseBlock(true);

          let massColor: Array<string> = ["#059033", "#008556", "#00776C", "#006873", "#00586B", "#2F4858"];

          if (numberAnimation !== 2) {
            jsConfetti.addConfetti({
              confettiNumber: 200,
              confettiColors: massColor,
            });
          }
        }, 1530);
        setTimeout(() => {
          (AnimationLootbeers_background_block_btn[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (AnimationLootbeers_background_block_text as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
          (ticketImage[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 76.5s";
        }, 1530);
      }
    }, 8 * 1000);

    setTimeout(function () {
      // getYourLoots();
      // getAllLoots();
      getOgChance();
    }, 10 * 1000);

    const timeout = setTimeout(function () {
      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        (ticketImage[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
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
      let AnimationLootbeers = document.querySelector(".AnimationLootbeers");
      let AnimationLootbeers_background_block_text = document.querySelector(".AnimationLootbeers_background_block_text");
      let AnimationLootbeers_background_block_btn = document.querySelectorAll(".AnimationLootbeers_background_block_btn");
      let ticketImage = document.querySelectorAll(".ticketImage");
      let lootboxanimation = document.querySelector(".lootboxanimation");
      let lootboxAnimationImage = document.querySelector(".lootboxAnimationImage");
      (lootboxanimation as HTMLElement).style.animation = "lootboxanimationkeyframes 0s";
      (lootboxanimation as HTMLElement).style.display = "none";
      (lootboxAnimationImage as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text2 0s";
      (lootboxAnimationImage as HTMLElement).style.opacity = "0";
      if (AnimationLootbeers !== null && AnimationLootbeers_background_block_btn !== null && AnimationLootbeers_background_block_text !== null) {
        (ticketImage[0] as HTMLElement).style.animation = "AnimationLootbeersKeyframes_text 0s";
        (ticketImage[0] as HTMLElement).style.opacity = "0";
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
        getOgChance();
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
      // boxShadow: `0px -5px 10px ${colors[1]}`
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
            {imageStatecong === 0 ? <img src={ticket2_1} alt="" className="ticketImage" /> : imageStatecong === 1 ? <img src={ticket2_2} alt="" className="ticketImage" /> : imageStatecong === 2 ? <img src={ticket2_3} alt="" className="ticketImage" /> : <div></div>}
            <img
              src={lootboxanimation}
              alt=""
              id="lootboxanimation"
              className="lootboxanimation"
              style={{
                display: "none",
                animationPlayState: "paused",
                mixBlendMode: "screen",
              }}
            ></img>
            <img src={picture} alt="" className="lootboxAnimationImage" />
            <div className="AnimationLootbeers_background_block_text">
              {textState === OG_win_variants[1].text || textState === OG_win_variants[0].text ? (
                <div className="AnimationLootbeers_background_block_text_mini">
                  <br />
                  {textState_About}
                  <br />
                  <div className="header_a_block"></div>
                </div>
              ) : null}
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
        <div className="LootboxBacdrop">
          <div className="LootboxComponent_title">
            <div className="LootboxComponent_title_bottom" style={style1.background}></div>
            {title}
          </div>
          <div className="LootboxComponent_image_block">
            <div className="LootboxComponent_image_block_background">
              <div
                className="radial"
                style={{
                  background: `radial-gradient(ellipse closest-side at center center, ${colors[1]}, rgba(0, 0, 0, 0))`,
                }}
              ></div>
            </div>
            <LazyLoadImage src={picture} effect="blur" alt={""} className="LootboxComponent_image" />
          </div>
          {/* <div className='typeLootBox'>
                        <div className='NORMIE typeLootBox_block active' onClick={() => correctPrice('NORMIE')}>NORMIE</div>
                        <div className='DEGEN typeLootBox_block' onClick={() => correctPrice('DEGEN')}>DEGEN</div>
                        <div className='WHALE typeLootBox_block' onClick={() => correctPrice('WHALE')}>WHALE</div>
                    </div> */}
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
            <div className="LootboxComponent_price buttonSpin2 right" onClick={spinClick} id="buttonSpin2" style={{ pointerEvents: "all" }}>
              <div className="content" style={style1.backgroundBtn}></div>
              <div className="LootboxComponent_price_position">
                {textOpen}
                <div className="loaderOpen" id="loaderOpen" style={{ display: "none", borderTopColor: `${colors[1]}` }}></div>
              </div>
            </div>
            <div className="LootboxComponent_price buttonSpin2 righttwo" onClick={undefined} id="buttonSpin3" style={{ pointerEvents: "all" }}>
              <div className="content righttwo"></div>
            </div>
          </div>
          <div className="LootboxComponent_stat">
            <div className="LootboxComponent_stat_text LootboxComponent_stat_textOG ogchancestyle">Chance of getting OG - {dataGetOgChance !== undefined && dataGetOgChance !== null ? Number(dataGetOgChance.ogProb * 100).toFixed(2) : 0}%</div>
            <div className="blinking-leghtRed">
              <div className="blinking-darkRed"></div>
            </div>
          </div>
          {DateFrom === "" ? <div className="timerMini">{dateFormText}</div> : <Timer2 deadline={DateFrom} />}
          {dataGetResultYourLoots !== undefined ? (
            <a target={"_blank"} href={dataGetResultYourLoots[0].loot.redeemResult === "FREE_MINT" ? `https://twitter.com/intent/tweet?text=I%20am%20certified%20diamond-handed%20Top%20G%2C%20no%20one%20can%20beat%20me%20%F0%9F%A4%91%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F87BMlKFgH5` : dataGetResultYourLoots[0].loot.redeemResult === "OG" ? `https://twitter.com/intent/tweet?text=I%20am%20certified%20Top%20G%20now%2C%20time%20to%20show%20some%20respect%20%F0%9F%98%8E%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2FYlIU7fKdXi` : `https://twitter.com/intent/tweet?text=I%20wish%20I%20was%20luckier%2C%20need%20to%20prove%20that%20I%20am%20truly%20the%20Top%20G%20%F0%9F%8D%80%0A%23LootEvent%0A%0A%40lumbeers%0Apic.twitter.com%2F3MrOCGaEMg`} className="LootboxComponent_stat tweetAboutItforpeoplewhoaccidentallyclosedthewinwindow">
              Tweet about your last prize
            </a>
          ) : null}
        </div>
      </div>
      <Lates_your_loots
        colors={colors}
        setActiveMenuElement={setActiveMenuElement}
        stateReloadInfo={stateReloadInfo}
        setdatefromState={ChangeActiveMenuElement_setdatefrom}
        setDateFormTextState={ChangeActiveMenuElement_setDateFormText}
        lootboxaddress={lootboxAddress}
        open_reclaimed={bad_ticket_data_openAgain}
        trigger={trigger}
      />
    </div>
  );
};

export default OgLootbox;
