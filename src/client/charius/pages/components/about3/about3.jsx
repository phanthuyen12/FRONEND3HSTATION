import { Link } from "react-router-dom";
import abut3 from "../../images/about/img-3.jpg"
import abutShape3 from "../../images/about/shape-2.png"

const ClickHandler = () => {
    window.scrollTo(10, 0)
}

const AboutSection3 = () => {
    return (
        <section className="wpo-about-section-s3 section-padding">
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-img-s3">
                                <div className="image">
                                    <img src={abut3} alt="" />
                                    <div className="shape">
                                        <img src={abutShape3} alt="" />
                                    </div>
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

                                <div className="about-btn">
                                    <Link to="/about" className="theme-btn" onClick={ClickHandler}>Discover More</Link>
                                    <a href="tel:+4733378901" className="call-content">
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

export default AboutSection3;