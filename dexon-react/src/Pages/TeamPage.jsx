import BreadCumb from "../Components/Common/BreadCumb";
import Cta from "../Components/Cta/Cta";
import Team2 from "../Components/Team/Team2";

const TeamPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Team"
                title="Meet Our Most Experts <br>Team Members"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb> 
            <Team2></Team2>
            <Cta></Cta>           
        </div>
    );
};

export default TeamPage;