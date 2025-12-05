import { Link } from "react-router-dom";

const ProjectCardStyle2 = ({img,subTitle,title}) => {
    return (
        <div className="col-lg-4 col-md-6">
        <div className="single-project-box">
            <div className="project-thumb">
                <img src={img} alt="" />
                <div className="project-content">
                    <h5>{subTitle}</h5>
                    <h2>{title}</h2>
                    <Link to="/service"><i className="bi bi-arrow-right-short"></i></Link>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ProjectCardStyle2;