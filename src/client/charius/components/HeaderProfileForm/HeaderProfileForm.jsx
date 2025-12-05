import React, { useState } from 'react';
import { Link } from "react-router-dom";


const HeaderProfileForm = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
        closeProfile();
    }

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };
    const closeProfile = () => {
        setIsProfileOpen(false);
    };

    return (
        <div className="header-profile-form-wrapper">
            <button className="profile-toggle-btn" onClick={toggleProfile}>
                <i className="fi flaticon-profile"></i>
            </button>
            <div className={`header-profile-content ${isProfileOpen ? 'header-profile-content-toggle' : ""}`}>
                <ul>
                    <li><Link onClick={ClickHandler} to="/">Profile</Link></li>
                    <li><Link onClick={ClickHandler} to="/login">Login</Link></li>
                    <li><Link onClick={ClickHandler} to="/register">Register</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default HeaderProfileForm;