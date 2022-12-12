import "./loot_block.css";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import useRewardFetcher from "../hooks/useRewardFetcher";
// import { NftReward, NoneReward, Reward, SolReward, TokenReward } from "../../types/app_types";
// import { mapRewards } from "../../util";
// import { useAnchorProvider } from "../../provider/walletProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface Props {
  picture: any;
  price: number;
  title: String;
  colors: Array<string>;
  text: Array<string>;
  winVariants: any;
  lootboxAddress: String;
  setColor: (value: string) => void;
}

const Loot_block: FC<Props> = ({ picture, price, title, colors, text, winVariants, lootboxAddress, setColor }) => {
  const [isActive, setIsActive] = useState(false);
  const [colorInfoItem, setcolorInfoItem] = useState<String>(`#FFFFFF`);

  useEffect(() => {
    const infoItem = document.querySelectorAll(".infoItem");
    const darkThemeHover = document.querySelectorAll(".darkThemeHover");
    const darkThemeHover_text = document.querySelectorAll(".darkThemeHover_text");
    const Loot_color_darkTheme = document.querySelectorAll(".Loot_color_darkTheme");
    const Loot_color_darkTheme_button = document.querySelectorAll(".Loot_color_darkTheme_button");
    const BlockedLootbox = document.querySelectorAll(".BlockedLootbox");
    const BlockedLootbox_color = document.querySelectorAll(".BlockedLootbox_Color");

    (BlockedLootbox[0] as HTMLElement).style.display = "none";
    (BlockedLootbox_color[0] as HTMLElement).style.display = "none";

    (BlockedLootbox[1] as HTMLElement).style.display = "none";
    (BlockedLootbox_color[1] as HTMLElement).style.display = "none";

    (BlockedLootbox[2] as HTMLElement).style.display = "none";
    (BlockedLootbox_color[2] as HTMLElement).style.display = "none";

    if (Loot_color_darkTheme !== null) {
      for (let i = 0; i <= Loot_color_darkTheme.length; i++) {
        if (Loot_color_darkTheme[i]) {
          Loot_color_darkTheme[i].addEventListener("mouseover", function () {
            (darkThemeHover[i] as HTMLElement).style.opacity = "0.9";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.visibility = "visible";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.display = "block";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.opacity = "1";
            setIsActive(true);
          });

          Loot_color_darkTheme[i].addEventListener("click", function () {
            (darkThemeHover[i] as HTMLElement).style.opacity = "0.9";
            if ((Loot_color_darkTheme_button[i] as HTMLElement).style.visibility !== "visible") {
              setIsActive(true);
            }
            (Loot_color_darkTheme_button[i] as HTMLElement).style.visibility = "visible";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.display = "block";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.opacity = "1";
          });

          Loot_color_darkTheme[i].addEventListener("mouseout", function () {
            (darkThemeHover[i] as HTMLElement).style.opacity = "0";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.visibility = "hidden";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.display = "none";
            (Loot_color_darkTheme_button[i] as HTMLElement).style.opacity = "0";
            setIsActive(false);
          });
        }
      }
    }

    if (infoItem !== null && darkThemeHover !== null && darkThemeHover_text !== null) {
      for (let i = 0; i <= infoItem.length; i++) {
        if (infoItem[i]) {
          infoItem[i].addEventListener("mouseover", function () {
            setcolorInfoItem(`${colors[1]}`);
            (infoItem[i] as HTMLElement).style.opacity = "1";
            (darkThemeHover[i] as HTMLElement).style.opacity = "0.9";
            (darkThemeHover_text[i] as HTMLElement).style.opacity = "1";
            infoItem[i].classList.add("activeinfoItem");
          });

          infoItem[i].addEventListener("click", function () {
            setcolorInfoItem(`${colors[1]}`);
            (infoItem[i] as HTMLElement).style.opacity = "1";
            (darkThemeHover[i] as HTMLElement).style.opacity = "0.9";
            (darkThemeHover_text[i] as HTMLElement).style.opacity = "1";
            infoItem[i].classList.add("activeinfoItem");
          });
          infoItem[i].addEventListener("mouseout", function () {
            setcolorInfoItem("#FFFFFF");
            (infoItem[i] as HTMLElement).style.opacity = "0.3";
            (darkThemeHover[i] as HTMLElement).style.opacity = "0";
            (darkThemeHover_text[i] as HTMLElement).style.opacity = "0";
            infoItem[i].classList.remove("activeinfoItem");
          });
        }
      }
    }
  }, []);

  const style1 = {
    background: {
      background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[0]})`,
    },
    backgroundBtn: {
      background: `${colors[1]}`,
    },
    borderOnfoItem: {
      border: `2px solid ${colors[1]}`,
    },
  };

  function getCookie(name: String) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  return (
    <div className="Loot_block_content">
      <div className="Loot_block">
        <div
          className="radialBackground"
          style={{
            background: `center radial-gradient(circle, ${colors[2]} 0%, rgb(0,0,0,0) 60%, rgba(0,0,0,0) 100%)`,
          }}
        ></div>
        <div className="Loot_color" id="Loot_color">
          <div className="BlockedLootbox" style={{ display: "block" }}></div>
          <div className="BlockedLootbox_Color" style={{ display: "block" }}></div>
          <div className="Loot_color_bottom" style={style1.background}></div>
          <div className="content">
            <div className="Loot_color_TextMain"></div>

            <LazyLoadImage alt={""} effect="blur" src={picture} className="background_image" />

            <div className="infoItem" style={{ color: "#FFFFFF", border: `2px solid ${colors[1]}`, opacity: "0.3" }}>
              i
            </div>
            <div className="Loot_color_darkTheme">
              <div className="darkThemeHover" style={{ opacity: "0" }}>
                <div className="darkThemeHover_text" style={{ opacity: "0" }}>
                  {title}
                </div>
              </div>
              <Link
                to={isActive && title === "FREE LOOTBOX" ? "/free_lootbox" : title === "LUMBEER LOOTBOX" ? "/lumbeer_loot_box/" : title === "OG LOOTBOX" ? "/og_lootbox/" : title === "TEST LOOTBOX" ? "/lootbox_00_1/" : "#"}
                state={{
                  price: price,
                  picture: picture,
                  title: title,
                  colors: colors,
                  win_variants: winVariants,
                  lootboxAddress: lootboxAddress,
                }}
                className="Loot_color_darkThemeLink"
                onClick={() => setColor(`${colors[1]}`)}
              >
                <div className="Loot_color_darkTheme_button" style={{ color: `${colors[1]}`, backgroundColor: `${colors[2]}`, visibility: "hidden", display: "none" }}>
                  OPEN
                </div>
              </Link>
            </div>
          </div>
          <div className="module-border-wrap-content">
            {title === "OG LOOTBOX" || title === "FREE LOOTBOX" || title === "LUMBEER LOOTBOX" ? (
              <div className="module-border-wrap" style={style1.backgroundBtn}>
                <Link className="module-border-wrap-price" to={isActive && title === "FREE LOOTBOX" ? "/free_lootbox" : title === "OG LOOTBOX" ? "/og_lootbox/" : title === "LUMBEER LOOTBOX" ? "/lumbeer_loot_box/" : title === "TEST LOOTBOX" ? "/lootbox_00_1/" : "#"} style={{ display: "block" }}>
                  <div className="price" style={{ display: "block" }}>
                    FREE{" "}
                  </div>
                </Link>
              </div>
            ) : (
              <div className="module-border-wrap" style={style1.backgroundBtn}>
                <Link className="module-border-wrap-price" to={isActive && title === "FREE LOOTBOX" ? "/free_lootbox" : title === "OG LOOTBOX" ? "/og_lootbox/" : title === "LUMBEER LOOTBOX" ? "/lumbeer_loot_box/" : title === "TEST LOOTBOX" ? "/lootbox_00_1/" : "#"} style={{ display: "block" }}>
                  <div className="price" style={{ display: "block" }}>
                    {price} SOL
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loot_block;
