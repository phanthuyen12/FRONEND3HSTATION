import BreadCumb from '../Components/Common/BreadCumb';
import About4 from '../Components/About/About4';
import Cta from '../Components/Cta/Cta';
import Choose from '../Components/Choose/Choose';

const ServicePage = () => {
    return (
        <div className='service-page'>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Services"
                title="We Provide Awesome <br>SEO Services."
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <About4></About4>
            <Choose></Choose>
            <Cta></Cta>
        </div>
    );
};

export default ServicePage;