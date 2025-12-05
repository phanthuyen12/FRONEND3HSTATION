import BreadCumb from '../Components/Common/BreadCumb';
import Cta from '../Components/Cta/Cta';
import Pricing from '../Components/Pricing/Pricing';

const PricingPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Pricing"
                title="Here are an Overview <br> Our Pricing Plans"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb> 
            <Pricing></Pricing>
            <Cta></Cta>
        </div>
    );
};

export default PricingPage;