import BreadCumb from '../Components/Common/BreadCumb';
import Faq from '../Components/Faq/Faq';
import Cta from '../Components/Cta/Cta';

const FaqPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Team"
                title="Meet Our Most Experts <br>Team Members"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb> 
            <Faq></Faq>
            <Cta></Cta>
        </div>
    );
};

export default FaqPage;