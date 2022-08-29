import './loot_block.css';
import React, {useEffect, useState} from 'react';
// import background_image1 from '../../media/plakat-jojo-no-kimyou-na-bouken.jpg';
// import background_image2 from '../../media/jojos-bizarre-adventure-6.jpg';
// import background_image3 from '../../media/maxresdefault.jpg';

const Loot_block = ({picture, price, title}) => {
    return (
        <div className="Loot_block">
            <div className='Loot_color'>
                <img src={picture} alt="" className='background_image' />
                {/* <div className='title_image'>Loot_block</div> */}
            </div>
            <div className='price'>{price}</div>
        </div>
    );
}

export default Loot_block;
