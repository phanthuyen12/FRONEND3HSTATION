import About3 from "../Components/About/About3";
import BreadCumb from "../Components/Common/BreadCumb";
import Cta from "../Components/Cta/Cta";
import Feature3 from "../Components/Feature/Feature3";
import Team from "../Components/Team/Team";

const AboutPage = () => {
    return (
        <div className="about-page">
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="About Us"
                title="Working together leads to <br>Amazing Outcomes."
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <About3></About3>
            <Feature3></Feature3>
            <Team></Team>
            <Cta></Cta>
        </div>
    );
};

export default AboutPage;