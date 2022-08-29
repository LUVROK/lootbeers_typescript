import './App.css';
import './fonts/fonts.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

const LootboxComponent = () => {
    const location = useLocation();
    const [price, setPrice] = useState(location.state.price[0])

    useEffect(() => {


        document.querySelectorAll('.typeLootBox_block')[0].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[0].classList.add('active');
            document.querySelectorAll('.typeLootBox_block')[1].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.remove('active');
        })
        document.querySelectorAll('.typeLootBox_block')[1].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[1].classList.add('active');
            document.querySelectorAll('.typeLootBox_block')[0].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.remove('active');
        })
        document.querySelectorAll('.typeLootBox_block')[2].addEventListener('click', function () {
            document.querySelectorAll('.typeLootBox_block')[0].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[1].classList.remove('active');
            document.querySelectorAll('.typeLootBox_block')[2].classList.add('active');
        })

    }, [])

    const correctPrice = (name) => {
        switch(name) {
            case 'NORMIE': {
                setPrice(location.state.price[0])
                break
            }
            case 'DEGEN': {
                setPrice(location.state.price[1])
                break
            }
            case 'WHALE': {
                setPrice(location.state.price[2])
                break
            }
        }
        console.log(location.state.price)
    }

    return (
        <div className="LootboxComponent">
            <div className="LootboxBacdrop">
                <div className='LootboxComponent_title'>
                    {location.state.title}
                </div>
                <img src={location.state.picture} alt="" className='LootboxComponent_image'></img>
                <div className='typeLootBox'>
                    <div className='NORMIE typeLootBox_block active' onClick={() => correctPrice('NORMIE')}>NORMIE</div>
                    <div className='DEGEN typeLootBox_block' onClick={() => correctPrice('DEGEN')}>DEGEN</div>
                    <div className='WHALE typeLootBox_block' onClick={() => correctPrice('WHALE')}>WHALE</div>
                </div>
                <div className='CasinoLenta'>
                    <div className='element'>20 SOL</div>
                    <div className='element'>NFT</div>
                    <div className='element'>0.1 SOL</div>
                    <div className='element'>100 SOL</div>
                    <div className='element'>FREE LOOT BOX</div>
                    <div className='element'>100 $LUM</div>
                    <div className='element'>10 $LUM</div>
                    <div className='element'>1 $LUM</div>
                    <div className='win'>
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="30.000000pt" height="30.000000pt" viewBox="0 0 30.000000 30.000000"
                            preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
                                fill="#000000" stroke="none">
                                <path d="M90 174 c-30 -26 -56 -55 -58 -65 -5 -27 4 -24 60 21 28 22 55 40 60 40 5 0 31 -18 57 -40 53 -45 61 -48 61 -21 0 14 -107 112 -122 111 -1 0 -28 -21 -58 -46z" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div className='LootboxComponent_price'>
                    buy for {price} SOL
                </div>
            </div>
        </div>
    );
}

export default LootboxComponent;
