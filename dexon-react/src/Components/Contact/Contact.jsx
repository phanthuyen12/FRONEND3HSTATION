
const Contact = () => {
    return (
        <div className="contact-us">
		<div className="container">
			<div className="row">
				<div className="col-lg-6">
					<div className="contact-thumb">
						<img src="/assets/images/resource/contact.jpg" alt="" />
					</div>
				</div>
				<div className="col-lg-6">
					<div className="dexon-section-title padding-lg1">
						<h1>Send Us a Message</h1>
						<p>Send Us Your Valuable Message & We will reply your Message soon!</p>
					</div>
					<div className="contact-form-box3">
						<form action="https://formspree.io/f/myyleorq" method="POST" id="dreamit-form">
							<div className="row">
								<div className="col-lg-12">
									<h6 className="form-title"> Name*</h6>
									<div className="form-box">
										<input type="text" placeholder="Enter Your Name" />
									</div>
								</div>
								<div className="col-lg-12"> 
									<h6 className="form-title"> Your E-Mail*</h6>
									<div className="form-box">
										<input type="text" placeholder="Enter E-Mail" />
									</div>
								</div>
								<div className="col-lg-12">
									<div className="form-box">
										<h6 className="form-title"> Comment*</h6>
										<textarea name="massage" id="massage" cols="30" rows="10" placeholder="Write Comment"></textarea>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="contact-form style-two">
										<button type="submit">  Submit Now </button>
									</div>
								</div>
							</div>
						</form>
						<div id="status"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default Contact;