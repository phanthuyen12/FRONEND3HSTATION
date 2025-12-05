import { Link } from "react-router-dom";
import SectionTitle from "../Common/SectionTitle";
import ProjectCardStyle1 from "./ProjectCardStyle1";
import ProjectCardStyle2 from "./ProjectCardStyle2";

const Project = () => {
    return (
        <div className="project-section">
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="dexon-section-title white text-center padding-lg project-title-area">
						<SectionTitle
                            Title="Already We have Finished Those <br> SEO Project"
                            Content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                        ></SectionTitle>
					</div>
				</div>
			</div>
			<div className="row">

				<ProjectCardStyle1
					img="/assets/images/resource/pr1.jpg"
					subTitle="Campaign"
					title="SEO Consulting"
				></ProjectCardStyle1>

				<ProjectCardStyle2
					img="/assets/images/resource/pr2.jpg"
					subTitle="Campaign"
					title="SEO Consulting"
				></ProjectCardStyle2>

				<ProjectCardStyle2
					img="/assets/images/resource/pr3.jpg"
					subTitle="Campaign"
					title="SEO Consulting"
				></ProjectCardStyle2>

				<ProjectCardStyle2
					img="/assets/images/resource/pr4.jpg"
					subTitle="Campaign"
					title="SEO Consulting"
				></ProjectCardStyle2>

				<div className="col-lg-4 col-md-6">
					<div className="single-project-box style-two">
						<div className="project-thumb">
							<img src="/assets/images/resource/pr5.png" alt="" />
							<div className="project-button">
								<div className="icon">
									<img src="/assets/images/resource/project-icon.png" alt="" />
								</div>
								<div className="dexon-button2 text-center">
									<Link to="/contact">Contact Us <i className="bi-arrow-right-short"></i></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
                
			</div>
		</div>
	</div>

    );
};

export default Project;