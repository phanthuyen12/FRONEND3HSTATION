
import { Link } from "react-router-dom"


import Shape from "../../images/cta/shape-1.png"
import Shape2 from "../../images/cta/left-img.png"
import Shape3 from "../../images/cta/right-img.png"
import Shape4 from "../../images/cta/shape-2.png"
import Icon from "../../images/cta/top-icon.png"

const CtaSection2 = () => {
    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    return(
        <section className="wpo-cta-section-s2">
            <div className="shape-1">
                <img src={Shape} alt="" />
            </div>
            <div className="left-img">
                <img src={Shape2} alt="" />
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="cta-wrap">
                            <div className="icon">
                                <img src={Icon} alt="" />
                            </div>
                            <span>Help us raise them up.</span>
                            <h2>Your donation means a lot to them.
                                Donate what you can.</h2>
                            <Link to="/donate" className="theme-btn" onClick={ClickHandler}>Start Donating Them</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-img">
                <img src={Shape3} alt="" />
            </div>
            <div className="shape-2">
                <img src={Shape4} alt="" />
            </div>
        </section>
    )
}

export default CtaSection2;