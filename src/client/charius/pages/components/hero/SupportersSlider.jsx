import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/* images */
import img1 from '../../images/slider/client1.png'
import img2 from '../../images/slider/client2.png'
import img3 from '../../images/slider/client3.png'
import img4 from '../../images/slider/client4.png'
import img5 from '../../images/slider/client2.png'



const SupportersSlider = () => {

    const settings = {
        dots: false,
        arrows:false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,

    };

    return (
        <div className="wpo-supporter-img">
            <ul className="wpo-supporter-slide">
                <Slider {...settings}>
                    <li>
                        <img src={img1} alt="Aliza Anny" />
                    </li>
                    <li>
                        <img src={img2} alt="David Miller" />
                    </li>
                    <div >
                        <img src={img3} alt="Maria Silva" />
                    </div>
                    <li>
                        <img src={img4} alt="Takila Mas" />
                    </li>
                    <li>
                        <img src={img5} alt="Jenny Lawba" />
                    </li>
                </Slider>
            </ul>
        </div>
    );
};

export default SupportersSlider;
