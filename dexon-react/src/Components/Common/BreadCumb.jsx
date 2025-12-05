import { useEffect } from "react";
import loadBackgroudImages from "./loadBackgroudImages";
import parse from 'html-react-parser';

const BreadCumb = ({bgImg,subTitle,title,content}) => {
    
    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (

      <div className="breatcam-section d-flex align-items-center" data-background={bgImg}>
      <div className="container">
        <div className="row dream-bg align-items-center">
          <div className="col-lg-12">
            <div className="breatcam-content text-center">
              <h4> <span> {subTitle} </span> </h4>
              <h1>{parse(title)}</h1>
              <p>{content}</p>
            </div>
          </div>
          <div className="inner-page-shape">
            <div className="inner-shape">
              <img src="/assets/images/resource/shape-2.png" alt="" /> 
            </div>
            <div className="inner-shape2">
              <img src="/assets/images/resource/shap-2.png" alt="" />
            </div>
            <div className="inner-shape3">
              <img src="/assets/images/resource/inner-shp.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    );
};

export default BreadCumb;