import React, { useState } from "react";
import VideoModal from "../ModalVideo/VideoModal";
import SupportersSlider from "./SupportersSlider";

import Image1 from '../../images/slider/1.jpg';
import Image2 from '../../images/slider/2.jpg';
import Videobg from '../../images/slider/video.png';
import ShapeBg from '../../images/slider/stick-man.svg';


const Hero = () => {

    return (
        <section className="static-hero">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div className="slide-title-sub">
                                <span>Give them a chance.</span>
                            </div>
                            <div className="slide-title">
                                <h2>Believe in The Better Future of Others.</h2>
                            </div>
                            <div className="slide-text">
                                <p>Lorem ipsum dolor sit amet consectetur. Quisque quisque cursus tellus dui gravida.
                                    Sed at a massa nunc at.</p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-video-content">
                                <div className="slide-video-img">
                                    <img src={Videobg} alt="img"  />
                                    <VideoModal />
                                </div>
                                <div className="slide-video-text">
                                    <h4>Join Our Upcoming Campaign</h4>
                                    <p>Make an impact one piece of clothing at a time to need of others.</p>
                                </div>
                            </div>
                            <div className="charius-pic">
                                <div className="charius-pic-main">
                                    <img src={Image1} alt="img" />
                                </div>
                                <div className="charius-inner">
                                    <img src={Image2} alt="img" />
                                </div>

                                <div className="wpo-supporter">
                                    <div className="wpo-supporter-text">
                                        <div className="icon"><i>
                                            <img src={ShapeBg} alt="img" /></i>
                                        </div>
                                        <div className="content">
                                            <h3>120+</h3>
                                            <p>Happy Volunteer</p>
                                        </div>
                                    </div>
                                    <SupportersSlider />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;