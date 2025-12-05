import { useEffect, useRef, useState } from "react";
import data from '../../Data/faq.json';
import loadBackgroudImages from "../Common/loadBackgroudImages";

const Faq = () => {

    const accordionContentRef = useRef(null);
    const [openItemIndex, setOpenItemIndex] = useState(-1);
    const [firstItemOpen, setFirstItemOpen] = useState(true);
  
    const handleItemClick = index => {
      if (index === openItemIndex) {
        setOpenItemIndex(-1);
      } else {
        setOpenItemIndex(index);
      }
    };
    useEffect(() => {
      if (firstItemOpen) {
        setOpenItemIndex(0);
        setFirstItemOpen(false);
      }
    }, [firstItemOpen]);


    useEffect(() => {
        loadBackgroudImages();
      }, []);


    return (
        <div className="about-section style-three faq" data-background="/assets/images/resource/about-bg3.jpg">
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="dexon-section-title text-center padding-lg">
						<h1> How Can We Helping You </h1>
						<h1> at this Moment? </h1>
						<p>Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis</p>
					</div>
				</div>
				<div className="col-lg-6 col-md-6 faq-pd">
					<div className="tab_container">
	                    <div id="tab1" className="tab_content">
	                         <ul className="accordion">
                             {data.map((item, index)=>(
		                        <li key={index} className={`cs_accordian ${index === openItemIndex ? "active" : "" }`}>
		                            <a onClick={() => handleItemClick(index)}><span> {item.title}</span> <i className="bi bi-chevron-down"></i></a>
		                            <p ref={accordionContentRef}>{item.desc}</p>
		                        </li>
                                ))}
		                    </ul>
	                    </div>
	                </div>
				</div>
				<div className="col-lg-6 col-md-6">
					<div className="tab_container">
	                    <div id="tab1" className="tab_content">
	                         <ul className="accordion">
                             {data.map((item, index)=>(
		                        <li  key={index} className={`cs_accordian ${index === openItemIndex ? "active" : "" }`}>
		                            <a onClick={() => handleItemClick(index)}><span> {item.title} </span> <i className="bi bi-chevron-down"></i></a>
		                            <p ref={accordionContentRef}>{item.desc}</p>
		                        </li>
))}
		                    </ul>
	                    </div>
	                </div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default Faq;