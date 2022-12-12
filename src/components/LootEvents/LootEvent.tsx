import '../App.css';
import '../fonts/fonts.css';
import './LootEvents.css'

const LootEvents = () => {
    return (
        <div className='LootEvent'>
            <h2 className='LootEvent_title'>
                Loot Events
            </h2>
            <div className='LootEvent_block'>
                <div className='background_TextMain LootEvent_blockFilter'></div>
                <div className='LootEvent_soon'>
                    Soon...
                </div>
            </div>
        </div>
    );
}

export default LootEvents;