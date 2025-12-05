import React, { useEffect } from "react";
import { Link } from 'react-router-dom'

import hero1 from '../../images/slider/slide-5.png'
import hero2 from '../../images/slider/slide-6.png'
import hero3 from '../../images/slider/slide-7.png'
import HeroShape1 from '../../images/slider/shape/1.png'
import HeroShape2 from '../../images/slider/shape/2.png'
import HeroShape3 from '../../images/slider/shape/3.png'
import HeroShape4 from '../../images/slider/shape/4.png'
import HeroShape5 from '../../images/slider/shape/5.png'
import HeroShape6 from '../../images/slider/shape/6.png'
import VideoModal from "../ModalVideo/VideoModal";

const Hero4 = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    
    useEffect(() => {
        const rotate = () => {
            const lastChild = document.querySelector('.manroted div:last-child').cloneNode(true);
            document.querySelectorAll('.manroted div').forEach((div) => div.classList.remove('firstSlide'));
            document.querySelector('.manroted div:last-child').remove();
            document.querySelector('.manroted').prepend(lastChild);
        };

        const intervalId = setInterval(rotate, 4000);

        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <section className="static-hero-s4">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div  className="slide-title">
                                <h2>Give them a fresh Outlook on life.</h2>
                            </div>
                            <div className="slide-text">
                                <p>Lorem ipsum dolor sit amet consectetur. Quisque quisque cursus tellus dui gravida.
                                    Sed at a massa nunc at.</p>
                            </div>
                            <div className="hero-btn">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn">Discover More</Link>
                                <div className="slide-video-btn">
                                    <VideoModal />
                                    <p>Watch Videos</p>
                                </div>
                            </div>
                            <div className="hero-slider-img">
                                <div className="hero-slider-wrap">
                                    <div className="manroted">
                                        <div className="box1">
                                            <img src={hero1} alt="" />
                                        </div>
                                        <div className="box2">
                                            <img src={hero2} alt="" />
                                        </div>
                                        <div className="box3 ">
                                            <img src={hero3} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shape-icon-1"><img src={HeroShape1} alt="" /></div>
            <div className="shape-icon-2"><img src={HeroShape2} alt="" /></div>
            <div className="shape-icon-3"><img src={HeroShape3} alt="" /></div>
            <div className="shape-icon-4"><img src={HeroShape3} alt="" /></div>
            <div className="shape-icon-5"><img src={HeroShape4} alt="" /></div>
            <div className="shape-icon-6"><img src={HeroShape1} alt="" /></div>
            <div className="shape-icon-7"><img src={HeroShape4} alt="" /></div>
            <div className="shape-icon-8"><img src={HeroShape3} alt="" /></div>
            <div className="shape-icon-9"><img src={HeroShape5} alt="" /></div>
            <div className="shape-icon-10"><img src={HeroShape6} alt="" /></div>
            <div className="shape-icon-11"><img src={HeroShape4} alt="" /></div>
        </section>
    )
}

export default Hero4;


