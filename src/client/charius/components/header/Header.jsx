import React from 'react'
import { Link } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import HeaderSearchForm from '../HeaderSearchForm/HeaderSearchForm';
import HeaderProfileForm from '../HeaderProfileForm/HeaderProfileForm';
import { connect } from "react-redux";
import { removeFromCart } from "../../store/actions/action";

const Header = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <header id="header">
            <div className={"wpo-site-header " + props.hclass}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <MobileMenu />
                            </div>
                            <div className="col-lg-3 col-md-5 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/"><img src={props.Logo}
                                        alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-1 col-1">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/">Home</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/">Main Home</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-2">Home Style 2</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-3">Home Style 3</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-4">Home Style 4</Link></li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/">Pages</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/about">About</Link></li>
                                                <li><Link onClick={ClickHandler} to="/gallery">Gallery</Link></li>
                                                <li><Link onClick={ClickHandler} to="/testimonial">Testimonial</Link></li>
                                                <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} to="/">Causes</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} to="/causes">Causes Style 1</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/causes-s2">Causes Style 2</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/causes-s3">Causes Style 3</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/causes-single/1">Causes Single</Link></li>
                                                    </ul>
                                                </li>
                                                <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} to="/">Volunteer</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} to="/volunteer">Volunteer</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/volunteer-single">Volunteer Single</Link></li>
                                                    </ul>
                                                </li>
                                                <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} to="/">Services</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} to="/service">Services</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/service-single/1">Services Single</Link></li>
                                                    </ul>
                                                </li>
                                                <li><Link onClick={ClickHandler} to="/404">404 Error</Link></li>
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/donate">Donations</Link></li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/event">Events</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/event">Events</Link></li>
                                                <li><Link onClick={ClickHandler} to="/event-single/1">Events single</Link></li>
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/">Blog</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/blog">Blog right sidebar</Link></li>
                                                <li><Link onClick={ClickHandler} to="/blog-left-sidebar">Blog left sidebar</Link></li>
                                                <li><Link onClick={ClickHandler} to="/blog-fullwidth">Blog fullwidth</Link></li>
                                                <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} to="/">Blog details</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} to="/blog-single/1">Blog details right sidebar</Link>
                                                        </li>
                                                        <li><Link onClick={ClickHandler} to="/blog-single-left-sidebar/1">Blog details left
                                                            sidebar</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/blog-single-fullwidth/1">Blog details
                                                            fullwidth</Link></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li><Link onClick={ClickHandler} to="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-2">
                                <div className="header-right">
                                    <HeaderSearchForm />
                                    <HeaderProfileForm />
                                    <div className="close-form">
                                        <Link onClick={ClickHandler} className="theme-btn" to="/donate">
                                            <span className="mobile">
                                                <i className="fi fa fa-heart"></i>
                                            </span>
                                            <span className="text">Donate Now</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const mapStateToProps = (state) => {
    return {
        carts: state?.cartList?.cart || [],
    };
};

export default connect(mapStateToProps, { removeFromCart })(Header);


