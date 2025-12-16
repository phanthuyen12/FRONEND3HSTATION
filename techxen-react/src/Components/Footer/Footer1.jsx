import { Link } from "react-router-dom";

const Footer1 = () => {
    return (
        <div className="footer1 _relative">
        <div className="container">
             <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                       <div className="single-footer-items footer-logo-area">
                            <div className="footer-logo">
                              <a href="/" className="fw-bold text-uppercase text-white">H3STATION</a>
                            </div>
                            <div className="space20"></div>
                            <div className="heading1">
                              <p>H3Station cung cấp VPS hiệu năng cao, triển khai n8n và giải pháp server tối ưu để doanh nghiệp vận hành nhanh, ổn định, bảo mật.</p>
                            </div>
                            <ul className="social-icon">
                                 <li><a href="#"><i className="bi bi-linkedin"></i></a></li>
                                 <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                                 <li><a href="#"><i className="bi bi-youtube"></i></a></li>
                                 <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                            </ul>
                       </div>
                  </div>

                  <div className="col-lg col-md-6 col-12">
                       <div className="single-footer-items">
                            <h3>Service We Offer</h3>

                            <ul className="menu-list">
                                 <li><Link to="/service/service-details">Cloud Computing Solution</Link></li>
                                 <li><Link to="/service/service-details">Cybersecurity & Compliance</Link></li>
                                 <li><Link to="/service/service-details">Software Development</Link></li>
                                 <li><Link to="/service/service-details">It Consulting & Support</Link></li>
                            </ul>
                       </div>
                  </div>

                  <div className="col-lg col-md-6 col-12">
                       <div className="single-footer-items">
                            <h3>Useful Links</h3>

                            <ul className="menu-list">
                                 <li><Link to="/about">About Us </Link></li>
                                 <li><Link to="/service">Our Services</Link></li>
                                 <li><Link to="/blog">Blog & News</Link></li>
                                 <li><Link to="/project">Project</Link></li>
                                 <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                       </div>
                  </div>


                  <div className="col-lg-3 col-md-6 col-12">
                       <div className="single-footer-items">
                            <h3>Contact Us</h3>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon1.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="tel:+842471008868">(+84) 24 7100 8868</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon2.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="tel:+84967800128">(+84) 967 800 128</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon3.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="mailto:support@h3station.com">support@h3station.com</a>
                              </div>
                            </div>

                            <div className="contact-box">
                              <div className="icon">
                                <img src="/assets/img/icons/footer1-icon4.png" alt="" />
                              </div>
                              <div className="pera">
                                <a href="https://h3station.com">www.h3station.com</a>
                              </div>
                            </div>

                       </div>
                  </div>

             </div>

             <div className="space40"></div>
        </div>

        <div className="copyright-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-5">
                   <div className="coppyright">
                     <p>© 2024 H3Station. All rights reserved.</p>
                   </div>
              </div>
              <div className="col-md-7">
                   <div className="coppyright right-area">
                        <a href="#">Terms & Conditions</a>
                        <a href="#">Privacy Policy</a>
                   </div>
              </div>
         </div>
          </div>
     </div>

      </div>
    );
};

export default Footer1;