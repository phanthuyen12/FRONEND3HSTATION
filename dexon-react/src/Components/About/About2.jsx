import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";
import parse from 'html-react-parser';

const About2 = ({bgImg,subTitle,title,content,listItem,peopleImg,peopleContent,mainimage}) => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);
      
    return (
        <div className="about-section" data-background={bgImg}>
		<div className="container">
			<div className="row about-bg">
				<div className="col-lg-6">
					<div className="dexon-section-title white">
						<h4>{subTitle}</h4>
						<h1> {parse(title)} </h1>
						<p>{content}</p>
					</div>
					<div className="about-item-list">
						<ul>
                        {listItem?.map((item, index) => (
							<li key={index}><i className="bi bi-check2-all"></i> {item} </li>
                        ))}
						</ul>
					</div>
					<div className="about-people">
						<img src={peopleImg} alt="" />
					</div>
					<div className="people-text">
						<p>{peopleContent}</p>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="about-thumb">
						<img src={mainimage} alt="" />
						<div className="about-shape">
							<img src="/assets/images/resource/shap-1.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default About2;