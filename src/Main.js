import './App.css';
import './fonts/fonts.css';
import Loot_block from './components/loot_block/loot_block';
import { Link } from 'react-router-dom';
import background_image1 from './media/plakat-jojo-no-kimyou-na-bouken.jpg';
import background_image2 from './media/jojos-bizarre-adventure-6.jpg';
import background_image3 from './media/maxresdefault.jpg';

const Main = () => {

  return (
    <div className="App">
      <div className='AppBacdrop'>
        <div className='AppBacdrop_title'>
          LOOTBEERS
        </div>
        <Link to='/lootbeers_github_pages/LootboxComponent' state={{
          price: [0.05, 0.2, 1],
          picture: background_image1,
          title: 'Tier1 Lootbox'
        }}><Loot_block picture={background_image1} price='0.05 SOL' /></Link>
        <Link to='/lootbeers_github_pages/LootboxComponent' state={{ 
          price: [0.2, 1, 2], 
          picture: background_image2, 
          title: 'Tier2 Lootbox'
          }}><Loot_block picture={background_image2} price='0.2 SOL' /></Link>
        <Link to='/lootbeers_github_pages/LootboxComponent' state={{ 
          price: [1, 2, 5], 
          picture: background_image3, 
          title: 'Tier3 Lootbox'
          }}><Loot_block picture={background_image3} price='0.5 SOL' /></Link>
      </div>
    </div>
  );
}

export default Main;