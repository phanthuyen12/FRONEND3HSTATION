import parse from 'html-react-parser';
import { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';

const HeroBanner2 = ({bgImg,title,content,btnName,btnUrl,mainImg,compaignNumber,compaignnName,salesNumber,salesName,textAnimation}) => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="hero-section hero2 d-flex align-items-center" data-background={bgImg}>
                <div className="container">
                    <div className="row align-items-center hero-bg">
                        <div className="col-lg-6">
                            <div className="hero-content2">
                                <h1> {parse(title)} </h1>
                                <p>{content}</p>
                                <div className="hero-button">
                                    <a href={btnUrl}> {btnName} <i className="bi bi-arrow-right-short"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="hero-thumb">
                                <img src={mainImg} alt="" />
                                <div className="hero-counter-box">
                                    <div className="hero-counter">
                                        <h2 className="counter">{compaignNumber}</h2>
                                        <h2 className="counter1">K+</h2>
                                        <span className="counter-text">{compaignnName}</span>
                                    </div>
                                    <div className="hero-counter upper">
                                        <h2 className="counter">{salesNumber}</h2>
                                        <h2 className="counter1">%</h2>
                                        <span className="counter-text">{salesName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-all-shape">
                            <div className="hero-shape6">
                                <img src="/dexon-assets/images/slider/circle2.png" alt="" />
                            </div>
                            <div className="hero-shape7">
                                <h1>{textAnimation}</h1>
                            </div>
                            <div className="hero-shape8">
                                <img src="/dexon-assets/images/resource/shap-1.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default HeroBanner2;