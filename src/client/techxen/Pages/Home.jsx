import About1 from "../Components/About/About1";
import Award1 from "../Components/Award/Award1";
import Blog1 from "../Components/Blog/Blog1";
import Choose1 from "../Components/Choose/Choose1";
import Cta1 from "../Components/Cta/Cta1";
import HeroBanner1 from "../Components/HeroBanner/HeroBanner1";
import Pricing1 from "../Components/Pricing/Pricing1";
import Project1 from "../Components/Project/Project1";
import Services1 from "../Components/Services/Services1";
import Testimonial1 from "../Components/Testimonial/Testimonial1";

const Home = ({ plans = [], courses = [], workflows = [], loading = false }) => {
    return (
        <div className="home-page1">
            <HeroBanner1
                bgImg="/assets/img/bg/hero1-bg.png"
                subTitle="H3Station • Cloud & Automation"
                title="Tăng tốc doanh nghiệp với hạ tầng <span class='after'>H3STATION</span>"
                content="H3Station cung cấp hạ tầng VPS hiệu năng cao, triển khai n8n tự động hóa và các giải pháp server tối ưu cho cá nhân & doanh nghiệp."
                btnName="Bắt đầu ngay"
                btnUrl="/landing"
                image1="/assets/img/hero/hero1-image1.png"
                image2="/assets/img/hero/hero1-image2.png"
                shapeImage1="/assets/img/hero/hero1-image3.png"
                shapeiamge2="/assets/img/hero/hero1-image4.png"
            ></HeroBanner1>
            <Award1></Award1>
            <About1
                image1="/assets/img/about/about1-img1.png"
                image2="/assets/img/about/about1-img2.png"
                supIcon="/assets/img/icons/about1-shape-icon.png"
                supTitle="24/7 Support"
                supCon="H3Station Cloud & Automation"
                subTitle="Về H3Station"
                Title="Hạ tầng số cho thời đại tự động hóa"
                content="H3Station cung cấp VPS mạnh mẽ, triển khai n8n và các dịch vụ server tối ưu để doanh nghiệp vận hành nhanh, ổn định và bảo mật. Chúng tôi tập trung vào hiệu năng, sự tin cậy và hỗ trợ tận tâm 24/7."
                featurelist={[
                    "VPS hiệu năng cao, uptime 99.99%",
                    "Triển khai & tối ưu n8n theo nhu cầu",
                    "Đội ngũ hỗ trợ 24/7, tư vấn tận tâm",
                ]}
                btnName="Tư vấn miễn phí"
                btnUrl="/landing"
            ></About1>
            <Services1></Services1>
            <Choose1></Choose1>
            <Project1 courses={courses} loading={loading}></Project1>
            <Pricing1 plans={plans} loading={loading}></Pricing1>
            <Testimonial1></Testimonial1>
            <Cta1></Cta1>
        </div>
    );
};

export default Home;