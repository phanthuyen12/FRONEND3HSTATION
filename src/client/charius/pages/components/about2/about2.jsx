import React from 'react'
import { Link } from 'react-router-dom'

import About1 from "../../images/about/1.png"
import About2 from "../../images/about/2.png"
import About3 from "../../images/about/3.png"
import About4 from "../../images/about/4.png"
import About5 from "../../images/about/5.png"
import About6 from "../../images/about/6.png"


const AboutSection2 = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <section className="wpo-about-section-s2 section-padding">
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <div className="bg-image">
                                    <img src={About1} alt="" />
                                </div>
                                <div className="img-1">
                                    <img src={About2} alt="" />
                                </div>
                                <div className="img-2">
                                    <img src={About3} alt="" />
                                </div>
                                <div className="img-3">
                                    <img src={About4} alt="" />
                                </div>
                                <div className="img-4">
                                    <img src={About5} alt="" />
                                </div>
                                <div className="img-5">
                                    <img src={About6} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-text">
                                <div className="wpo-section-title">
                                    <span>Welcome to Charius</span>
                                    <h2>You’re the Hope of Others.</h2>
                                </div>
                                <p>Lorem ipsum dolor sit amet consectetur. Volutpat proin id turpis eu neque sit etiam
                                    nec quisque. Cras quam dignissim blandit metus laoreet mi ut. Eget diam volutpat
                                    ultrices massa morbi sed nibh. Sodales diam eu etiam eu quam nisl viverra. Eget
                                    egestas orci felis nisl. Sit diam morbi amet viverra auctor nunc. Feugiat ac amet
                                    aliquet euismod ut vel. Mi lectus nisl augue commodo vitae nisi blandit. Venenatis
                                    netus suscipit tempus fringilla varius feugiat nulla proin.</p>

                                <div className="about-info-wrap">
                                    <div className="about-info-item">
                                        <div className="about-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-target"></i>
                                            </div>
                                        </div>
                                        <div className="about-info-text">
                                            <h4>Our Mission</h4>
                                            <p>We believe charity is a lifetime investment.</p>
                                        </div>
                                    </div>
                                    <div className="about-info-item">
                                        <div className="about-info-icon">
                                            <div className="icon">
                                                <i className="fi flaticon-mountain"></i>
                                            </div>
                                        </div>
                                        <div className="about-info-text">
                                            <h4>Our Vision</h4>
                                            <p>We believe charity is a lifetime investment.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link onClick={ClickHandler} to="/about" className="theme-btn">Discover More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection2;


