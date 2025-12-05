import React from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from "swiper";

/* team imags */
import team1 from "../../images/slider/client1.png"
import team2 from "../../images/slider/client2.png"
import team3 from "../../images/slider/client3.png"
import team4 from "../../images/slider/client4.png"
import team5 from "../../images/slider/client5.png"


/* HeroSlide Image  */
import HeroSlide1 from "../../images/slider/slide-1.jpg"
import HeroSlide2 from "../../images/slider/slide-2.jpg"
import HeroSlide3 from "../../images/slider/slide-3.jpg"
import HeroSlide4 from "../../images/slider/slide-4.jpg"


const Hero3 = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 1,
    }
    return (
        <section className="static-hero-s3">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div className="slide-title-sub">
                                <h6>Give them a chance.</h6>
                            </div>
                            <div className="slide-title">
                                <h2>Give The Child The Gift
                                    Of Education.</h2>
                            </div>
                            <div className="slide-text">
                                <p>Quisque bestg quisque cursus tellus dui gravida.</p>
                            </div>
                            <div className="hero-btn">
                                <Link onClick={ClickHandler} to="/about" className="theme-btn">Join Our Team</Link>
                                <div className="wpo-supporter-img">
                                    <ul className="wpo-supporter-slide">
                                        <Slider {...settings}>
                                            <li data-bs-toggle="tooltip" data-bs-html="true" title="Aliza Anny">
                                                <img src={team1} alt="" />
                                            </li>
                                            <li data-bs-toggle="tooltip" data-bs-html="true" title="David Miller">
                                                <img src={team2} alt="" />
                                            </li>
                                            <li data-bs-toggle="tooltip" data-bs-html="true" title="Maria Silva">
                                                <img src={team3} alt="" />
                                            </li>
                                            <li data-bs-toggle="tooltip" data-bs-html="true" title="Takila Mas">
                                                <img src={team4} alt="" />
                                            </li>
                                            <li data-bs-toggle="tooltip" data-bs-html="true" title="Jenny Lawba">
                                                <img src={team5} alt="" />
                                            </li>
                                        </Slider>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Swiper
                modules={[Autoplay,Navigation, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={1000}
                parallax={true}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 1800,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                }}
            >
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide1})` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide2})` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide3})` }}></div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide4})` }}></div>
                </SwiperSlide>
                ...
            </Swiper>
        </section>

    )
}

export default Hero3;



