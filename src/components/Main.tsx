import "../App.css";
import "../fonts/fonts.css";
import Loot_block from "./loot_block/loot_block";
import background_image1 from "../media/lootbox_wood_T_fin.webp";
import background_image2 from "../media/lootbox_cyber_T_fin.webp";
import background_image3 from "../media/lootbox_ultra_T_fin.webp";
import LogoImg from "../media/logo1.webp";
import { win_variants1, win_variants2, win_variants3, display_FREE_TWDS_lootbox, win_variantsTest, whitelist_win_variants, OG_win_variants } from "../win_variants";
import React, { useState } from "react";
import Leaves from "./leaves/leaves";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import SnoopDog from "../media/snoopDog.webp";
import menWorking from "../media/menWorking.png";
import OG_lootbox from "../media/OG_lootbox.webp";
import free_lootboxIMG from "../media/free_lootbox.png";
import White_lootboxIMG from "../media/whiteLootbox.png";
import Lumbeer_lootboxIMG from "../media/lumbeerLootBox.png";
import { Link } from "react-router-dom";

import leaves1 from "../media/justsmoke.webp";
import leaves2 from "../media/justSmoke2.webp";
import leaves3 from "../media/justSmoke2.webp";

import gear1 from "../media/gear1.png";
import gear2 from "../media/gear2.png";
import gear3 from "../media/gear3.png";

import solanapng from "../media/solanapng.webp";
import LumbeerEventImage from "../media/lumbeerEventImage.png";

interface Props {
  setColor: (value: string) => void;
}

const Main: React.FC<Props> = ({ setColor }) => {
  const [blockblueLBX, setBlockClueLBX] = useState<Boolean>(true);

  React.useEffect(() => {
    // getCookie("fgiwf333666dksf4") === "true" ? setBlockClueLBX(false) : setBlockClueLBX(true);
    const footer = document.querySelector(".footer");
    // console.log(document.body.clientWidth)
    if (document.body.clientWidth > 1310) {
      (footer as HTMLElement).style.position = "unset";
    } else {
      (footer as HTMLElement).style.position = "unset";
    }
    if (footer !== null) {
      (footer as HTMLElement).style.display = "block";
    }

    const MenuElementFocus = document.getElementById("menu");
    const checkbox = document.getElementById("checkbox");
    const App = document.querySelector(".App");

    // console.log((checkbox as HTMLInputElement).checked)

    if (MenuElementFocus !== null && App !== null && checkbox !== null) {
      App.addEventListener("click", (e) => {
        // console.log((checkbox as HTMLInputElement).checked)
        const withinBoundaries = e.composedPath().includes(MenuElementFocus);
        if (!withinBoundaries) {
          // console.log((checkbox as HTMLInputElement).checked)
          if ((checkbox as HTMLInputElement).checked === true) {
            (checkbox as HTMLInputElement).checked = false;
          }
        }
      });
      checkbox.addEventListener("click", (e) => {
        const withinBoundaries = e.composedPath().includes(MenuElementFocus);
        if (!withinBoundaries) {
          // console.log((checkbox as HTMLInputElement).checked)
        }
      });
    }
  }, []);

  function getCookie(name: String) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  return (
    <div className="App">
      {/* <div className='AppBacdrop_title'>
        <Link to='/' className='Loot_color_darkThemeLink_2'>
          <div className='logo imageLogoAppBacdrop_title'></div>
          <h1>LOOTBEERS</h1>
        </Link>
      </div> */}
      <div className="LogoImg">
        <LazyLoadImage src={LogoImg} alt={""} className="LogoImg_img" effect="blur" />
      </div>
      <div className="TextMain">
        <div className="background_TextMain"></div>
        <div className="TextMain_text">
          <div className="mixblend">
            The first Loot Box Experience on Solana, implementing algorithm based dynamic house edge model, providing averaged 100% RTP.
            <br />
            <br />
            Time to Loot. <span>What's in the box?</span>
          </div>
        </div>
        <div className="Loot_Box_element snoopBlockelement">
          {/* <LazyLoadImage src={SnoopDog} alt={""} className="backeventfreesnoopp SnoopDog" effect="blur" /> */}
          <div className="LootEventBackground LootEventBackgroundCoin">
            <LazyLoadImage src={LumbeerEventImage} alt={""} className="SnoopDog backeventfree" effect="blur" />
          </div>
          <div className="LootEventBackground LootEventBackgroundSolana">
            <LazyLoadImage src={solanapng} alt={""} className="backeventfree" effect="blur" />
          </div>
          <Leaves image1={LumbeerEventImage} image2={solanapng} image3={LumbeerEventImage} />
          <div className="Loot_Box_element_left Loot_Box_element_left50">
            <div className="title title2 title4 title2left">
              {/* Loot Event:
              <br /> */}
              Lumbeer
              <br />
              Loot Box
            </div>
            <div className="lootbox lootbox2left">
              <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={Lumbeer_lootboxIMG} price={0} title="LUMBEER LOOTBOX" colors={["#8f4a3000", "#8f4a30", "#641010"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={whitelist_win_variants} setColor={setColor} />
              {/* <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={Lumbeer_lootboxIMG} price={0} title="OG LOOTBOX" colors={["#8f4a3000", "#8f4a30", "#641010"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={OG_win_variants} setColor={setColor} /> */}
            </div>
          </div>
          {/* <div className="Loot_Box_element_right Loot_Box_element_left50 Loot_Box_element_left">
            <div className="title title2 title2right">
              Loot Event:
              <br />
              OG Edition 2
            </div>
            <div className="lootbox lootbox2right">
              <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={OG_lootbox} price={0} title="OG LOOTBOX" colors={["#05903300", "#059033", "#355A20"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={OG_win_variants2} setColor={setColor} />
            </div>
          </div> */}
          <div className="background_Loot_Box_element_left50"></div>
          <div className="Loot_Box_element_left Loot_Box_element_left50 Loot_Box_element_left" style={blockblueLBX === true ? { pointerEvents: "all" } : { pointerEvents: "all" }}>
            {/* <div className="blockLootbox" style={blockblueLBX === true ? { backdropFilter: "blur(10px)", zIndex: 9999 } : { display: "none" }}>
              <span>
                Open the Lumbeer Loot Box in
                <br />
                order to open the Free Loot Box!
              </span>
            </div> */}
            <div className="title title2 title5 title2right">
              Loot Event:
              <br />
              FREE Edition
            </div>
            <div className="lootbox lootbox2right">
              <Loot_block lootboxAddress={"Gj3vGViYd4o432sCiKscLbHxpAdLj6guxtW3a25Ya1uJ"} picture={free_lootboxIMG} price={0} title="FREE LOOTBOX" colors={["#629bcd00", "#629bcd", "#0c1b2c"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={display_FREE_TWDS_lootbox} setColor={setColor} />
            </div>
          </div>
        </div>
        <div className="Loot_Box_element">
          <div className="LootEventBackground">
            <LazyLoadImage src={menWorking} alt={""} className="SnoopDog backeventfree" effect="blur" />
          </div>
          <Leaves image1={gear1} image2={gear2} image3={gear3} />
          <div className="Loot_Box_element_left">
            <div className="title3">Test Loot Box</div>
            <div className="lootbox">
              <Loot_block lootboxAddress={"8aRvDSPhkwCF3ezi1sbkHmTvePDnXZt77BSRNUpvvC6w"} picture={White_lootboxIMG} price={0.01} title="TEST LOOTBOX" colors={["#a1adbd00", "#a1adbd", "#5e606f"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variantsTest} setColor={setColor} />
            </div>
          </div>
          <div className="Loot_Box_element_right">
            <div className="Loot_Box_element_right_text">
              Test Loot Box is used as another proof of our capabilities. Inside you can find up to 120x on your SOL & Pop Headz NFT.
              <br />
              <br />
              Functions On-Chain with provably fair chances.{" "}
              <Link
                to="/faq"
                style={{
                  textDecoration: "none",
                  color: "rgb(255, 192, 0)",
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="testLootbox">
          <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={background_image1} price={0.05} title="Wooden Loot Box" colors={["#66a5ad00", "#66a5ad", "#121f21"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants1} setColor={setColor} />
        </div> */}
        <div className="AppBacdrop">
          {/* <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={background_image1} price={0.01} title="Wooden Loot Box" colors={["#66a5ad00", "#66a5ad", "#121f21"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants1} setColor={setColor} /> */}
          <Loot_block lootboxAddress={"GMw3iUesR3Eejp36M1EUrcXriTXzRKfe6xmZFUnZ25Yf"} picture={background_image1} price={0.05} title="Wooden Loot Box" colors={["#66a5ad00", "#66a5ad", "#121f21"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants1} setColor={setColor} />
          <Loot_block lootboxAddress={"GNhcPGvBonApZxMtqXQ1y36gzB6Tunm8RcAjbBSTrB7L"} picture={background_image2} price={0.2} title="Carbon Loot Box" colors={["#ebc80800", "#ebc808", "#312a02"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants2} setColor={setColor} />
          <Loot_block lootboxAddress={"EodQ3WqgmGbh8WWZdv8JUW5zbZHD1EzyLsk6YptRYj4c"} picture={background_image3} price={0.5} title="Magnetic Loot Box" colors={["#8e08eb00", "#8e08eb", "#1d0231"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants3} setColor={setColor} />
        </div>
        {/* <div className="testLootbox">
          <Loot_block lootboxAddress={"EodQ3WqgmGbh8WWZdv8JUW5zbZHD1EzyLsk6YptRYj4c"} picture={background_image3} price={0.5} title="Magnetic Loot Box" colors={["#8e08eb00", "#8e08eb", "#1d0231"]} text={["", "", "", "", "", "", "", "", ""]} winVariants={win_variants3} setColor={setColor} />
        </div> */}
      </div>
    </div>
  );
};

export default Main;
