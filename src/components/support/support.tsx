import '../../App.css';
import '../../fonts/fonts.css';
import './support.css';
import { useEffect, useState, FC } from 'react';
import '../../animation.css';
import '../Wallet/mobileNav.css'
import ScrollBar from 'smooth-scrollbar';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './support.scss';

interface Props {
    setActiveMenuElement: (value: Number) => void;
}

const Support: FC<Props> = ({ setActiveMenuElement }) => {

    useEffect(() => {
        setActiveMenuElement(3);
        const footer = document.querySelector('.footer');
        if (footer !== null) { (footer as HTMLElement).style.display = 'block'; (footer as HTMLElement).style.position = 'absolute' }

        gsap.registerPlugin(ScrollTrigger);
        let bodyScrollBar: any;

        const scroller: HTMLElement | null = document.querySelector(".scroller4");

        if (scroller !== null) {
            bodyScrollBar = ScrollBar.init(scroller);
        }

        ScrollTrigger.scrollerProxy(scroller, {
            scrollTop(value) {
                if (arguments.length) {
                    bodyScrollBar.scrollTop = value;
                }
                return bodyScrollBar.scrollTop;
            }
        });
        bodyScrollBar.addListener(ScrollTrigger.update);

        const MenuElementFocus = document.getElementById('menu');
        const checkbox = document.getElementById('checkbox');
        const Support_Component = document.querySelector('.Support_Component');

        if (MenuElementFocus !== null && Support_Component !== null && checkbox !== null) {
            Support_Component.addEventListener('click', (e) => {
                const withinBoundaries = e.composedPath().includes(MenuElementFocus);
                if (!withinBoundaries) {
                    if ((checkbox as HTMLInputElement).checked === true) {
                        (checkbox as HTMLInputElement).checked = false;
                    }
                }
            });
            checkbox.addEventListener('click', (e) => {
                const withinBoundaries = e.composedPath().includes(MenuElementFocus);
                if (!withinBoundaries) {
                }
            })
        }
    }, [])

    const [emailAddress, set_emailAddress] = useState<string>('')
    const [entry_1531447499, set_entry_1531447499] = useState<string>('')
    const [entry_52488517, set_entry_52488517] = useState<string>('')
    const [entry_1796641560, set_entry_1796641560] = useState<string>('')

    return (
        <div className="Support_Component">
            <div className='Support_Component_content'>
                <div className='background_content_component scroller4'>
                    <div className='linebeforeForm'></div>
                    <div className='formLootbeers'>
                        <div className='formLootbeers_title'>Lootbeers Report</div>
                        <div className='formLootbeersLI'>
                            <div>Tell us if you saw something, that isn't working properly and we'll fix it ASAP ⚒️</div>
                            <div>If you had any issues, fill this form correctly, and we will reach out to you ASAP 🧑‍🔧</div>
                        </div>
                        <form action="https://docs.google.com/forms/u/0/d/e/1FAIpQLScp6LJQQ7ZQcOgpAt51sItS8H4jieH0tFfX5d5bt3avmpoviA/formResponse" method="post" className='formActive'>
                            <div className='form-element'>
                                <input type="email" name="emailAddress" placeholder='Email' className="form-element-input" onChange={(e) => set_emailAddress(e.target.value)} />
                            </div>
                            <span className='titleSpan'>Choose the best fitting description of your problem</span>
                            <div className='form-element radio-buttons'>
                                <label htmlFor="Transaction issue">
                                    <input type="radio" name="entry.1418864253" id="Transaction issue" value="Transaction issue" defaultChecked={true} className='radio' />
                                    <span>Transaction issue</span>
                                </label>
                                <label htmlFor="Bug/Visual Glitch">
                                    <input type="radio" name="entry.1418864253" id="Bug/Visual Glitch" value="Bug/Visual Glitch" className='radio' />
                                    <span>Bug/Visual Glitch</span>
                                </label>
                                <label htmlFor="Not received rewards">
                                    <input type="radio" name="entry.1418864253" id="Not received rewards" value="Not received rewards" className='radio' />
                                    <span>Not received rewards</span>
                                </label>
                                <label htmlFor="Revenue share">
                                    <input type="radio" name="entry.1418864253" id="Revenue share" value="Revenue share" className='radio' />
                                    <span>Revenue share</span>
                                </label>
                                <label htmlFor="Other">
                                    <input type="radio" name="entry.1418864253" id="Other" value="Other" className='radio' />
                                    <span>Other</span>
                                </label>
                            </div>
                            <div className='form-element'>
                                <div>Kindly provide your wallet address</div>
                                <input type="text" name="entry.1531447499" placeholder='' className="form-element-input" onChange={(e) => set_entry_1531447499(e.target.value)}/>
                            </div>
                            <div className='form-element'>
                                <div>Please provide as many information as you can</div>
                                <input type="text" name="entry.52488517" placeholder='' className="form-element-input" onChange={(e) => set_entry_52488517(e.target.value)}/>
                            </div>
                            <div className='form-element'>
                                <div>Kindly provide your discord username for further contact (if needed)</div>
                                <input type="text" name="entry.1796641560" placeholder='' className="form-element-input" onChange={(e) => set_entry_1796641560(e.target.value)}/>
                            </div>
                            <button id="submit" type="submit" value="Submit" formTarget='_blank' className='module-border-wrap' disabled={(entry_1531447499 === '' && entry_52488517 === '' && entry_1796641560 === '' && emailAddress === '') ? true : false} style={{backgroundColor: '#FFFFFF00'}}>
                                <div className='module-border-wrap-price'>
                                    <div className='price priceClassic' style={{ display: 'block' }}>send</div>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Support;
