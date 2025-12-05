import React, { Fragment, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { Link, useParams } from 'react-router-dom'
import Services from '../../api/Services';
import Footer from '../../components/footer/Footer';
import ServiceSidebar from './sidebar';

import simg1 from '../../images/service-single/2.jpg'
import simg2 from '../../images/service-single/3.jpg'
import Logo from '../../images/logo.svg'




const accordionData = [
    {
        title: "We Can Save More Lives With Your Helping Hand.",
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime."
    },
    {
        title: "Planning can help alleviate workplace stress and increase productivity.",
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime."
    },
    {
        title: "Those who experiment the most are able to innovate the best.",
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime."
    },
    {
        title: "Understand Your Problem, You must understand the issue.",
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum exercitationem pariatur iure nemo esse repellendus est quo recusandae. Delectus, maxime."
    }
];








const ServiceSinglePage = (props) => {
    const { slug } = useParams()

    const serviceDetails = Services.find(item => item.slug === slug)

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'} />
            <PageTitle pageTitle={serviceDetails.title} pagesub={'Service'} />
            <section className="wpo-service-single-section section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="wpo-service-single-wrap">
                                <div className="wpo-service-single-content">
                                    <img src={serviceDetails.sSImg} alt="img" />
                                    <div className="wpo-service-single-content-des">
                                        <h2>{serviceDetails.title}</h2>
                                        <p>I must explain to you how all this mistaken idea of denouncing pleasure and
                                            praising pain was born and I will give you a complete account of the system, and
                                            expound the actual teachings of the great explorer of the truth, the
                                            master-builder of human happiness. No one rejects, dislikes, or avoids pleasure
                                            itself, because it is pleasure, but because those who do not know how to pursue
                                            pleasure rationally encounter consequences that are extremely painful. </p>
                                        <p>Nor again is there anyone who loves or pursues or desires to obtain pain of
                                            itself, because it is pain, but because occasionally circumstances occur in
                                            which toil and pain can procure him some great pleasure. To take a trivial
                                            example, which of us ever undertakes laborious physical exercise.</p>
                                        <div className="wpo-service-single-sub-img">
                                            <ul>
                                                <li><img src={simg1} alt="img" /></li>
                                                <li><img src={simg2} alt="img" /></li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                                <div className="wpo-solutions-section">
                                    <h2>Our Solutions</h2>
                                    <div className="row">
                                        {Services.slice(0, 3).map((serves, sitem) => (
                                            <div className="col-lg-4 col-md-6 col-12" key={sitem}>
                                                <div className="wpo-solutions-item">
                                                    <div className="wpo-solutions-icon">
                                                        <div className="icon">
                                                            <img src={serves.sImg} alt="img" />
                                                        </div>
                                                    </div>
                                                    <div className="wpo-solutions-text">
                                                        <h2><Link onClick={ClickHandler} to={`/service-single/${serves.slug}`}>{serves.title}</Link></h2>
                                                        <p>{serves.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="wpo-benefits-section">
                                    <h2>Benefits</h2>
                                    <div className="row">
                                        <div className="col-lg-12 col-12">
                                            <div className="wpo-benefits-item">
                                                <div className="accordion" id="accordionExample">
                                                    {accordionData.map((item, index) => (
                                                        <div className="accordion-item" key={index}>
                                                            <h3 className="accordion-header" id={`heading${index}`}>
                                                                <button
                                                                    className={`accordion-button ${activeAccordion === index ? '' : 'collapsed'}`}
                                                                    type="button"
                                                                    onClick={() => toggleAccordion(index)}
                                                                    aria-expanded={activeAccordion === index ? 'true' : 'false'}
                                                                    aria-controls={`collapse${index}`}
                                                                >
                                                                    {item.title}
                                                                </button>
                                                            </h3>
                                                            <div
                                                                id={`collapse${index}`}
                                                                className={`accordion-collapse collapse ${activeAccordion === index ? 'show' : ''}`}
                                                                aria-labelledby={`heading${index}`}
                                                                data-bs-parent="#accordionExample"
                                                            >
                                                                <div className="accordion-body">
                                                                    <p>{item.content}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-8">
                            <ServiceSidebar />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default ServiceSinglePage;


