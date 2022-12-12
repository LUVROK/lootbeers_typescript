import { useEffect, useState, FC } from "react";

import LUM1 from "../../../media/1LUMB.jpg";
import LUM2 from "../../../media/2LUMB.jpg";
import LUM3 from "../../../media/3LUMB.jpg";
import LUM4 from "../../../media/4LUMB.jpg";
import LUM5 from "../../../media/5LUMB.jpg";
import LUM6 from "../../../media/6LUMB.jpg";
import LUM7 from "../../../media/7LUMB.jpg";
import LUM8 from "../../../media/8LUMB.jpg";
import LUM9 from "../../../media/9LUMB.jpg";
import LUM10 from "../../../media/10LUMB.png";
import LUM11 from "../../../media/11LUMB.png";
import LUM12 from "../../../media/12LUMB.png";

interface Props {
  title: String;
}

const VoteLumbeer: FC<Props> = ({ title }) => {
  let massImages = [LUM1, LUM2, LUM3, LUM4, LUM5, LUM6, LUM7, LUM8, LUM9, LUM10, LUM11, LUM12];
  const [activeImageLUMB, setActiveImageLUMB] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(LUM1);

  useEffect(() => {
    const filterTextMain = document.querySelector(".LootboxBacdrop");
    const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
    const LumbeerLbx = document.querySelector(".LumbeerLbx");

    // if (activeImageLUMB === 11) {
    //   (filterTextMain as HTMLElement).style.filter = "blur(0px)";
    //   (filterTextMain as HTMLElement).style.pointerEvents = "all";
    //   (LumbeerLbx as any).style.backdropFilter = "blur(0px)";
    //   (LootEventBlurElement as HTMLElement).style.display = "none";
    //   const el5 = document.getElementById("buttonSpin2");
    //   if (el5 !== null) {
    //     el5.style.pointerEvents = "all";
    //   }
    // } else {
    setActiveImage(massImages[activeImageLUMB]);
    // }
  }, [activeImageLUMB]);

  const closeBlurLumbeer = () => {
    const filterTextMain = document.querySelector(".LootboxBacdrop");
    const LootEventBlurElement = document.querySelector(".LootEventBlurElement");
    const LumbeerLbx = document.querySelector(".LumbeerLbx");
    (filterTextMain as HTMLElement).style.filter = "blur(0px)";
    (filterTextMain as HTMLElement).style.pointerEvents = "all";
    (LumbeerLbx as any).style.backdropFilter = "blur(0px)";
    (LootEventBlurElement as HTMLElement).style.display = "none";
    const el5 = document.getElementById("buttonSpin2");
    if (el5 !== null) {
      el5.style.pointerEvents = "all";
    }
  };

  return (
    <div className="LootEventBlurElement" style={{ display: "block" }}>
      <div className="LumbeerLbx" style={title === "LUMBEER LOOTBOX" || title === "FREE LOOTBOX" ? { display: "flex", backdropFilter: "blur(10px)" } : { display: "none" }}>
        <span>
          LOOT BOX IS SOLD OUT!
          <br />
          <br />
          LUMBEERS COLLECTION MINTING 11/29/2022
        </span>
        {/* <div className="VOTE">
          <span>Do you like this lumbeer?</span>
          <span style={{ display: "none" }}>ordinary elections in any country will be similar</span>
          <div className="blockYesOrNo">
            <div onClick={() => setActiveImageLUMB((prev) => (prev === 11 ? 0 : prev + 1))} style={{ cursor: "pointer" }}>
              NO
            </div>
            <div onClick={() => closeBlurLumbeer()} style={{ cursor: "pointer" }}>
              YES
            </div>
          </div>
        </div>
        <div className="VOTE VOTEImageBlock">
          <div style={{ background: `url(${activeImage})` }} className="imageActive"></div>
        </div> */}
      </div>
    </div>
  );
};

export default VoteLumbeer;
