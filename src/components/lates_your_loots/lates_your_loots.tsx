import { FC, useState, useEffect } from "react";
import { lates_your_loots_props, LootAll, LootYour } from "../interfaceLootbox/interfaceLootbox";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import axios from "axios";
import useLootboxProgram from "../hooks/useLootboxProgram";
import { PublicKey } from "@solana/web3.js";
import "./lates_your_loots.scss";

const Lates_your_loots: FC<lates_your_loots_props> = ({ colors, setActiveMenuElement, stateReloadInfo, setdatefromState, setDateFormTextState, lootboxaddress, open_reclaimed, trigger }) => {
  const { publicKey } = useWallet();
  const apiUrl = process.env.REACT_APP_REDEEM_API_URL!;
  const wallet = useAnchorWallet();
  const program = useLootboxProgram();

  const { connection } = useConnection();

  TimeAgo.setDefaultLocale(en.locale);
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const [timeoutID1, setTimeoutID1] = useState<any>();
  const [timeoutID2, setTimeoutID2] = useState<any>();
  const [timeoutID3, setTimeoutID3] = useState<any>();
  const [timeoutID4, setTimeoutID4] = useState<any>();
  const [timeoutID5, setTimeoutID5] = useState<any>();
  const [timeoutID6, setTimeoutID6] = useState<any>();
  const [timeoutID7, setTimeoutID7] = useState<any>();
  const [timeoutID8, setTimeoutID8] = useState<any>();
  const [unclaimedTickets, setUnclaimedTickets] = useState<PublicKey[]>([]);

  const [activeCounterYourLoots, setActiveCounterYourLoots] = useState<number>(1);
  const [activeCounterAllLoots, setActiveCounterAllLoots] = useState<number>(1);
  const [activeCounterunclaimedlootsLoots, setactiveCounterunclaimedlootsLoots] = useState<number>(1);

  const [mylootsactiveElement, setMyLootsActiveElement] = useState<Number>(2);
  const [dataGetResultYourLoots, setdataGetResultYourLoots] = useState<Array<LootYour>>();
  const [dataStat, setDataStat] = useState<Array<Object>>();

  const [dataGetAllLoots, setdataGetAllLoots] = useState<Array<LootAll>>();
  const [dateFormText, setDateFormText] = useState("");
  const [DateFrom, setdatefrom] = useState<string>("");

  useEffect(() => {
    if (trigger) {
      toggleHelloWorld();
    }
  }, [trigger]);

  const toggleHelloWorld = () => {
    getAllLoots();
    getYourLoots();
    getUnclaimedLoots();
  };

  useEffect(() => {
    getAllLoots();
  }, [activeCounterAllLoots]);
  useEffect(() => {
    getYourLoots();
  }, [activeCounterYourLoots]);

  useEffect(() => {
    getYourLoots();
    getAllLoots();
    getUnclaimedLoots();
  }, [wallet]);

  useEffect(() => {
    if (document.body.clientWidth <= 1134) {
      setMyLootsActiveElement(0);
    }
  }, []);

  async function getUnclaimedLoots() {
    if (!publicKey || !program) {
      return;
    }

    const unclaimedTickets = await connection.getProgramAccounts(program.programId, {
      filters: [
        {
          dataSize: program.account.ticket.size,
        },
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 40,
            bytes: lootboxaddress.toString(),
          },
        },
      ],
    });

    // console.log(unclaimedTickets.map((u) => u.pubkey.toBase58()));

    setUnclaimedTickets(() => unclaimedTickets.map((u) => u.pubkey));
  }

  useEffect(() => {
    // console.log(unclaimedTickets)
  }, [unclaimedTickets]);

  const getYourLoots = async () => {
    try {
      if (publicKey !== null) {
        if (activeCounterYourLoots < 1) {
          setActiveCounterYourLoots((prev) => prev + 10);
          return;
        }
        let mass = [];

        const res = await axios.get<LootYour[]>(`${apiUrl}/api/v1/ticket/recentLoots?count=10&wallet=${publicKey.toBase58()}&start=${activeCounterYourLoots}`, {});
        let truecheck: Boolean = false;
        let firstLumbeer: LootYour | undefined;
        for (let i = 0; i < res.data.length; i++) {
          mass.push(res.data[i]);
          if (res.data[i].lootboxAddress === "LumwEDLUuPJLJGo92QS4SQogDTwsXbyngGrbBt4qSdE" && truecheck === false) {
            truecheck = true;
            firstLumbeer = res.data[i];
          }
        }
        if (firstLumbeer !== undefined) {
          // console.log(firstLumbeer);
          const date1 = new Date(firstLumbeer.redeemedAt);
          const utcStr = new Date().toUTCString();
          date1.setHours(date1.getHours() + 6);

          setdatefromState(date1.toUTCString());
          setDateFormTextState("Loading...");
          setdataGetResultYourLoots(mass);
          const el = document.querySelector(".tweetAboutItforpeoplewhoaccidentallyclosedthewinwindow");
          if (el !== null) {
            (el as HTMLElement).style.pointerEvents = "all";
          }
          if (res.data.length === 0) {
            setActiveCounterYourLoots((prev) => prev - 10);
          }
        }
      }
    } catch (e) {
      setDateFormTextState("");
      setdatefrom("");
    }
  };

  const getAllLoots = async () => {
    if (publicKey !== null) {
      if (activeCounterAllLoots < 1) {
        setActiveCounterAllLoots((prev) => prev + 10);
        return;
      }
      let mass = [];
      const res = await axios.get<LootAll[]>(`${apiUrl}/api/v1/ticket/recentLoots?count=10&start=${activeCounterAllLoots}`, {});
      for (let i = 0; i < res.data.length; i++) {
        mass.push(res.data[i]);
        const date1 = new Date(res.data[i].redeemedAt);
        const utcStr = new Date().toUTCString();
      }
      setdataGetAllLoots(mass);
      if (res.data.length === 0) {
        setActiveCounterAllLoots((prev) => prev - 10);
      }
    }
  };

  const MyLootsActive = {
    Active: {
      color: "#ffc000",
      borderBottom: `1px solid ${colors[1]}`,
    },
    Inactive: {
      color: "#ffffff",
      borderBottom: `1px solid ${colors[1]}`,
    },
  };

  function copyText(ticket: string) {
    if (timeoutID1) {
      clearTimeout(timeoutID1);
    }
    if (timeoutID2) {
      clearTimeout(timeoutID2);
    }
    navigator.clipboard.writeText(ticket);
    let copySuccess = document.getElementById("copied-success");
    if (copySuccess !== null) {
      (copySuccess as HTMLElement).style.opacity = "1";
      (copySuccess as HTMLElement).style.display = "block";
    }
    const timeout1 = setTimeout(function () {
      (copySuccess as HTMLElement).style.opacity = "0";
    }, 1000);
    setTimeoutID1(timeout1);
    const timeout2 = setTimeout(function () {
      (copySuccess as HTMLElement).style.display = "none";
    }, 2000);
    setTimeoutID2(timeout2);
  }

  const pageScroll = async () => {
    if (timeoutID3) {
      clearTimeout(timeoutID3);
    }
    const blockBtn = document.querySelector(".listPageBtnSec");
    if (blockBtn !== null) {
      (blockBtn as HTMLElement).style.pointerEvents = "none";
    }
    setActiveCounterAllLoots((prev) => prev + 10);
    const timeout1 = setTimeout(function () {
      if (blockBtn !== null) {
        (blockBtn as HTMLElement).style.pointerEvents = "all";
      }
    }, 1000);
    setTimeoutID3(timeout1);
  };
  const pageScrollPrev = async () => {
    if (timeoutID4) {
      clearTimeout(timeoutID4);
    }
    const blockBtn = document.querySelector(".listPageBtnPrev");
    setActiveCounterAllLoots((prev) => prev - 10);
    const timeout2 = setTimeout(function () {
      if (blockBtn !== null) {
        (blockBtn as HTMLElement).style.pointerEvents = "all";
      }
    }, 1000);
    setTimeoutID4(timeout2);
  };

  const pageScroll2 = async () => {
    if (mylootsactiveElement === 2) {
      if (timeoutID5) {
        clearTimeout(timeoutID5);
      }
      const blockBtn = document.querySelector(".listPageBtnSec2");
      if (blockBtn !== null) {
        (blockBtn as HTMLElement).style.pointerEvents = "none";
      }
      setActiveCounterYourLoots((prev) => prev + 10);
      const timeout3 = setTimeout(function () {
        if (blockBtn !== null) {
          (blockBtn as HTMLElement).style.pointerEvents = "all";
        }
      }, 1000);
      setTimeoutID5(timeout3);
    } else if (mylootsactiveElement === 0) {
      if (timeoutID6) {
        clearTimeout(timeoutID6);
      }
      const blockBtn = document.querySelector(".listPageBtnSec2");
      if (blockBtn !== null) {
        (blockBtn as HTMLElement).style.pointerEvents = "none";
      }
      setActiveCounterYourLoots((prev) => prev + 10);
      const timeout4 = setTimeout(function () {
        if (blockBtn !== null) {
          (blockBtn as HTMLElement).style.pointerEvents = "all";
        }
      }, 1000);
      setTimeoutID6(timeout4);
    }
  };
  const pageScrollPrev2 = async () => {
    if (mylootsactiveElement === 2) {
      if (timeoutID7) {
        clearTimeout(timeoutID7);
      }
      const blockBtn = document.querySelector(".listPageBtnPrev2");
      setActiveCounterYourLoots((prev) => prev - 10);
      const timeout5 = setTimeout(function () {
        if (blockBtn !== null) {
          (blockBtn as HTMLElement).style.pointerEvents = "all";
        }
      }, 1000);
      setTimeoutID7(timeout5);
    } else if (mylootsactiveElement === 0) {
      if (timeoutID8) {
        clearTimeout(timeoutID8);
      }
      const blockBtn = document.querySelector(".listPageBtnPrev2");
      setActiveCounterYourLoots((prev) => prev - 10);
      const timeout6 = setTimeout(function () {
        if (blockBtn !== null) {
          (blockBtn as HTMLElement).style.pointerEvents = "all";
        }
      }, 1000);
      setTimeoutID8(timeout6);
    }
  };

  return (
    <div className="StatBlock">
      <div className="StatBlock_content">
        <div className="StatBlock_content_blockFirst" style={{ borderRight: `1px solid ${colors[1]}` }}>
          <div className="StatBlock_content_first_title" style={{ borderBottom: `1px solid ${colors[1]}` }}>
            Latest Loots
          </div>
          <div className="StatBlock_content_first">
            <div className="StatBlock_content_first_scroller">
              {dataGetAllLoots?.slice(0, 10).map((data, i) => (
                <li className="Loots_element Latest_Loots_element" key={i}>
                  <div
                    className="Loots_element_gradientBackground"
                    style={{
                      border: `1px solid ${colors[1]}`,
                      backdropFilter: "blur(10px)",
                    }}
                  ></div>
                  <div className="Loots_element_blockFlexRow">
                    <div className="textSelect" style={{ left: "0px" }}>
                      {data.user.slice(0, 4)}...
                      {data.user.substring(data.user.length - 4)}&nbsp;
                    </div>
                    <div className="Your_Loots_element_stat">
                      <div className="textSelect2">
                        opened <span>{data.lootboxAddress === "LumwEDLUuPJLJGo92QS4SQogDTwsXbyngGrbBt4qSdE" ? "LUMBEER LOOTBOX" : data.lootboxAddress === "Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ" ? "FREE LOOTBOX" : data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? "FREE LOOTBOX" : data.lootboxAddress === "8aRvDSPhkwCF3ezi1sbkHmTvePDnXZt77BSRNUpvvC6w" ? "TEST LOOTBOX" : "OG LOOTBOX"}</span>
                        &nbsp;
                      </div>
                      <div className="textSelect2">
                        and won{" "}
                        {data.loot.redeemResult === "NONE" ? (
                          <span>NOTHING</span>
                        ) : data.loot.redeemResult === "OG" ? (
                          <span>OG</span>
                        ) : data.loot.redeemResult === "FREE_MINT" ? (
                          <span>FREE MINT</span>
                        ) : (
                          <span>
                            {data.loot.amount !== undefined ? data.loot.amount / 1000000000 : ""}
                            &nbsp;{data.loot.redeemResult}
                          </span>
                        )}
                      </div>
                    </div>
                    {new Date(data.redeemedAt).getMinutes() >= 10 ? (
                      <div
                        style={{
                          position: "absolute",
                          right: "10px",
                        }}
                        className="timeOpenLootbox"
                      >
                        {timeAgo.format(new Date(data.redeemedAt))}
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          right: "10px",
                        }}
                        className="timeOpenLootbox"
                      >
                        {timeAgo.format(new Date(data.redeemedAt))}
                      </div>
                    )}
                  </div>
                  <div className="ticketNumberStyle" onClick={() => copyText(data.ticket)}>
                    <div className="copySvg">
                      <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <rect width="24" height="24" stroke="none" fill="#FFFFFF" opacity="0" />
                        <g transform="matrix(1 0 0 1 12 12)">
                          <path
                            style={{
                              stroke: "none",
                              strokeWidth: 1,
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeDashoffset: 0,
                              strokeLinejoin: "miter",
                              strokeMiterlimit: 4,
                              fill: "#FFFFFF",
                              fillRule: "nonzero",
                              opacity: 1,
                              transform: "translate(-12, -12)",
                            }}
                            d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="ticketNumberStyle_ticket">{data.ticket}</div>
                  </div>
                </li>
              ))}
            </div>
          </div>
          <div className="listPageBtn">
            <div className="listPageBtn_svgblock">
              <div className="listPageBtn_svgblock_svg listPageBtnPrev" onClick={() => pageScrollPrev()} style={{ pointerEvents: "all" }}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 54 54" xmlSpace="preserve" width={"26px"} height={"26px"} fill="white" style={{ transform: "scale(-1, 1" }}>
                  <g>
                    <path
                      d="M46.923,26.618c-0.051-0.123-0.124-0.233-0.217-0.326L30.707,10.293c-0.391-0.391-1.023-0.391-1.414,0
                                        s-0.391,1.023,0,1.414L43.586,26H1c-0.553,0-1,0.448-1,1s0.447,1,1,1h42.586L29.293,42.293c-0.391,0.391-0.391,1.023,0,1.414
                                        C29.488,43.902,29.744,44,30,44s0.512-0.098,0.707-0.293l15.999-15.999c0.093-0.092,0.166-0.203,0.217-0.326
                                        C47.024,27.138,47.024,26.862,46.923,26.618z"
                    />
                    <path d="M53,10c-0.553,0-1,0.448-1,1v32c0,0.552,0.447,1,1,1s1-0.448,1-1V11C54,10.448,53.553,10,53,10z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="listPageBtn_line"></div>
            <div className="listPageBtn_svgblock">
              <div className="listPageBtn_svgblock_svg listPageBtnSec" onClick={() => pageScroll()} style={{ pointerEvents: "all" }}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 54 54" xmlSpace="preserve" width={"26px"} height={"26px"} fill="white">
                  <g>
                    <path
                      d="M46.923,26.618c-0.051-0.123-0.124-0.233-0.217-0.326L30.707,10.293c-0.391-0.391-1.023-0.391-1.414,0
                                        s-0.391,1.023,0,1.414L43.586,26H1c-0.553,0-1,0.448-1,1s0.447,1,1,1h42.586L29.293,42.293c-0.391,0.391-0.391,1.023,0,1.414
                                        C29.488,43.902,29.744,44,30,44s0.512-0.098,0.707-0.293l15.999-15.999c0.093-0.092,0.166-0.203,0.217-0.326
                                        C47.024,27.138,47.024,26.862,46.923,26.618z"
                    />
                    <path d="M53,10c-0.553,0-1,0.448-1,1v32c0,0.552,0.447,1,1,1s1-0.448,1-1V11C54,10.448,53.553,10,53,10z" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="StatBlock_content_blockSecond" style={{ borderLeft: `0px solid ${colors[1]}` }}>
          <div className="StatBlock_content_text_titles">
            <div
              className="StatBlock_content_first_title MyLootsActive firstOnlyMobileStatBlock"
              style={mylootsactiveElement === 0 ? MyLootsActive.Active : MyLootsActive.Inactive}
              onClick={() => {
                mylootsactiveElement === 0 ? setActiveMenuElement(mylootsactiveElement) : setMyLootsActiveElement(0);
              }}
            >
              LATEST LOOTS
            </div>
            <div
              className="StatBlock_content_first_title MyLootsActive BetweenNotOnlyMobileStatBlock"
              style={mylootsactiveElement === 3 ? MyLootsActive.Active : MyLootsActive.Inactive}
              onClick={() => {
                mylootsactiveElement === 3 ? setActiveMenuElement(mylootsactiveElement) : setMyLootsActiveElement(3);
              }}
            >
              UNCLAIMED LOOTS
            </div>
            <div
              className="StatBlock_content_first_title MyLootsActive lastOnlyMobileStatBlock"
              style={mylootsactiveElement === 2 ? MyLootsActive.Active : MyLootsActive.Inactive}
              onClick={() => {
                mylootsactiveElement === 2 ? setMyLootsActiveElement(mylootsactiveElement) : setMyLootsActiveElement(2);
              }}
            >
              YOUR LOOTS
            </div>
          </div>
          <div className="StatBlock_content_second">
            <div className="StatBlock_content_first_scroller">
              {mylootsactiveElement === 3
                ? unclaimedTickets?.slice(0, 10).map((data, i) => (
                    <div className="Loots_element Your_Loots_element" key={i}>
                      <div
                        className="Loots_element_gradientBackground"
                        style={{
                          border: `1px solid ${colors[1]}`,
                          backdropFilter: "blur(10px)",
                        }}
                      ></div>
                      <div className="Loots_element_blockFlexRow">
                        <div className="Your_Loots_element_stat">
                          <div className="textSelect ticketTextunclmd" style={{ left: "0px" }}>
                            Unclaimed Loot Box #{i + 1}
                          </div>
                        </div>
                      </div>
                      <div className="OPENLBXUNCL btnOPENlbxtd" onClick={() => open_reclaimed(data, data.toBase58())} style={{ pointerEvents: "all" }}>
                        OPEN
                      </div>
                    </div>
                  ))
                : mylootsactiveElement === 2
                ? dataGetResultYourLoots?.slice(0, 10).map((data, i) => (
                    <div className="Loots_element Your_Loots_element" key={i}>
                      <div
                        className="Loots_element_gradientBackground"
                        style={{
                          border: `1px solid ${colors[1]}`,
                          backdropFilter: "blur(10px)",
                        }}
                      ></div>
                      <div className="Loots_element_blockFlexRow">
                        <div className="Your_Loots_element_stat">
                          <div className="textSelect" style={{ left: "0px" }}>
                            You opened <span>{data.lootboxAddress === "LumwEDLUuPJLJGo92QS4SQogDTwsXbyngGrbBt4qSdE" ? "LUMBEER LOOTBOX" : data.lootboxAddress === "Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ" ? "FREE LOOTBOX" : data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? "FREE LOOTBOX" : data.lootboxAddress === "8aRvDSPhkwCF3ezi1sbkHmTvePDnXZt77BSRNUpvvC6w" ? "TEST LOOTBOX" : "OG LOOTBOX"}</span> and won{" "}
                            {data.loot.redeemResult === "NONE" ? (
                              <span>NOTHING</span>
                            ) : data.loot.redeemResult === "OG" ? (
                              <span>OG</span>
                            ) : data.loot.redeemResult === "FREE_MINT" ? (
                              <span>FREE MINT</span>
                            ) : (
                              <span>
                                {data.loot.amount !== undefined ? data.loot.amount / 1000000000 : ""}
                                &nbsp;{data.loot.redeemResult}
                              </span>
                            )}
                          </div>
                        </div>
                        {new Date(data.redeemedAt).getMinutes() >= 10 ? (
                          <div
                            style={{
                              position: "absolute",
                              right: "10px",
                            }}
                            className="timeOpenLootbox"
                          >
                            {timeAgo.format(new Date(data.redeemedAt))}
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              right: "10px",
                            }}
                            className="timeOpenLootbox"
                          >
                            {timeAgo.format(new Date(data.redeemedAt))}
                          </div>
                        )}
                      </div>
                      <div className="ticketNumberStyle" onClick={() => copyText(data.ticket)}>
                        <div className="copySvg">
                          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <rect width="24" height="24" stroke="none" fill="#FFFFFF" opacity="0" />
                            <g transform="matrix(1 0 0 1 12 12)">
                              <path
                                style={{
                                  stroke: "none",
                                  strokeWidth: 1,
                                  strokeDasharray: "none",
                                  strokeLinecap: "butt",
                                  strokeDashoffset: 0,
                                  strokeLinejoin: "miter",
                                  strokeMiterlimit: 4,
                                  fill: "#FFFFFF",
                                  fillRule: "nonzero",
                                  opacity: 1,
                                  transform: "translate(-12, -12)",
                                }}
                                d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
                                strokeLinecap="round"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="ticketNumberStyle_ticket">{data.ticket}</div>
                      </div>
                    </div>
                  ))
                : mylootsactiveElement === 1
                ? dataStat?.slice(0, 10).map((data, i) => (
                    <div className="Loots_element Your_Loots_element" key={i}>
                      <div
                        className="Loots_element_gradientBackground"
                        style={{
                          border: `1px solid ${colors[1]}`,
                          backdropFilter: "blur(10px)",
                        }}
                      ></div>
                      <div className="Your_Loots_element_stat">
                        <div className="textSelect">You didn't open the LootBox - &nbsp;</div>
                        <div className="textSelect">Open</div>
                      </div>
                    </div>
                  ))
                : dataGetAllLoots?.slice(0, 10).map((data, i) => (
                    <li className="Loots_element Latest_Loots_element" key={i}>
                      <div
                        className="Loots_element_gradientBackground"
                        style={{
                          border: `1px solid ${colors[1]}`,
                          backdropFilter: "blur(10px)",
                        }}
                      ></div>
                      <div className="Loots_element_blockFlexRow">
                        <div className="textSelect" style={{ left: "0px" }}>
                          {data.user.slice(0, 5)}...&nbsp;
                        </div>
                        <div className="Your_Loots_element_stat">
                          <div className="textSelect2">
                            opened <span>{data.lootboxAddress === "LumwEDLUuPJLJGo92QS4SQogDTwsXbyngGrbBt4qSdE" ? "LUMBEER LOOTBOX" : data.lootboxAddress === "Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ" ? "FREE LOOTBOX" : data.lootboxAddress === "EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea" ? "FREE LOOTBOX" : data.lootboxAddress === "8aRvDSPhkwCF3ezi1sbkHmTvePDnXZt77BSRNUpvvC6w" ? "TEST LOOTBOX" : "OG LOOTBOX"}</span>
                            &nbsp;
                          </div>
                          <div className="textSelect2">
                            and won{" "}
                            {data.loot.redeemResult === "NONE" ? (
                              <span>NOTHING</span>
                            ) : data.loot.redeemResult === "OG" ? (
                              <span>OG</span>
                            ) : data.loot.redeemResult === "FREE_MINT" ? (
                              <span>FREE MINT</span>
                            ) : (
                              <span>
                                {data.loot.amount !== undefined ? data.loot.amount / 1000000000 : ""}
                                &nbsp;{data.loot.redeemResult}
                              </span>
                            )}
                          </div>
                        </div>
                        {new Date(data.redeemedAt).getMinutes() >= 10 ? (
                          <div
                            style={{
                              position: "absolute",
                              right: "10px",
                            }}
                            className="timeOpenLootbox"
                          >
                            {timeAgo.format(new Date(data.redeemedAt))}
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "absolute",
                              right: "10px",
                            }}
                            className="timeOpenLootbox"
                          >
                            {timeAgo.format(new Date(data.redeemedAt))}
                          </div>
                        )}
                      </div>
                      <div className="ticketNumberStyle" onClick={() => copyText(data.ticket)}>
                        <div className="copySvg">
                          <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <rect width="24" height="24" stroke="none" fill="#FFFFFF" opacity="0" />
                            <g transform="matrix(1 0 0 1 12 12)">
                              <path
                                style={{
                                  stroke: "none",
                                  strokeWidth: 1,
                                  strokeDasharray: "none",
                                  strokeLinecap: "butt",
                                  strokeDashoffset: 0,
                                  strokeLinejoin: "miter",
                                  strokeMiterlimit: 4,
                                  fill: "#FFFFFF",
                                  fillRule: "nonzero",
                                  opacity: 1,
                                  transform: "translate(-12, -12)",
                                }}
                                d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"
                                strokeLinecap="round"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="ticketNumberStyle_ticket">{data.ticket}</div>
                      </div>
                    </li>
                  ))}
            </div>
          </div>
          <div className="listPageBtn">
            <div className="listPageBtn_svgblock">
              <div className="listPageBtn_svgblock_svg listPageBtnPrev2" onClick={() => pageScrollPrev2()} style={{ pointerEvents: "all" }}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 54 54" xmlSpace="preserve" width={"26px"} height={"26px"} fill="white" style={{ transform: "scale(-1, 1" }}>
                  <g>
                    <path
                      d="M46.923,26.618c-0.051-0.123-0.124-0.233-0.217-0.326L30.707,10.293c-0.391-0.391-1.023-0.391-1.414,0
                                        s-0.391,1.023,0,1.414L43.586,26H1c-0.553,0-1,0.448-1,1s0.447,1,1,1h42.586L29.293,42.293c-0.391,0.391-0.391,1.023,0,1.414
                                        C29.488,43.902,29.744,44,30,44s0.512-0.098,0.707-0.293l15.999-15.999c0.093-0.092,0.166-0.203,0.217-0.326
                                        C47.024,27.138,47.024,26.862,46.923,26.618z"
                    />
                    <path d="M53,10c-0.553,0-1,0.448-1,1v32c0,0.552,0.447,1,1,1s1-0.448,1-1V11C54,10.448,53.553,10,53,10z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="listPageBtn_line"></div>
            <div className="listPageBtn_svgblock">
              <div className="listPageBtn_svgblock_svg listPageBtnSec2" onClick={() => pageScroll2()} style={{ pointerEvents: "all" }}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 54 54" xmlSpace="preserve" width={"26px"} height={"26px"} fill="white">
                  <g>
                    <path
                      d="M46.923,26.618c-0.051-0.123-0.124-0.233-0.217-0.326L30.707,10.293c-0.391-0.391-1.023-0.391-1.414,0
                                                s-0.391,1.023,0,1.414L43.586,26H1c-0.553,0-1,0.448-1,1s0.447,1,1,1h42.586L29.293,42.293c-0.391,0.391-0.391,1.023,0,1.414
                                                C29.488,43.902,29.744,44,30,44s0.512-0.098,0.707-0.293l15.999-15.999c0.093-0.092,0.166-0.203,0.217-0.326
                                                C47.024,27.138,47.024,26.862,46.923,26.618z"
                    />
                    <path d="M53,10c-0.553,0-1,0.448-1,1v32c0,0.552,0.447,1,1,1s1-0.448,1-1V11C54,10.448,53.553,10,53,10z" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lates_your_loots;
