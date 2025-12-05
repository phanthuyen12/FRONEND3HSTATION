import React, { useState } from "react";
import { Link } from "react-router-dom";
import Instagram from "../../api/Instagram";

const GallerySection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    return (
        <section className="wpo-instagram-section s2 section-padding">
            <div className="container">
                <div className="instagram-wrap">
                    <div className="row">
                        {Instagram.map((item) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={item.id}>
                                <div className="instagram-card" >
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
                            </div>
                        ))}
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
    )
}

export default GallerySection;