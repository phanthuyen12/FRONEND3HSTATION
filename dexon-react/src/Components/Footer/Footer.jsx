import { useEffect } from "react";
import { Link } from "react-router-dom";
import loadBackgroudImages from "../Common/loadBackgroudImages";

const Footer = () => {

      const UsefulLinks = [
        {title:'About Company', link:'/about'},
        {title:'Services', link:'/service'},
        {title:'Team Member', link:'/team'},
        {title:'Latest Blog', link:'/blog'},
        {title:'Contact Us', link:'/contact'}
      ];  

      const AdressContent = {
        address:'Royels, Street Road 27, New York, <br/> USA - 87453',
        email:'example@gmail.com',
        Number:'+98 069 (2350) 020'
      }

      const LogoContent = {
        img1:'/assets/images/logo.png',
        Content:'Ullamcorper risus ultrices in lorem. Vulputate aliquam, consecte error free scenarios done.'
      }

      useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="footer-section" data-background="/assets/images/resource/footer-bg.jpg"> 
		<div className="container">
			<div className="row">
				<div className="col-lg-3 col-md-6">
					<div className="widget widgets-company-info">
						<div className="dreamhub-logo">
						<a className="logo_thumb" href="index.html" title="dreamhub">
							<img src={LogoContent.img1}  alt="" />
						</a>
					</div>
						<div className="company-info-desc">
							<p> {LogoContent.Content}  </p>
						</div>
						<div className="follow-company-icon">
							<a href="#"><i className="bi bi-facebook"></i> </a>
							<a href="#"> <i className="bi bi-twitter"></i></a>
							<a href="#"> <i className="bi bi-linkedin"></i> </a>
							<a href="#"> <i className="bi bi-pinterest"></i> </a>
						</div>
					</div>					
				</div>
				<div className="col-lg-3 col-md-6 pl-40">
					<div className="widget widget-nav-menu">
						<h4 className="widget-title">Informations</h4>
						<div className="menu-quick-link-content">
							<ul className="footer-menu">
                            {UsefulLinks.map((item, i) => (
								<li key={i}><Link to={item.link}> {item.title} </Link></li>
                            ))}
							</ul>
						</div>
					</div>
				</div>	
				<div className="col-lg-3 col-md-6">
					<div className="widget widget-nav-menu">
						<h4 className="widget-title"> Contact Us </h4>
						<div className="menu-quick-info-content">
							<ul className="footer-info">
								<li> {AdressContent.address} </li>
								<li><span className="border-undr"> {AdressContent.email} </span></li>
								<li> {AdressContent.Number}</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-lg-3 col-md-6 pr-0">
					<div className="menu-quick-link-contact">
						
						<h4 className="widget-title"> Newsletter </h4>
						<div className="subscribe-widget">
							<form action="#" method="get">
								<input type="text" className="src-input-box" placeholder="Search Here" name="s" value=""
									title="src-input-box" />
									<span className="input-icn"><i className="bi bi-send-fill"></i></span>
							</form>
						</div>
						<div className="widget-desc">
							<p>When do they work well, and when do they on us and finally,</p>
						</div>
					</div>
				</div>
			</div>
			<div className="row footer-bg">
				<div className="col-lg-6 col-md-6">
					<div className="footer-bottom-content">
						<div className="footer-bottom-content-copy">
							<p>2023 - 2030 | Alrights reserved by Dream IT</p>
						</div>
					</div>
				</div>
				<div className="col-lg-6 col-md-6">
					<div className="footer-bottom-menu text-right">
						<ul>
							<li><Link to="/about">About</Link></li>
							<li><Link to="/service">Services</Link></li>
							<li><Link to="/contact">Contact</Link></li>
							<li><Link to="/faq">Faq</Link></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>	
    );
};

export default Footer;