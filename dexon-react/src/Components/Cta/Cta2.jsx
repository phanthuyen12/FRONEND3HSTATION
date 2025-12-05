import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";

const Cta2 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="call-to-action style-two" data-background="/assets/images/resource/call-bg.png">
		<div className="container">
			<div className="row dream1-bg">
				<div className="col-lg-4 col-md-6">
					<div className="contact-info">
						<div className="contact-icon">
							<i className="bi bi-envelope"></i>
						</div>
						<div className="contact-title">
							<span>Email Us</span>
							<h5>Example@gmail.com</h5>
						</div>
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="contact-info upper">
						<div className="contact-icon">
							<i className="bi bi-whatsapp"></i>
						</div>
						<div className="contact-title">
							<span>What’s App</span>
							<h5>+980 123 456 789</h5>
						</div>
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="contact-info upper2">
						<div className="contact-icon">
							<i className="bi bi-send-fill"></i>
						</div>
						<div className="contact-title">
							<span>Telegram</span>
							<h5>Telegram/dexon</h5>
						</div>
					</div>
				</div>
				<div className="call-to-all-shape">
					<div className="call-shape">
						<img src="/assets/images/resource/line.png" alt="" />
					</div>
					<div className="call-shape3">
						<img src="/assets/images/resource/shap1.png" alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default Cta2;