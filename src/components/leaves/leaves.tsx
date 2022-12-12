import "./leaves.css";
import { LeavesInterface } from "../interfaceLootbox/interfaceLootbox";
import { FC, useEffect, useState } from "react";

const Leaves: FC<LeavesInterface> = ({ image1, image2, image3 }) => {

  function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const [massLeaves, setmassLeaves] = useState<Array<Object>>([]);
  const [massLeavesImage, setmassLeavesImage] = useState<Array<number>>([]);

  useEffect(() => {
    for (let i = 0; i <= 15; i++) {
      setmassLeaves((prev: any) => [...prev, { animation: `animeate${getRandomArbitrary(1, 4)} ${getRandomArbitrary(5, 15)}s linear infinite`, animationDelay: `-${getRandomArbitrary(2, 10)}s` }]);
      setmassLeavesImage((prev: any) => [...prev, getRandomArbitrary(1, 3)]);
    }
  }, []);

  useEffect(() => {
    // console.log(massLeaves);
  }, [massLeaves]);

  return (
    <div className="WalletStyle2">
      {massLeaves.map((data, i) => (
        <div className="WalletStyle2_element_leaves" key={i} style={data}>
          {massLeavesImage[i] === 1 ? <img src={image1} alt="" className="WalletStyle2_element_leaves_quackDuck first" /> : massLeavesImage[i] === 2 ? <img src={image2} alt="" className="WalletStyle2_element_leaves_quackDuck first" /> : <img src={image3} alt="" className="WalletStyle2_element_leaves_quackDuck first" />}
        </div>
      ))}
    </div>
  );
};

export default Leaves;