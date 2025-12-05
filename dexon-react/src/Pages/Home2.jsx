import About2 from "../Components/About/About2";
import Feature2 from "../Components/Feature/Feature2";
import HeroBanner2 from "../Components/HeroBanner/HeroBanner2";
import Project from "../Components/Project/Project";
import Services2 from "../Components/Services/Services2";
import Testimonial2 from "../Components/Testimonial/Testimonial2";


const Home2 = () => {
    return (
        <div className="home-page2">
            <HeroBanner2
                bgImg="/dexon-assets/images/slider/hero-bg2.jpg"
                title="Start Achieving <br>Your Short Term <span>SEO Goals</span>"
                content="Distinctively supply exceptional services after uniquely integrate alternative markets rather emerging initiatives."
                btnName="Get Started"
                btnUrl="/dexon/about"
                mainImg="/dexon-assets/images/slider/hero.png"
                compaignNumber="5"
                compaignnName="SEO Compaign"
                salesNumber="87"
                salesName="Sales Increasement"
                textAnimation="SEO"
            ></HeroBanner2>
            <Services2></Services2>
            <Feature2></Feature2>
            <About2
                bgImg="/dexon-assets/images/resource/about-bg.jpg"
                subTitle="About Us"
                title="Discover the Most  Expertise <br> of Our SEO Agency"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque potenti. Vulputate ut aliquam, consectetur turpis odio."
                listItem={[
                    "Continually engineer ethical partnership",
                    "Seamlessly pursue orthogonal customer service ",
                    "Dynamically reconceptualize value"
                ]}
                peopleImg="/dexon-assets/images/resource/peolpe.png"
                peopleContent="Al Over 3M+ People Trusted around the World."   
                mainimage="/dexon-assets/images/resource/about3.png"        
            ></About2>
            <Project></Project>
            <Testimonial2></Testimonial2>
        </div>
    );
};

export default Home2;