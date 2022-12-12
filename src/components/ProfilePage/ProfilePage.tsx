import { useEffect, useState } from "react";
import "./ProfilePage.scss";
import lumb_yellow from "../../media/lumb_yellow.png";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "DAILY OPENING CHART",
    },
  },
  scales: {
    x: {
      grid: {
        color: "#4D4D4D",
        borderColor: "#4D4D4D", 
      },
    },
    y: {
      grid: {
        color: "#4D4D4D",
        borderColor: "#4D4D4D",
      },
    },
  },
};

interface tlon {
  lootboxName: string;
  openedCount: number;
}

interface DiagramInterface {
  day: string;
  totalSpent: number;
}

interface pnlI {
  profits: number;
  loss: number;
}

interface data {
  data: dataUser;
}

interface dataUser {
  pnLAllTime: pnlI;
  pnLLastMonth: pnlI;
  lootboxesAllTime: Array<tlon>;
  lootboxesLastMonth: Array<tlon>;
  moneySpentRecently: Array<DiagramInterface>;
}

const ProfilePage = () => {
  const [labels, setLabels] = useState<Array<string>>(["01/12", "02/12", "03/12", "04/12", "05/12", "06/12", "07/12"]);
  const [labelsData, setLabelsData] = useState<Array<number>>([0, 0, 0, 0, 0, 0, 0]);

  let dataDi = {
    labels: labels,
    datasets: [
      {
        // title: "My First dataset",
        pointBackgroundColor: "#00FFF0",
        backgroundColor: "#00FFF0",
        pointBorderColor: "#00FFF0",
        borderColor: "#EBC808",
        data: labelsData,
        drawActiveElementsOnTop: false,
        tension: 0.4,
      },
    ],
  };

  const [timeoutID1, setTimeoutID1] = useState<any>();
  const [timeoutID2, setTimeoutID2] = useState<any>();
  const [nvb, setnvb] = useState<any>();
  const [activeNvb, setActiveNvb] = useState<number>(0);

  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  const [dataUser, setDataUser] = useState<dataUser>();

  const [totalOpenCount, setTotalOPenCount] = useState<number>();
  const [totalOpenCountSOL, setTotalOPenCountSOL] = useState<number>();
  const [pnlStat, setpnlStat] = useState<number>();
  const [pnlStatLastMonth, setpnlStatLastMonth] = useState<number>();
  const [dateFromDI, setdateFromDI] = useState<string>();
  const [dateToDI, setdateToDI] = useState<string>();

  const [learmoreStat, setLearnMoreStat] = useState<Boolean>(false);
  const [learmoreStat2, setLearnMoreStat2] = useState<Boolean>(false);

  useEffect(() => {
    switch (activeNvb) {
      case 0:
        (document.querySelector(".nvb1") as HTMLElement).style.opacity = "1";
        (document.querySelector(".nvb2") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb3") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb1_Content") as HTMLElement).style.display = "flex";
        (document.querySelector(".nvb2_Content") as HTMLElement).style.display = "none";
        (document.querySelector(".nvb3_Content") as HTMLElement).style.display = "none";
        break;
      case 1:
        (document.querySelector(".nvb1") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb2") as HTMLElement).style.opacity = "1";
        (document.querySelector(".nvb3") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb1_Content") as HTMLElement).style.display = "none";
        (document.querySelector(".nvb2_Content") as HTMLElement).style.display = "flex";
        (document.querySelector(".nvb3_Content") as HTMLElement).style.display = "none";
        break;
      case 2:
        (document.querySelector(".nvb1") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb2") as HTMLElement).style.opacity = "0.6";
        (document.querySelector(".nvb3") as HTMLElement).style.opacity = "1";
        (document.querySelector(".nvb1_Content") as HTMLElement).style.display = "none";
        (document.querySelector(".nvb2_Content") as HTMLElement).style.display = "none";
        (document.querySelector(".nvb3_Content") as HTMLElement).style.display = "flex";
        break;
      default:
        break;
    }
  }, [activeNvb]);

  useEffect(() => {
    getDataProfile();
  }, [wallet]);

  useEffect(() => {
    setnvb(document.querySelectorAll(".nvb"));
    const footer = document.querySelector(".footer");
    if (footer !== null) {
      (footer as HTMLElement).style.display = "block";
      (footer as HTMLElement).style.position = "absolute";
    }

    const MenuElementFocus = document.getElementById("menu");
    const checkbox = document.getElementById("checkbox");
    const Profile = document.querySelector(".Profile");

    if (MenuElementFocus !== null && Profile !== null && checkbox !== null) {
      Profile.addEventListener("click", (e) => {
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
  }, []);

  async function getDataProfile() {
    try {
      if (publicKey !== null) {
        const data = await axios.get<dataUser>(`https://lootbeers.com/api/v1/statistics/user?address=${publicKey.toBase58()}`);
        setDataUser(data.data);
        let summOpen = 0;
        let summOpenSOL = 0;
        let massMonthlyResent: Array<number> = [];
        let massMonthlyResentDays: Array<string> = [];
        data.data.lootboxesAllTime.forEach((el) => {
          summOpen = summOpen + el.openedCount;
          el.lootboxName === "Test lootbox" ? (summOpenSOL = summOpenSOL + 0.01 * el.openedCount) : el.lootboxName === "Wooden Loot Box" ? (summOpenSOL = summOpenSOL + 0.05 * el.openedCount) : el.lootboxName === "Carbon Loot Box" ? (summOpenSOL = summOpenSOL + 0.2 * el.openedCount) : el.lootboxName === "Magnetic Loot Box" ? (summOpenSOL = summOpenSOL + 0.5 * el.openedCount) : (summOpenSOL = summOpenSOL);
        });

        let dayfrom, dayTo;
        let iCheck = 0;

        data.data.moneySpentRecently.forEach((el) => {
          massMonthlyResent.push(el.totalSpent);
          let day = new Date(el.day);
          massMonthlyResentDays.push(`${day.getUTCDate()}/${day.getUTCMonth() + 1}`);
          iCheck === 0 ? (dayfrom = `${day.getUTCDate()}/${day.getUTCMonth() + 1}/${day.getUTCFullYear()}`) : iCheck === 6 ? (dayTo = `${day.getUTCDate()}/${day.getUTCMonth() + 1}/${day.getUTCFullYear()}`) : (iCheck = iCheck);
          iCheck++;
        });
        massMonthlyResentDays.reverse();
        massMonthlyResent.reverse();

        setdateFromDI(dayfrom);
        setdateToDI(dayTo);
        setLabels(massMonthlyResentDays);
        setLabelsData(massMonthlyResent);
        setpnlStat(data.data.pnLAllTime.profits / 1000000000 - data.data.pnLAllTime.loss);
        setpnlStatLastMonth(data.data.pnLLastMonth.profits / 1000000000 - data.data.pnLLastMonth.loss);
        setTotalOPenCount(summOpen);
        setTotalOPenCountSOL(summOpenSOL);
      }
    } catch (e) {}
  }

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

  useEffect(() => {
    const svgscale = document.querySelector(".LearnMoreBlock svg");
    if (learmoreStat === true) {
      const el = document.querySelector(".LearnMoreVisibility");
      (el as HTMLElement).style.maxHeight = "250px";
      (svgscale as HTMLElement).style.transform = "scale(-1,-1)";
    } else {
      const el = document.querySelector(".LearnMoreVisibility");
      (el as HTMLElement).style.maxHeight = "0px";
      (svgscale as HTMLElement).style.transform = "scale(1,1)";
    }
  }, [learmoreStat]);

  useEffect(() => {
    const svgscale = document.querySelector(".LearnMoreBlock2 svg");
    if (learmoreStat2 === true) {
      const el = document.querySelector(".LearnMoreVisibility2");
      (el as HTMLElement).style.maxHeight = "250px";
      (svgscale as HTMLElement).style.transform = "scale(-1,-1)";
    } else {
      const el = document.querySelector(".LearnMoreVisibility2");
      (el as HTMLElement).style.maxHeight = "0px";
      (svgscale as HTMLElement).style.transform = "scale(1,1)";
    }
  }, [learmoreStat2]);

  return (
    <div className="Profile">
      <div className="ProfileBlock">
        <div className="ProfileBlockBorder">
          <div className="ProfileBlockBorder_left">
            <div className="ProfileMain">
              <div className="ProfileMain_lumb_yellow">
                <img src={lumb_yellow} alt="" />
              </div>
              <div className="ProfileMain_dataUS_and_connect">
                <div className="ProfileMain_dataUS_and_connect_nick">LUMBEER</div>
                <div className="ProfileMain_dataUS_and_connect_nicksvg">
                  <div className="copySvgProfile" onClick={() => copyText(`${publicKey?.toBase58()}`)}>
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
                    <div className="copyTextProfile">{wallet?.publicKey.toBase58().slice(0, 4)}...{wallet?.publicKey.toBase58().slice(wallet?.publicKey.toBase58().length - 4, wallet?.publicKey.toBase58().length)}</div>
                  </div>
                </div>
                <div className="btnConnectTwitter_Profile">CONNECT TWITTER</div>
              </div>
            </div>
            <div className="AffilateBlock">
              <span className="affiliateEnter_title">Enter an affiliate code</span>
              <div className="Affilatecode">code</div>
              <div className="anonymousStayProfile">
                <span>Stay anonymous</span>
                <div className="infoAffilate">i</div>
              </div>
              <div className="AffilateStatus">Affiliate Partnership Status: ACTIVE</div>
              <div className="CopyrightStatus">
                Copyright © 2022 | All rights reserved |{" "}
                <a href="https://twitter.com/lumbeers" style={{ cursor: "pointer", textDecoration: "none", color: "#ebc808", fontSize: "12px" }}>
                  Contact
                </a>
              </div>
            </div>
            <div className="ProfileBlockBorder_left_line ProfileBlockBorder_left_line_leftdisplay"></div>
          </div>
          <div className="ProfileBlockBorder_right">
            <div className="NavBarProfile">
              <div className="nvb nvb1" style={{ opacity: "1" }} onClick={() => setActiveNvb(0)}>
                STATISTICS
              </div>
              <div className="nvb nvb2" style={{ opacity: "0.6" }} onClick={() => setActiveNvb(1)}>
                REFERRAL
              </div>
              <div className="nvb nvb3" style={{ opacity: "0.6" }} onClick={() => setActiveNvb(2)}>
                COMPETITION
              </div>
            </div>
            <div className="MainContentProfile">
              <div className="nvb_Content nvb1_Content" style={{ display: "flex" }}>
                <div className="content_nvb1_Content">
                  <div className="PnL_Statement_block">
                    <span className="PnL_title">PnL Statement</span>
                    <span className="statElement_PnL" style={pnlStatLastMonth !== undefined ? (pnlStatLastMonth >= 0 ? { color: "rgba(72, 193, 94, 0.7)" } : { color: "rgb(220,20,60,0.85)" }) : { color: "rgba(72, 193, 94, 0.7)" }}>
                      {pnlStat !== undefined ? (pnlStat >= 0 ? `+ ${pnlStat?.toFixed(2)} SOL` : `${pnlStat?.toFixed(2)} SOL`) : `0 SOL`}
                    </span>
                    <div className="ProfileBlockBorder_left_line PnL_Statement_block_line"></div>
                    <span className="PnL_title">last month</span>
                    <span className="statElement_PnL" style={pnlStatLastMonth !== undefined ? (pnlStatLastMonth >= 0 ? { color: "rgba(72, 193, 94, 0.7)" } : { color: "rgb(220,20,60,0.85)" }) : { color: "rgba(72, 193, 94, 0.7)" }}>
                      {pnlStatLastMonth !== undefined ? (pnlStatLastMonth >= 0 ? `+ ${pnlStatLastMonth?.toFixed(2)} SOL` : `${pnlStatLastMonth?.toFixed(2)} SOL`) : `0 SOL`}
                    </span>
                  </div>
                  <div className="TotalStatBlock">
                    <div className="TotalOpen">
                      <div className="TotalOpenTitle">Total opened</div>
                      <div className="TotalOpenContent">
                        <div className="numberOpenTotal">{totalOpenCount}</div>
                        <div className="ProfileBlockBorder_left_line PnL_Statement_block_line Total_Statement_block_line"></div>
                        <div className="lastMonthTotal">last month</div>
                        <div className="percentTotal">+100%</div>
                      </div>
                      <div className="LearnMoreVisibility" style={{ maxHeight: "0px" }}>
                        {dataUser?.lootboxesAllTime.map((data, i) => {
                          return (
                            <div className="BlockInfo" key={i}>
                              <div className="lootboxName_blockinfo">{data.lootboxName === "Free loot event lootbox" ? "FREE LOOTBOX" : data.lootboxName}</div>
                              <div className="openedCount">{data.openedCount}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div onClick={() => setLearnMoreStat((prev) => !prev)} className="LearnMoreBlock">
                        <span>Learn More</span>
                        <svg style={{ transform: "scale(1,1)" }} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="path-1-inside-1_41_118" fill="white">
                            <path d="M0.0356445 7.03555L7.07119 7.99968e-06L14.0357 6.96449L7.00012 14L0.0356445 7.03555Z" />
                          </mask>
                          <path d="M7.00012 14L6.29302 14.7071L7.00012 15.4142L7.70723 14.7071L7.00012 14ZM13.3286 6.25738L6.29302 13.2929L7.70723 14.7071L14.7428 7.67159L13.3286 6.25738ZM7.70723 13.2929L0.742751 6.32845L-0.671462 7.74266L6.29302 14.7071L7.70723 13.2929Z" fill="white" fillOpacity="0.7" mask="url(#path-1-inside-1_41_118)" />
                        </svg>
                      </div>
                    </div>
                    <div className="TotalOpen">
                      <div className="TotalOpenTitle">Total SOL spent</div>
                      <div className="TotalOpenContent">
                        <div className="numberOpenTotal">{totalOpenCountSOL?.toFixed(2)}</div>
                        <div className="ProfileBlockBorder_left_line PnL_Statement_block_line Total_Statement_block_line"></div>
                        <div className="lastMonthTotal">last month</div>
                        <div className="percentTotal">+100%</div>
                      </div>
                      <div className="LearnMoreVisibility2" style={{ maxHeight: "0px" }}>
                        {dataUser?.lootboxesLastMonth.map((data, i) => {
                          return (
                            <div className="BlockInfo2" key={i}>
                              <div className="lootboxName_blockinfo">{data.lootboxName === "Free loot event lootbox" ? "FREE LOOTBOX" : data.lootboxName}</div>
                              <div className="openedCount">{data.lootboxName === "Free loot event lootbox" ? data.openedCount * 0 : data.lootboxName === "Test lootbox" ? (data.openedCount * 0.01).toFixed(2) : data.lootboxName === "OG lootbox" ? data.openedCount * 0 : data.openedCount}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div onClick={() => setLearnMoreStat2((prev) => !prev)} className="LearnMoreBlock2">
                        <span>Learn More</span>
                        <svg style={{ transform: "scale(1,1)" }} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <mask id="path-1-inside-1_41_118" fill="white">
                            <path d="M0.0356445 7.03555L7.07119 7.99968e-06L14.0357 6.96449L7.00012 14L0.0356445 7.03555Z" />
                          </mask>
                          <path d="M7.00012 14L6.29302 14.7071L7.00012 15.4142L7.70723 14.7071L7.00012 14ZM13.3286 6.25738L6.29302 13.2929L7.70723 14.7071L14.7428 7.67159L13.3286 6.25738ZM7.70723 13.2929L0.742751 6.32845L-0.671462 7.74266L6.29302 14.7071L7.70723 13.2929Z" fill="white" fillOpacity="0.7" mask="url(#path-1-inside-1_41_118)" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="diagramStat">
                    <div className="diagramStatTitle">
                      <span>SOL SPENT DAILY</span>
                      <span>
                        {dateToDI} — {dateFromDI}
                      </span>
                    </div>
                    <Line data={dataDi} options={options} />
                  </div>
                  {/* <div className="registerData">Registration date 1/12/2022 </div> */}
                </div>
              </div>
              <div className="nvb_Content nvb2_Content" style={{ display: "none" }}>
                <span className="temporary_stub">SOON</span>
                <div className="content_nvb2_Content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci inventore odio sint blanditiis, maiores in minus temporibus vel quisquam voluptatum ipsam non nobis quibusdam pariatur! In delectus repellat corporis reiciendis?</div>
              </div>
              <div className="nvb_Content nvb3_Content" style={{ display: "none" }}>
                <span className="temporary_stub">SOON</span>
                <div className="content_nvb3_Content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci inventore odio sint blanditiis, maiores in minus temporibus vel quisquam voluptatum ipsam non nobis quibusdam pariatur! In delectus repellat corporis reiciendis?</div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
