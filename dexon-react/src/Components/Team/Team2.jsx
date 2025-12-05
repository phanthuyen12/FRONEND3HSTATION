import data from '../../Data/team1.json';

const Team2 = () => {
    return (
        <div className="team-section style-two">
		<div className="container">
			<div className="row">
            {data.map((item, i) => (
				<div key={i} className="col-lg-4 col-md-6">
					<div className="single-team-box">
						<div className="team-thumb">
							<img src={item.img} alt="" />
						</div>
						<div className="team-content">
							<h3 className="team-title"> {item.title} </h3>
							<p className="team-text"> {item.desc} </p>
							<div className="team-social">
								<ul>
									<li><a href="#"><i className="bi bi-facebook"></i> </a></li>
									<li><a href="#"> <i className="bi bi-twitter"></i> </a></li>
									<li><a href="#"> <i className="bi bi-linkedin"></i> </a></li>
									<li><a href="#"> <i className="bi bi-pinterest"></i> </a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
                 ))}

			</div>
		</div>
	</div>
    );
};

export default Team2;