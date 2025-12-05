import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import About4 from '../../images/about/img-4.jpg'
import About4s2 from '../..//images/slider/stick-man.svg'
/* team imags */
import team1 from "../../images/slider/client1.png"
import team2 from "../../images/slider/client2.png"
import team3 from "../../images/slider/client3.png"
import team4 from "../../images/slider/client4.png"
import team5 from "../../images/slider/client5.png"

const AboutSection4 = () => {
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
        <section className="wpo-about-section-s4 section-padding">
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12  order-lg-2">
                            <div className="wpo-about-img-s5">
                                <div className="image">
                                    <img src={About4} alt="" />
                                </div>
                                <div className="wpo-supporter">
                                    <div className="wpo-supporter-text">
                                        <div className="icon"><i><img src={About4s2} alt="" /></i>
                                        </div>
                                        <div className="content">
                                            <h3>120+</h3>
                                            <p>Happy Volunteer</p>
                                        </div>
                                    </div>
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
                        <div className="col-lg-6 col-md-12  order-lg-1">
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

                                <div className="about-btn">
                                    <Link to="/about" className="theme-btn">Discover More</Link>
                                    <a  href="tel:+4733378901" className="call-content">
                                        <div className="icon">
                                            <i className="flaticon-phone-call"></i>
                                        </div>
                                        <div className="text">
                                            <h5>Call Us:</h5>
                                            <span>+(684) 555-0102</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection4;