import { Link } from 'react-router-dom';

const PricingCard = ({classAdd,title,price,duration,featuretitle,featurelist}) => {
    return (
        <div className={classAdd}>
        <div className="pricing-head">
            <h4 className="price-top-title">{title}</h4>
            <div className="pricing"> 
                <h2 className="price-title">{price}</h2>
                <span className="price-mon"> / {duration}</span>
            </div>
        </div>
        <div className="pricing-boody">
            <span>{featuretitle}</span>
            <ul>
            {featurelist?.map((item, index) => (
                <li key={index}> <i className="bi bi-check-lg"></i> {item} </li>
            ))}
            </ul>
        </div>
        <div className="price-btn">
        <Link to="/contact">Get Started <i className="bi bi-arrow-right-short"></i></Link>
        </div>
    </div>
    );
};

export default PricingCard;