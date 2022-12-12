import "../../App.css";
import "../../fonts/fonts.css";
import "./faq.css";
import "./faq.scss";
import { useEffect, FC } from "react";
import "../../animation.css";
import "../Wallet/mobileNav.css";
import ScrollBar from "smooth-scrollbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Props {
  setActiveMenuElement: (value: Number) => void;
}

const Faq: FC<Props> = ({ setActiveMenuElement }) => {

  useEffect(() => {
    setActiveMenuElement(1);
    const footer = document.querySelector(".footer");
    if (footer !== null) {
      (footer as HTMLElement).style.display = "block";
      (footer as HTMLElement).style.position = "absolute";
    }

    gsap.registerPlugin(ScrollTrigger);
    let bodyScrollBar: any;

    const scroller: HTMLElement | null = document.querySelector(".scroller");

    if (scroller !== null) {
      bodyScrollBar = ScrollBar.init(scroller);
    }

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          bodyScrollBar.scrollTop = value;
        }
        return bodyScrollBar.scrollTop;
      },
    });
    bodyScrollBar.addListener(ScrollTrigger.update);

    const el = document.querySelectorAll(".faq-full details summary");
    const el_details = document.querySelectorAll(".faq-full details .faq-details-bottom");
    if (el !== null && el_details !== null) {
      el.forEach(function (item, i, arr) {
        item.addEventListener("click", function () {
          if ((el_details[i] as HTMLElement).style.opacity === "0") {
            (el_details[i] as HTMLElement).style.opacity = "1";
          } else {
            (el_details[i] as HTMLElement).style.opacity = "0";
          }
        });

        item.addEventListener("click", () => {
          if ((el_details[i] as HTMLElement).style.height === "0px") {
            (el_details[i] as HTMLElement).style.height = `${(el_details[i] as HTMLElement).scrollHeight}px`;
          } else {
            (el_details[i] as HTMLElement).style.height = `${(el_details[i] as HTMLElement).scrollHeight}px`;
            window.getComputedStyle(el_details[i] as HTMLElement, null).getPropertyValue("height");
            (el_details[i] as HTMLElement).style.height = "0";
          }
        });

        (el_details[i] as HTMLElement).addEventListener("transitionend", () => {
          if ((el_details[i] as HTMLElement).style.height !== "0px") {
            (el_details[i] as HTMLElement).style.height = "auto";
          }
        });
      });
    }

    const MenuElementFocus = document.getElementById("menu");
    const checkbox = document.getElementById("checkbox");
    const Faq_Component = document.querySelector(".Faq_Component");

    if (MenuElementFocus !== null && Faq_Component !== null && checkbox !== null) {
      Faq_Component.addEventListener("click", (e) => {
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

  const massWooden = [
    { prize: "0x / 2 LUM", chance: "35.000 %" },
    { prize: "0.5x", chance: "23.300%" },
    { prize: "1x", chance: "22.000%" },
    { prize: "2x", chance: "14.600%" },
    { prize: "5x", chance: "3.800%" },
    { prize: "15x / Lumbeer NFT", chance: "1.165%" },
    { prize: "30x", chance: "0.070%" },
    { prize: "60x", chance: "0.035%" },
    { prize: "120x / Cheap NFT", chance: "0.030%" },
  ];

  const massCarbon = [
    { prize: "0x / 5 LUM", chance: "34.500%" },
    { prize: "0.5x / Free Wooden Loot Box", chance: "24.800%" },
    { prize: "1x", chance: "19.000%" },
    { prize: "2x", chance: "14.650%" },
    { prize: "5x / Lumbeer NFT", chance: "6.000%" },
    { prize: "15x", chance: "0.670%" },
    { prize: "30x / Cheap NFT", chance: "0.150%" },
    { prize: "60x", chance: "0.150%" },
    { prize: "120x / Mid NFT", chance: "0.080%" },
  ];

  const massMagnetic = [
    { prize: "0x / 10 LUM", chance: "34.700%" },
    { prize: "0.5x / Free Carbon Loot Box", chance: "27.600%" },
    { prize: "1x", chance: "19.100%" },
    { prize: "2x", chance: "14.750%" },
    { prize: "5x", chance: "2.000%" },
    { prize: "15x / Cheap NFT", chance: "1.230%" },
    { prize: "30x / Mid NFT", chance: "0.500%" },
    { prize: "60x", chance: "0.070%" },
    { prize: "120x / Expensive NFT", chance: "0.050%" },
  ];

  const massWhiteLTBX = [
    { prize: "0x", chance: "34.09%" },
    { prize: "0.5x", chance: "25.00%" },
    { prize: "1x", chance: "22.00%" },
    { prize: "2x", chance: "15.00%" },
    { prize: "5x", chance: "3.00%" },
    { prize: "15x", chance: "0.75%" },
    { prize: "30x", chance: "0.10%" },
    { prize: "60x", chance: "0.03%" },
    { prize: "120x", chance: "0.02%" },
    { prize: "NFT", chance: "0.01%" },
  ];

  return (
    <div className="Faq_Component">
      <div className="Faq_Component_content">
        <div className="background_content_component">
          <div className="Faq_Component_content_text">FAQ</div>
          <div className="faq scroller" id="faq">
            <div className="faq-block">
              <div className="faq-full">
                <details>
                  <summary>WHAT ARE LOOT BOXES?</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    Loot Boxes are available on our platform in exchange for Solana and are operating on-chain. We are providing close to 100% RTP.
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>LOOT POOL</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    Loot Pool (house wallet) contains different NFTs and SOL. From Loot Boxes you can get up to 120x SOL. <a>Learn More</a>
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>CHANCES</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    <div className="table-wrapper">
                      <table className="fl-table">
                        <caption>Test Loot Box - 0.01 SOL</caption>
                        <thead>
                          <tr>
                            <th>Prize</th>
                            <th>Chance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {massWhiteLTBX.map((anObjectMapped, index) => {
                            return (
                              <tr key={index} className="table_component">
                                <td className="massWoodenElementtitle">{anObjectMapped.prize}</td>
                                <td className="massWoodenElementChance">{anObjectMapped.chance}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <table className="fl-table">
                        <caption>Wooden Loot Box - 0.05 SOL</caption>
                        <thead>
                          <tr>
                            <th>Prize</th>
                            <th>Chance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {massWooden.map((anObjectMapped, index) => {
                            return (
                              <tr key={index} className="table_component">
                                <td className="massWoodenElementtitle">TBA</td>
                                <td className="massWoodenElementChance">TBA</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <table className="fl-table">
                        <caption>Carbon Loot Box - 0.2 SOL</caption>
                        <thead>
                          <tr>
                            <th>Prize</th>
                            <th>Chance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {massCarbon.map((anObjectMapped, index) => {
                            return (
                              <tr key={index} className="table_component">
                                <td className="massWoodenElementtitle">TBA</td>
                                <td className="massWoodenElementChance">TBA</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <table className="fl-table">
                        <caption>Magnetic Loot Box - 0.5 SOL</caption>
                        <thead>
                          <tr>
                            <th>Prize</th>
                            <th>Chance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {massMagnetic.map((anObjectMapped, index) => {
                            return (
                              <tr key={index} className="table_component">
                                <td className="massWoodenElementtitle">TBA</td>
                                <td className="massWoodenElementChance">TBA</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>REVENUE SHARE</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    For every Loot Box there is 5% commission, which is split accordingly: 4% goes to Revenue Share Wallet and 1% goes to Loot Pool Wallets and to the Team Revenue Wallet. Payouts are distributed on a weekly basis to all delisted holders.
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>PROOF OF FAIRNESS</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    Lootbeers platform is using{" "}
                    <a target={"_blank"} style={{ color: "rgba(255,192,0)" }} href="https://random.org/">
                      random.org
                    </a>{" "}
                    to generate truly random numbers for each opening.
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>LOOT EVENTS</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    Loot Events are an exclusive offer and are used usually as a collaboration tool with other communities.
                  </div>
                </details>
              </div>
              <div className="faq-full">
                <details>
                  <summary>AFFILIATE PROGRAM</summary>
                  <div className="faq-details-bottom" style={{ opacity: "0", transform: "translateX(0px)", height: 0 }}>
                    Affiliate Program by Lootbeers is rewarding people, who onboard new users to our platform. Partners are getting 5% of house profits generated by onboarded users. Learn More{" "}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
