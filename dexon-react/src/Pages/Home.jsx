import Cta from "../Components/Cta/Cta";
import Feature1 from "../Components/Feature/Feature1";
import HeroBanner1 from "../Components/HeroBanner/HeroBanner1";
import Service1 from "../Components/Services/Service1";
import Testimonial1 from "../Components/Testimonial/Testimonial1";

// Import images từ public folder - trong Vite, sử dụng đường dẫn trực tiếp
const heroBgImage = "/dexon-assets/images/slider/hero-bg.jpg";
const heroShape1Image = "/dexon-assets/images/slider/hero-shp1.png";
const heroShape2Image = "/dexon-assets/images/slider/hero-shp2.png";
const heroShape3Image = "/dexon-assets/images/slider/circle.png";

const Home = () => {
    return (
        <div className="home-page1">
            <HeroBanner1
                bgmage={heroBgImage}
                Title1="3HStation"
                Title2="Giải pháp toàn diện cho doanh nghiệp"
                content="3HStation cung cấp giải pháp toàn diện với Workflow tự động hóa, Khóa học chuyên sâu và VPS hiệu năng cao cho doanh nghiệp của bạn."
                btnName="Bắt đầu ngay"
                btnUrl="/login"
                heroShape1={heroShape1Image}
                heroShape2={heroShape2Image}
                heroShape3={heroShape3Image}
            ></HeroBanner1>
            <Feature1></Feature1>
            {/* <Service1></Service1> */}
            {/* <Testimonial1></Testimonial1> */}
            {/* <Cta></Cta> */}
        </div>
    );
};

export default Home;
