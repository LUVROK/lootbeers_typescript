import "../../App.css";
import "../../fonts/fonts.css";
import "./loot_pool_wallets.css";
import { useEffect, FC } from "react";
import "../../animation.css";
import "../Wallet/mobileNav.css";

interface Props {
  setActiveMenuElement: (value: Number) => void;
}

const Loot_pool_wallets: FC<Props> = ({ setActiveMenuElement }) => {
  useEffect(() => {
    setActiveMenuElement(2);
    const footer = document.querySelector(".footer");
    if (footer !== null) {
      (footer as HTMLElement).style.display = "block";
      (footer as HTMLElement).style.position = "absolute";
    }

    const MenuElementFocus = document.getElementById("menu");
    const checkbox = document.getElementById("checkbox");
    const Loot_pool_wallets_Component = document.querySelector(".Loot_pool_wallets_Component");

    if (MenuElementFocus !== null && Loot_pool_wallets_Component !== null && checkbox !== null) {
      Loot_pool_wallets_Component.addEventListener("click", (e) => {
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

  return (
    <div className="Loot_pool_wallets_Component">
      <div className="Loot_pool_wallets_Component_content">
        <div className="background_content_component">
          <div className="PageLogo">Loot pool wallets</div>
          <div className="wallets">
            <div className="walletElement">Revenue Share Wallet - 8DSBVMSpJBBwZFfRyYtzPJW4tWtVYtSHXSYDnjFBYhfF</div>
            <div className="walletElement">Team Revenue Wallet - 8DSBVMSpJBBwZFfRyYtzPJW4tWtVYtSHXSYDnjFBYhfF</div>
            <div className="walletElement">Wooden Loot Box Wallet - 8DSBVMSpJBBwZFfRyYtzPJW4tWtVYtSHXSYDnjFBYhfF</div>
            <div className="walletElement">Carbon Loot Box Wallet - 8DSBVMSpJBBwZFfRyYtzPJW4tWtVYtSHXSYDnjFBYhfF</div>
            <div className="walletElement">Magnetic Loot Box Wallet - 8DSBVMSpJBBwZFfRyYtzPJW4tWtVYtSHXSYDnjFBYhfF</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loot_pool_wallets;
