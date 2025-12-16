import About2 from "../Components/About/About2";
import Choose2 from "../Components/Choose/Choose2";
import BreadCumb2 from "../Components/Common/BreadCumb2";
import Cta2 from "../Components/Cta/Cta2";
import MarqueeText from "../Components/MarqueeText/MarqueeText";
import Team1 from "../Components/Team/Team1";
import Testimonial2 from "../Components/Testimonial/Testimonial2";

const AboutDark = () => {
    return (
        <div>
            <BreadCumb2 Title="About Us"></BreadCumb2>
            <MarqueeText></MarqueeText>
            <About2
                image1="/assets/img/about/about2-img1.png"
                image2="/assets/img/about/about2-img2.png"
                image3="/assets/img/about/about2-img3.png"
                experienceNum="25"
                experienceTitle="Years Of <br> Experience"
                subTitle="Our Service"
                title="Tối ưu hạ tầng và tự động hóa với H3Station"
                content="H3Station cung cấp dịch vụ VPS, cloud và tự động hóa n8n giúp doanh nghiệp rút ngắn thời gian triển khai, tăng độ ổn định và bảo mật dữ liệu."
                counName1="IT Consulting"
                CounNum1="100%"
                counName2="Cyber Security"
                CounNum2="98%"
            ></About2>
            <Choose2></Choose2>
            <Testimonial2></Testimonial2>
            <Team1></Team1>
            <Cta2></Cta2>
        </div>
    );
};

export default AboutDark;