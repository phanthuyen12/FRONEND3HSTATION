import { Link } from 'react-router-dom'
import Logo from "../../images/logo2.png"
import Services from '../../api/Services';



const ClickHandler = () => {
    window.scrollTo(10, 0);
}


const Footer = (props) => {


    return (
        <footer className="wpo-site-footer">
            <div className="wpo-top-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="widget">
                                <div className="logo">
                                    <Link className="navbar-brand" to="/home">
                                        <img src={Logo} alt="" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="widget">
                                <div className="social">
                                    <ul>
                                        <li>
                                            <Link to="/">
                                                <i className="fi flaticon-facebook-app-symbol"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/">
                                                <i className="fi flaticon-twitter"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/">
                                                <i className="fi flaticon-linkedin"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/">
                                                <i className="fi flaticon-instagram"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="widget-title">
                                    <h3>About Charius</h3>
                                </div>
                                <p>Purus tellus arcu consequat neque nisl integer fames ac venenatis.
                                    Neque ornare ut viverra purus suscipit morbi.
                                    Lorem pretium purus sagittis congue rhoncus et mi lacus duis ut.</p>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Quick Links</h3>
                                </div>
                                <ul>
                                    <li><Link to="/home">Home</Link></li>
                                    <li><Link to="about">About Us</Link></li>
                                    <li><Link to="service">Mission & Vision</Link></li>
                                    <li><Link to="volunteer">Volunteer</Link></li>
                                    <li><Link to="faq">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget s2">
                                <div className="widget-title">
                                    <h3>Mission & Vision</h3>
                                </div>
                                <ul>
                                    {Services.map((service, sky) => (
                                        <li key={sky}><Link onClick={ClickHandler} to={`/service-single/${service.slug}`}>{service.title}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget newsletter-widget">
                                <div className="widget-title">
                                    <h3>Contact Us</h3>
                                </div>
                                <p>Nulla nequeut molestie interdum nisl ut consequat. </p>
                                <ul className="info">
                                    <li><i className="flaticon-email"></i> charius@gmail.com</li>
                                    <li><i className="flaticon-telephone"></i> + 8 (123) 123 - 456 - 789</li>
                                    <li><i className="flaticon-location"></i> 19 Thordge Shiloh,Hawai 863</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col col-lg-6 col-md-12 col-12">
                            <ul>
                                <li>&copy; 2024 <Link to="/">charius</Link>. All rights reserved.</li>
                            </ul>
                        </div>
                        <div className="col col-lg-6 col-md-12 col-12">
                            <div className="link">
                                <ul>
                                    <li><Link to="/">Privace & Policy</Link></li>
                                    <li><Link to="/">Terms</Link></li>
                                    <li><Link to="about">About us</Link></li>
                                    <li><Link to="faq">FAQ</Link></li>
                                    <li><Link to="volunteer">Volunteer</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;




