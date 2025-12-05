
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// imags 

import pImg1 from "../../images/partners/img-1.png"
import pImg2 from "../../images/partners/img-2.png"
import pImg3 from "../../images/partners/img-3.png"
import pImg4 from "../../images/partners/img-4.png"
import pImg5 from "../../images/partners/img-5.png"

const PartnersSection = () => {

    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    return (
        <section className="wpo-partners-section">
            <h2>partners</h2>
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="partner-grids partners-slider ">
                            <Slider {...settings}>
                                <div className="grid">
                                    <img src={pImg1} alt="" />
                                </div>
                                <div className="grid">
                                    <img src={pImg2} alt="" />
                                </div>
                                <div className="grid">
                                    <img src={pImg3} alt="" />
                                </div>
                                <div className="grid">
                                    <img src={pImg4} alt="" />
                                </div>
                                <div className="grid">
                                    <img src={pImg5} alt="" />
                                </div>
                                <div className="grid">
                                    <img src={pImg2} alt="" />
                                </div>
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PartnersSection;