import { Link } from "react-router-dom";

const ServiceCard = ({title,content,btnName,btnUrl}) => {
    return (
        <div className="service-content">
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{content}</p>
        <Link className="dexon-button" to={btnUrl}>{btnName} <i className="bi bi-arrow-right-short"></i></Link>
    </div>
    );
};

export default ServiceCard;