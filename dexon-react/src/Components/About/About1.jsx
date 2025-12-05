import { Link } from "react-router-dom";

const About1 = ({mainimage,title1,title2,content,listItem,btnName,btnUrl}) => {
    return (
        <div className="row about-bg align-items-center">
        <div className="col-lg-6">
            <div className="about-thumb">
                <img src={mainimage} alt="" />
            </div>
        </div>
        <div className="col-lg-6">
            <div className="dexon-section-title">
                <h1>{title1}</h1>
                <h1>{title2}</h1>
                <p>{content}</p>
            </div>
            <div className="about-item-list">
                <ul>
                {listItem?.map((item, index) => (
                    <li key={index}><i className="bi bi-check2-all"></i> {item} </li>
                ))}
                </ul>
            </div>
            <div className="about-button2">
                <Link to={btnUrl} className="dexon-button">{btnName} <i className="bi bi-arrow-right-short"></i> </Link>
            </div>
        </div>
    </div>
    );
};

export default About1;