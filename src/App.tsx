import Wallet from "./components/Wallet/Wallet";
import "./animation.css";
import React, { useEffect, useState, FC } from "react";

import logo1 from "./media/logo1.webp";

import { Connection } from "@solana/web3.js";
import footerLogo from "./media/logoPreolder2.webp";
import axios from "axios";

(window as any).global = window;
window.Buffer = window.Buffer || require("buffer").Buffer;

export interface CoinInfo {
  price: number;
  volume_24: number;
  market_cap: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  last_updated: Date;
}

export enum CoingeckoStatus {
  Success,
  FetchFailed,
  Loading,
}

export type CoinGeckoResult = {
  coinInfo?: CoinInfo;
  status: CoingeckoStatus;
};

export interface CoinInfoResult {
  market_data: {
    current_price: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap_rank: number;
  };
  last_updated: string;
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

interface PropsTimer {
  deadline: string;
  changeValueTimer: (valueSt: string) => void;
}

export const Timer: FC<PropsTimer> = ({ deadline = new Date().toString(), changeValueTimer }) => {
  const parsedDeadline = React.useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = React.useState(parsedDeadline - Date.now());

  React.useEffect(() => {
    const interval = setInterval(function () {
      setTime(parsedDeadline - Date.now());
      if (parsedDeadline - Date.now() <= 0) {
        changeValueTimer("7778duck8777");
      }
      // console.log(parsedDeadline - Date.now())
    }, 1000);
    // console.log(()=>changeValueTimer)
    return () => clearInterval(interval);
  }, [parsedDeadline]);

  useEffect(() => {
    // gsap.registerPlugin(ScrollTrigger);
    // // let bodyScrollBar: any;
    // const bodyScrollBar: any = ScrollBar.init(document.body, { damping: 0.1, delegateTo: document });
    // ScrollTrigger.scrollerProxy(document.body, {
    //   scrollTop(value) {
    //     if (arguments.length) {
    //       bodyScrollBar.scrollTop = value;
    //     }
    //     return bodyScrollBar.scrollTop;
    //   },
    //   getBoundingClientRect() {
    //     return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    //   },
    // });
    // bodyScrollBar.addListener(ScrollTrigger.update);
    // const scroller: HTMLElement | null = document.querySelector(".scrollerBody");
    // if (scroller !== null) {
    //   bodyScrollBar = ScrollBar.init(scroller);
    // }
    // ScrollTrigger.scrollerProxy(scroller, {
    //   scrollTop(value) {
    //     if (arguments.length) {
    //       bodyScrollBar.scrollTop = value;
    //     }
    //     return bodyScrollBar.scrollTop;
    //   },
    // });
    // bodyScrollBar.addListener(ScrollTrigger.update);
  }, []);

  //s: (time / SECOND) % 60,
  return (
    <div className="timer">
      {
        // time / DAY >= 0 && (time / HOUR) % 24 >= 0 && (time / MINUTE) % 60 >= 0 && (time / SECOND) % 60 >= 0 ?
        Object.entries({
          d: time / DAY,
          h: (time / HOUR) % 24,
          m: (time / MINUTE) % 60,
          s: (time / SECOND) % 60,
        }).map(([label, value]) => (
          <div key={label} className="Timer_box">
            <div className="box" role="timer" aria-atomic="true">
              {label === "s" ? <p className="Timer_box_text_s">{`${Math.floor(value)}`.padStart(2, "0")}</p> : label === "m" ? <p className="Timer_box_text_m">{`${Math.floor(value)}`.padStart(2, "0")}</p> : label === "h" ? <p className="Timer_box_text_h">{`${Math.floor(value)}`.padStart(2, "0")}</p> : label === "d" ? <p className="Timer_box_text_d">{`${Math.floor(value)}`.padStart(2, "0")}</p> : <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>}
              {
                // label === 's' ? <p className="Timer_box_text_s">??</p>
                //   : label === 'm' ? <p className="Timer_box_text_m">??</p>
                //     : label === 'h' ? <p className="Timer_box_text_h">??</p>
                //       : label === 'd' ? <p className="Timer_box_text_d">??</p>
                //         : <p>{`${Math.floor(value)}`.padStart(2, "0")}</p>
              }
              {label === "s" ? <span className="Timer_box_text Timer_box_text_s">seconds</span> : label === "m" ? <span className="Timer_box_text Timer_box_text_m">minutes</span> : label === "h" ? <span className="Timer_box_text Timer_box_text_h">hours</span> : label === "d" ? <span className="Timer_box_text Timer_box_text_d">days</span> : <span className="Timer_box_text">{label}&nbsp;</span>}
            </div>
          </div>
        ))
        // :
        // <div></div>
      }
    </div>
  );
};

function App() {
  const [colorStatState, setColorStatState] = React.useState<string>("#ffc000");
  const [colorTps, setColorTps] = React.useState<string>(`${colorStatState}`);

  const jdhjclls384839fjfi = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [value, setValue] = useState<string>("");

  const [ip, setIP] = useState("");

  const djijihysatqbnkq3331d = "7778duck8777";

  const setColor = (value: string) => {
    setColorStatState(`${value}`);
  };

  const getDataIp = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    // console.log(res.data);
    setIP(res.data.IPv4);
  };

  const [coinInfo, setCoinInfo] = useState<CoinGeckoResult>();
  const [tpsInfo, setTpsInfo] = useState<number>();
  const [activeUsers, setActiveUser] = useState<number>();
  const [totalOpen, setTotalOpen] = useState<number>();

  const coinId = "solana";
  useEffect(() => {
    // gsap.registerPlugin(ScrollTrigger);
    // let bodyScrollBar: any;

    // const scroller: HTMLElement | null = document.body;

    // if (scroller !== null) {
    //   bodyScrollBar = ScrollBar.init(scroller);
    // }

    // ScrollTrigger.scrollerProxy(scroller, {
    //   scrollTop(value) {
    //     if (arguments.length) {
    //       bodyScrollBar.scrollTop = value;
    //     }
    //     return bodyScrollBar.scrollTop;
    //   }
    // });
    // bodyScrollBar.addListener(ScrollTrigger.update);

    getPrice();
    getTps();
    getTotalOpen();
    getActiveUser();
    setInterval(() => {
      getPrice();
      getTps();
    }, 30000);

    setInterval(() => {
      getTotalOpen();
      getActiveUser();
    }, 120000);

    // getDataIp();

    // document.body.addEventListener('keyup', function (event) {
    //   // console.log(event.key);
    //   setValue(prev => prev + event.key)
    // });
  }, []);

  async function getActiveUser() {
    try {
      const activeUsers = await axios.get("https://lootbeers.com/api/v1/statistics/activeUsers?days=365");
      setActiveUser(activeUsers.data);
    } catch (e) {}
  }

  async function getTotalOpen() {
    try {
      const totalOpen = await axios.get("https://lootbeers.com/api/v1/statistics/totalOpened");
      setTotalOpen(totalOpen.data);
    } catch (e) {}
  }

  async function getTps() {
    try {
      // const solana = new Connection("https://clean-fragrant-scion.solana-mainnet.discover.quiknode.pro/7c6be677f6c5a289bc3b743f956405cf2a63a485/");
      const solana = new Connection("https://wispy-ultra-violet.solana-mainnet.discover.quiknode.pro/31ea4da3c719411cd04b9d517a7690b738c2ba32/");
      const tr = await solana.getRecentPerformanceSamples();
      let result = 0;
      for (let i = 0; i <= tr.length; i++) {
        if (tr[i].numTransactions !== 0) {
          result = tr[4].numTransactions / tr[4].samplePeriodSecs;
          break;
        }
      }
      setTpsInfo(result);
      if (result <= 2500) {
        setColorTps("#FF8D40");
      } else if (result <= 2400) {
        setColorTps("#FF6700");
      } else if (result <= 2300) {
        setColorTps("#A64300");
      } else {
        setColorTps(`${colorStatState}`);
      }
    } catch (e) {}
  }

  // Use Coingecko API
  async function getPrice() {
    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
      .then((res) => res.json())
      .then((info: CoinInfoResult) => {
        setCoinInfo({
          coinInfo: {
            price: info.market_data.current_price.usd,
            volume_24: info.market_data.total_volume.usd,
            market_cap: info.market_data.market_cap.usd,
            market_cap_rank: info.market_data.market_cap_rank,
            price_change_percentage_24h: info.market_data.price_change_percentage_24h,
            last_updated: new Date(info.last_updated),
          },
          status: CoingeckoStatus.Success,
        });
      })
      .catch((error: any) => {
        setCoinInfo({
          status: CoingeckoStatus.FetchFailed,
        });
      });
  }

  const changeValueTimer = (valueSt: string) => {
    setValue(valueSt);
  };

  const checkcode = () => {
    jdhjclls384839fjfi.current.value === djijihysatqbnkq3331d ? setValue(jdhjclls384839fjfi.current.value) : setValue("");
  };

  return (
    <div className="MainBrowserComp" id="MainBrowserComp">
      {
        // value === djijihysatqbnkq3331d ? (
        djijihysatqbnkq3331d === djijihysatqbnkq3331d ? (
          <div className="MainBrowserComp_block">
            <div className="StatLootbeers">
              <div>
                &nbsp;TOTAL OPENED&nbsp;<span style={{ color: `${colorStatState}`, marginRight: "30px" }}>{totalOpen ? totalOpen : "unknow"}</span>
              </div>
              <div>
                &nbsp;SOLANA TPS&nbsp;<span style={{ color: `${colorStatState}`, marginRight: "30px" }}>{tpsInfo ? tpsInfo?.toFixed(0) : "unknow"} TPS</span>
              </div>
              <div>
                &nbsp;SOLANA PRICE&nbsp;<span style={{ color: `${colorStatState}`, marginRight: "30px" }}>${coinInfo?.coinInfo?.price ? coinInfo?.coinInfo?.price : "unknow"}</span>
              </div>
              <div>
                &nbsp;Active Users&nbsp;<span style={{ color: `${colorStatState}`, marginRight: "0px" }}>{activeUsers ? activeUsers : "unknow"}</span>
              </div>
              {/* <span style={{ color: `${colorStatState}`, marginRight: '30px' }}>0 LOOTS</span> 0h volume:&nbsp;
        <span style={{ color: `${colorStatState}`, marginRight: '30px' }}>0 SOL</span> All-time volume:&nbsp;
        <span style={{ color: `${colorStatState}`, marginRight: '30px' }}>0 SOL</span> 7-days active users:&nbsp;
        <span style={{ color: `${colorStatState}`, marginRight: '0px' }}>0</span> */}
            </div>
            {/* <div className="AnimationLootbeers" style={{ display: 'none' }}>
        <div className="AnimationLootbeers_background"></div>
        <div className="AnimationLootbeers_background_block"> */}
            {/* <div className="linzeBlock">
            <div className="lens-center"></div>
            <div className="circle-1"></div>
            <div className="circle-2"></div>
          </div> */}
            {/* <div id="light"></div> */}
            {/* <div className="AnimationLootbeers_background_block_text">LootboxTime</div>
        </div>
      </div> */}
            <div style={{ position: "relative", top: 0, right: 0, width: "100%", height: "auto", overflow: "hidden" }}>
              <Wallet setColor={setColor} color={colorStatState} />
            </div>
            <div id="copied-success" className="copied" style={{ opacity: 0, display: "none" }}>
              <span>Copied to Clipboard</span>
            </div>
          </div>
        ) : (
          <div className="YouShallNotPass">
            <img src={logo1} alt="" className="logoIconShall" />
            <div className="YouShallNotPass_block">
              <div className="YouShallNotPass_text">
                <div className="WeAreComingSoon">WE ARE COMING SOON</div>
                <div className="WeAreComingSoon_text">Platform is under Maintenance. Follow our Discord for more news</div>
              </div>
              {/* <Timer deadline="November, 18, 2022 15:00:00+00:00" changeValueTimer={changeValueTimer} /> */}
              <div className="YouShallNotPass_block_socials">
                <div className="YouShallNotPass_block_socials_text">Subscribe to our Twitter & join our Discord to be notified first</div>
                <div className="socialLinks">
                  <a className="header_a" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: "20px" }}>
                    <svg className="header_a_svg" fill="#FFFFFF" viewBox="0 0 71 55" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0)">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                      </g>
                    </svg>
                  </a>
                  <a className="header_a" href="https://lootbox.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "20px" }}>
                    <img src={footerLogo} alt="" width={"30px"} height={"30px"} />
                  </a>
                  <a className="header_a" href="https://twitter.com/lumbeers" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="header_a_svg" fill="#FFFFFF" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* <button onClick={checkcode}>check</button> */}
            </div>
            <input ref={jdhjclls384839fjfi} type="text" placeholder="" onChange={(e) => setValue(e.target.value)} />
          </div>
        )
      }
    </div>
  );
}

export default App;
