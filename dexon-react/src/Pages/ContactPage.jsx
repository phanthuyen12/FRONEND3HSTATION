import BreadCumb from '../Components/Common/BreadCumb';
import Contact from '../Components/Contact/Contact';
import Cta2 from '../Components/Cta/Cta2';

const ContactPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Contact"
                title="Feel Free to Contact with <br>Our Support Team"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <Contact></Contact>
            <Cta2></Cta2>
        </div>
    );
};

export default ContactPage;