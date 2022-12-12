import { FC, useState, useEffect, useMemo } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./mobileNav.css";
import "./Wallet.css";
import { walletButton } from "../../style/styles";
import Preloader from "../preloader/preloader";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Main from "../Main";
// import OgLootbox from "../custom_lootboxes/og_lootbox/og_lootbox";
// import Free_checkTWDS_lootbox from "../custom_lootboxes/free_checkTWDS_lootbox/free_checkTWDS_lootbox";
import Lootbox_00_2 from "../custom_lootboxes/Lootbox_00_2/Lootbox_00_2";
import MainLootboxes from "../custom_lootboxes/MainLootboxes/MainLootboxes";
import { AnchorProvider } from "@project-serum/anchor";
import "../../App.css";
import Faq from "../FAQ/faq";
// import Loot_pool_wallets from "../loot_pool_wallets/loot_pool_wallets";
import Support from "../support/support";
import "../footer.css";
import footerLogo from "../../media/logoPreolder2.webp";
// import Free_lootbox_2 from "../custom_lootboxes/free_lootbox_2/free_lootbox_2";
// import Og_lootbox_2 from "../custom_lootboxes/og_lootbox_2/og_lootbox_2";
import Lumbeer_lootboxIMG from "../../media/lumbeerLootBox.png";

import { win_variants1, whitelist_win_variants, win_variantsTest, display_FREE_TWDS_lootbox, win_variants2, win_variants3 } from "../../win_variants";

// import OG_image from "../../media/OG_lootbox.webp";
import free_image from "../../media/free_lootbox.png";
import white_image from "../../media/whiteLootbox.png";
import background_image1 from "../../media/lootbox_wood_T_fin.webp";
import background_image2 from "../../media/lootbox_cyber_T_fin.webp";
import background_image3 from "../../media/lootbox_ultra_T_fin.webp";
import lumb_yellow from "../../media/lumb_yellow.png";

import ProfilePage from "../ProfilePage/ProfilePage";

export function useProvider() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {
      commitment: "finalized",
    });
  }, [connection, wallet]);

  return provider;
}

interface Props {
  setColor: (value: string) => void;
  color: string;
}

const Wallet: FC<Props> = ({ setColor, color }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<Number>();
  const wallet = useAnchorWallet();

  const [activeMenuElement, setActiveMenuElement] = useState<Number>(0);

  const ChangeActiveMenuElement = (value: Number) => {
    setActiveMenuElement(value);
  };

  useEffect(() => {
    const send = async () => {
      try {
        if (publicKey != null) {
          let balance = await connection.getBalance(publicKey, "confirmed");
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      } catch (e) {}
    };
    send();
    const wallet_adapter_dropdown = document.querySelectorAll(".wallet-adapter-dropdown .wallet-adapter-dropdown-list .wallet-adapter-dropdown-list-item")[2];
    if (wallet_adapter_dropdown != null) {
      wallet_adapter_dropdown.addEventListener("click", function () {
        setBalance(undefined);
      });
    }
  }, [wallet]);

  const onChange = (newBalance: Number) => {
    setBalance(newBalance);
  };

  const [isrender, setisrender] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setisrender(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!isrender) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isrender]);

  const MenuElementState = (index: number) => {
    document.body.style.overflowY = "scroll";

    setActiveMenuElement(index);
    setColor(`#ffc000`);
    const footerPosition = document.querySelector(".footer");
    if (index !== 0) {
      if (footerPosition !== null) {
        (footerPosition as HTMLElement).style.position = "absolute";
      }
    }
    const checkbox = document.getElementById("checkbox");
    if (checkbox !== null) {
      if ((checkbox as HTMLInputElement).checked === true) {
        (checkbox as HTMLInputElement).checked = false;
      }
    }
    if (index === 0) {
      const footer = document.querySelector(".footer");
      if (footer !== null) {
        (footer as HTMLElement).style.display = "block";
      }
    }
  };

  useEffect(() => {
    const el = document.querySelectorAll(".MenuElement");
    if (el !== null) {
      for (let i = 0; i < el.length; i++) {
        if (i === activeMenuElement) {
          el[i].classList.add("rainbow-animated");
          el[i].classList.remove("rainbow-animated2");
        } else {
          el[i].classList.remove("rainbow-animated");
          el[i].classList.add("rainbow-animated2");
        }
      }
    }
  }, [activeMenuElement]);

  return (
    <div className="App2">
      {!isrender && <Preloader />}
      <BrowserRouter>
        <div className="AppBacdrop_title">
          <Link to="/" className="Loot_color_darkThemeLink_2" onClick={() => MenuElementState(0)}>
            <div className="logo imageLogoAppBacdrop_title"></div>
            <h1>LOOTBEERS</h1>
          </Link>
        </div>
        <div className="MainBlock">
          <div className="MainBlockProfile" style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}`, borderRight: `1px solid ${color}` }}>
            <Link to="/profile/" className="ImageMan">
              <img src={lumb_yellow} alt="" />
            </Link>
            <div style={{ color: "white", position: "relative", fontSize: "14px", fontFamily: "GraphikLCG-Regular", fontWeight: "normal", whiteSpace: "nowrap" }} className="balanceStyle">
              <Link to="/profile/" className="nickname">
                LUMBEER
              </Link>
              {balance?.toFixed(2) ? <span style={{ color: `${color}` }}>$SOL&nbsp;{balance?.toFixed(2)}</span> : null}
            </div>
            <WalletMultiButton style={walletButton} className="wl_btn" />
          </div>
          <div className="blockMenuZIndex" onClick={undefined}>
            <div className="menuToggleBlock">
              <div id="menuToggle">
                <input type="checkbox" id="checkbox" title="checkbox" />
                <span></span>
                <span></span>
                <span></span>
                <ul id="menu" style={{ display: "flex" }}>
                  <li className="MenuElement thirdMenuElement">
                    <Link to="/" title="home" onClick={() => MenuElementState(0)}>
                      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>HOME PAGE</div>
                    </Link>
                  </li>
                  <li className="MenuElement fourthMenuElement">
                    <Link to="/faq" title="faq" onClick={() => MenuElementState(1)}>
                      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>FAQ</div>
                    </Link>
                  </li>
                  <li className="MenuElement fifthMenuElement">
                    <Link to="/" title="lpw" onClick={() => MenuElementState(0)}>
                      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>LOOT POOL WALLETS</div>
                    </Link>
                  </li>
                  <li className="MenuElement sixthMenuElement">
                    <Link to="/support" title="support" onClick={() => MenuElementState(3)}>
                      <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>SUPPORT</div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Main setColor={setColor} />} />
          <Route path="*" element={<Main setColor={setColor} />} />
          <Route path="/faq" element={<Faq setActiveMenuElement={ChangeActiveMenuElement} />} />
          {/* <Route path="/loot_pool_wallets" element={<Loot_pool_wallets setActiveMenuElement={ChangeActiveMenuElement} />} /> */}
          <Route path="/support" element={<Support setActiveMenuElement={ChangeActiveMenuElement} />} />
          <Route index element={<Main setColor={setColor} />} />
          {/* <Route path="/og_lootbox/" element={<OgLootbox onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={OG_image} title={"OG LOOTBOX"} URLtitle={"og_loot_box"} colors={["#05903300", "#059033", "#355A20"]} win_variants={OG_win_variants2} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} /> */}
          <Route path="/lumbeer_loot_box/" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={Lumbeer_lootboxIMG} title={"LUMBEER LOOTBOX"} URLtitle={"lumbeer_loot_box/"} colors={["#8f4a3000", "#8f4a30", "#641010"]} win_variants={whitelist_win_variants} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} />
          {/* <Route path="/lumbeer_loot_box/" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={Lumbeer_lootboxIMG} title={"OG LOOTBOX"} URLtitle={"lumbeer_loot_box/*"} colors={["#8f4a3000", "#8f4a30", "#641010"]} win_variants={OG_win_variants} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} /> */}
          {/* <Route path="/free_lootbox/*" element={<Free_checkTWDS_lootbox onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={free_image} title={"FREE LOOTBOX"} URLtitle={"free_lootbox/"} colors={["#629bcd00", "#629bcd", "#0c1b2c"]} win_variants={FREE_TWDS_lootbox} lootboxAddress={"EewK2hy4FbNyh8JemPpd671xkh1BZkLAuGr3VBxME1Ea"} text={["", "", "", "", "", "", "", "", ""]} />} /> */}
          {/* {getCookie("fgiwf333666dksf4") === "true" ? <Route path="/free_lootbox/*" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={free_image} title={"FREE LOOTBOX"} URLtitle={"free_lootbox/"} colors={["#629bcd00", "#629bcd", "#0c1b2c"]} win_variants={display_FREE_TWDS_lootbox} lootboxAddress={"Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ"} text={["", "", "", "", "", "", "", "", ""]} />} /> : null} */}
          <Route path="/free_lootbox/*" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0} picture={free_image} title={"FREE LOOTBOX"} URLtitle={"free_lootbox/"} colors={["#629bcd00", "#629bcd", "#0c1b2c"]} win_variants={display_FREE_TWDS_lootbox} lootboxAddress={"Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ"} text={["", "", "", "", "", "", "", "", ""]} />} />
          <Route path="/lootbox_00_1/*" element={<Lootbox_00_2 onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0.01} picture={white_image} title={"TEST LOOTBOX"} URLtitle={"lootbox_00_1/"} colors={["#a1adbd00", "#a1adbd", "#5e606f"]} win_variants={win_variantsTest} lootboxAddress={"8aRvDSPhkwCF3ezi1sbkHmTvePDnXZt77BSRNUpvvC6w"} text={["", "", "", "", "", "", "", "", ""]} />} />
          <Route path="/wooden_loot_box/*" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0.05} picture={background_image1} title={"Wooden Loot Box"} URLtitle={"wooden_loot_box/"} colors={["#66a5ad00", "#66a5ad", "#121f21"]} win_variants={win_variants1} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} />
          <Route path="/carbon_loot_box/*" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0.2} picture={background_image2} title={"Carbon Loot Box"} URLtitle={"carbon_loot_box/"} colors={["#ebc80800", "#ebc808", "#312a02"]} win_variants={win_variants2} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} />
          <Route path="/magnetic_loot_box/*" element={<MainLootboxes onChange={onChange} setColor={setColor} setActiveMenuElement={ChangeActiveMenuElement} price={0.5} picture={background_image3} title={"Magnetic Loot Box"} URLtitle={"magnetic_loot_box/"} colors={["#8e08eb00", "#8e08eb", "#1d0231"]} win_variants={win_variants3} lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} text={["", "", "", "", "", "", "", "", ""]} />} />
          <Route path="/profile/*" element={<ProfilePage />} />
        </Routes>
        <div className="footer" style={{ display: "block", position: "unset" }}>
          <div className="socialLinks">
            <a className="header_a" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer" style={{ marginRight: "20px" }}>
              <svg className="header_a_svg" fill="#FFFFFF" viewBox="0 0 71 55" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                </g>
              </svg>
            </a>
            <a className="header_a" href="https://discord.gg/lumbeers" target="_blank" rel="noopener noreferrer">
              <img src={footerLogo} alt="" />
            </a>
            <a className="header_a" href="https://twitter.com/lumbeers" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="header_a_svg" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Wallet;
