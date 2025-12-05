import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Instagram from "../../api/Instagram";
import './inasta.css'

const InstagramSection = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    const settings = {
        dots: false,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        responsive: [
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
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
        <section className={props.hclass}>
            <div className="container-fluid">
                <div className="instagram-wrap">
                    <div className="instagram-slider">
                        <Slider {...settings}>
                            {Instagram.map((item) => (
                                <div className="instagram-card" key={item.id}>
                                    <div className="image">
                                        <Link
                                            to={item.imag}
                                            className="fancybox"
                                            data-fancybox-group="gall-1"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                openModal(item.imag);
                                            }}
                                        >
                                            <img
                                                src={item.imag}
                                                alt={`Instagram ${item.id}`}
                                                className="img img-responsive"
                                            />
                                            <div className="popup-icon">
                                                <i className="ti-plus"></i>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="text">
                                        <span>{item.title}</span>
                                        <h2>{item.subtitle}</h2>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-wrap">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={closeModal}>
                                &times;
                            </span>
                            <img src={selectedImage} alt="Modal" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InstagramSection;
