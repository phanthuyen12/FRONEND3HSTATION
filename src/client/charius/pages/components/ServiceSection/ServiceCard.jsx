import React from "react";
import { Link } from 'react-router-dom'

const ServiceCard = ({ img, title, sdescription, slug }) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return (
        <div className="service-item">
            <div className="icon">
                <img src={img} alt="img" />
            </div>
            <div className="text">
                <h2><Link onClick={ClickHandler} to={`/service-single/${slug}`}>{title}</Link></h2>
                <p>{sdescription}</p>
            </div>
        </div>
    )
}


export default ServiceCard;



