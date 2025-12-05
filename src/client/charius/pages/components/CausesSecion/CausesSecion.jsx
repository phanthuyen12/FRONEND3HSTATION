import React from "react";
import LeftImg from "../../images/causes/left-img.jpg"
import causesData from "../../api/causes"
import { Link } from "react-router-dom";


const CausesSecion = (props) => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }



    return (
        <section className={"" + props.hclass}>
            <div className="causes-top">
                <div className="container-fluid">
                    <div className="row g-0">
                        <div className="col-lg-6 col-12">
                            <div className="image">
                                <img src={LeftImg} alt="img" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="campaign-card">
                                <div className="text">
                                    <h2><Link onClick={ClickHandler} to="/causes-single/1">Promoting The Safety and Rights of Children</Link></h2>
                                    <p>Metus consequat vulputate ullamcorper sit blandit arcu pulvinar mauris.
                                        Tortor duis cum adipiscing egestas nunc.
                                        Feugiat lobortis commodo ut nulla velit. A auctor nisl ipsum gravida tristique
                                        eget vulputate ut.
                                        Non commodo sit purus parturient.</p>
                                </div>
                                <div className="progress-item"> 
                                    <div className="progress">
                                        <div className="bar" style={{ width: '90%' }}>
                                        </div>
                                    </div>
                                    <span className="cssProgress-label">90%</span>
                                    <div className="progres-label">
                                        <div className="label-on">
                                            <p>Raised:<span>$24,808.00</span></p>
                                        </div>
                                        <div className="label-two">
                                            <p>Goal:<span>$26,000.00</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="causes-wrap">
                <div className="container-fluid">
                    <div className="row">
                        {causesData.slice(0, 3).map((causes, index) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={index}>
                                <div className="causes-item">
                                    <div className="image">
                                        <img src={causes.image} alt="img" />
                                    </div>
                                    <div className="content">
                                        <h2><Link onClick={ClickHandler} to={`/causes-single/${causes.slug}`}>{causes.title}</Link></h2>
                                        <p>{causes.description}</p>
                                        <div className="progress-item">
                                            <div className="progress">
                                                <div className="bar" style={{ width: `${(causes.raisedAmount / causes.goalAmount) * 100}%` }}>
                                                </div>
                                            </div>
                                                <span className="cssProgress-label">{Math.round((causes.raisedAmount / causes.goalAmount) * 100)}%</span>
                                            <div className="progres-label">
                                                <div className="label-on">
                                                    <p>Raised:<span>{causes.raisedAmount}</span></p>
                                                </div>
                                                <div className="label-two">
                                                    <p>Goal:<span>{causes.goalAmount}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CausesSecion;
