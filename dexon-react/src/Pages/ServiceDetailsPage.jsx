import BreadCumb from '../Components/Common/BreadCumb';
import ServiceDetails from '../Components/ServiceDetails/ServiceDetails';

const ServiceDetailsPage = () => {
    return (
        <div  className='service-detail'>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Service Details"
                title="We Provide Awesome <br>Service Details"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <ServiceDetails></ServiceDetails>
        </div>
    );
};

export default ServiceDetailsPage;