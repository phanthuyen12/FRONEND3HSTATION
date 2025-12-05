import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Shape from '../../images/testimonial/bg.png';

import Testimonial from "../../api/testimonial"



const TestimonialSection = (props) => {
    const CustomPrevArrow = (props) => {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <i className="flaticon-right-arrow-1"></i>
            </div>
        );
    };

    const CustomNextArrow = (props) => {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <i className="flaticon-left-arrow"></i>
            </div>
        );
    };
    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: true,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                }
            }
        ]
    };
    return (
        <section className={"section-padding " + props.hclass}>
            <div className="container">
                <div className="wpo-testimonial-slider">
                    <Slider {...settings}>
                        {
                            Testimonial.map((Testimonial, item) => (
                                <div className="testimonial-item" key={item}>
                                    <div className="content">
                                        <div className="icon">
                                            <i className="flaticon-quote"></i>
                                        </div>
                                        <p>
                                            {Testimonial.text}
                                        </p>
                                        <div className="shape">
                                            <img src={Shape} alt="" />
                                        </div>
                                    </div>
                                    <div className="bottom-content">
                                        <div className="image">
                                            <img src={Testimonial.image} alt="" />
                                        </div>
                                        <div className="text">
                                            <h3>{Testimonial.title}</h3>
                                            <span>{Testimonial.subtitle}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default TestimonialSection







