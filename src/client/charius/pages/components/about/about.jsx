import React from 'react'
import { Link } from 'react-router-dom'
import abImg1 from '../../images/about/img-1.jpg'
import abImg2 from '../../images/about/img-2.jpg'



const About = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <section className="wpo-about-section section-padding">
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <div className="wpo-about-left">
                                    <img src={abImg2} alt="img" />
                                </div>
                                <div className="wpo-about-right">
                                    <img src={abImg1} alt="img" />
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

export default About;

