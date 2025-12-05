import { Link } from "react-router-dom";
import causesData from "../../api/causes";
import SectionTitle from "../SectionTitle/SectionTitle";


const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const CausesSecionS3 = (props) => {
    return (
        <section className={"" + props.hclass}>
            <div className="causes-wrap">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <SectionTitle subtitle="Featured Cause" title="Find the popular cause" />
                        </div>
                    </div>
                    <div className="row">
                        {causesData.slice(0, 3).map((cause, cky) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={cky}>
                                <div className="causes-item">
                                    <div className="image">
                                        <img src={cause.image} alt="" />
                                    </div>
                                    <div className="content">
                                        <h2><Link onClick={ClickHandler} to={`/causes-single/${cause.slug}`}>{cause.title}</Link></h2>
                                        <p>{cause.subtitle}</p>
                                        <div className="progress-item">
                                            <div className="progress">
                                                <div className="bar" style={{ width: `${(cause.raisedAmount / cause.goalAmount) * 100}%` }}></div>
                                            </div>
                                            <span className="cssProgress-label">{((cause.raisedAmount / cause.goalAmount) * 100).toFixed(2)}%</span>
                                            <div className="progres-label">
                                                <div className="label-on">
                                                    <p>Raised:<span>${cause.raisedAmount}</span></p>
                                                </div>
                                                <div className="label-two">
                                                    <p>Goal:<span>${cause.goalAmount}</span></p>
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
    )
}

export default CausesSecionS3; 