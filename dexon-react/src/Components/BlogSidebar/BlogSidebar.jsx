import { Link } from 'react-router-dom';
import data from '../../Data/blog.json';

const BlogSidebar = () => {
    return (
        <div className="blogs-section">
		<div className="container">
			<div className="row">
				<div className="col-lg-8">
					<div className="row blogs-pr">
                    {data.slice(0,6).map((item, i) => (
						<div key={i} className="col-lg-6 col-md-6">
							<div className="single-blog-box">
								<div className="blog-thumb">
									<img src={item.img} alt="" />
								</div>
								<div className="blog-content">
									<h2 className="blog-title"><Link to="/blog/blog-details">{item.title}</Link></h2>
									<p className="blog-desc">{item.desc}</p>
									<div className="blog-btn">
                                    <Link to="/blog/blog-details">Read More</Link>
									</div>
								</div>
							</div>
						</div>
                        ))}
					</div>
				</div>
				<div className="col-lg-4 responsive">
					<div className="widget_search upper">
						<form action="#" method="get">
							<input type="text" name="s" value="" placeholder="Search Here" title="Search for:" />
							<button type="submit" className="icons">
                            <i className="bi bi-search"></i>
							</button>
						</form>
					</div>
					<div className="widget-sidebar-box">
						<h4 className="sidebar-title"> Recent Post </h4>
						<div className="widget-recent-post d-flex">
							<div className="rpost-thumb">
								<a href="#"><img src="/assets/images/resource/popular1.jpg" alt="post thumb" /></a>
							</div>
							<div className="rpost-content">
								<div className="rpost-title">
									<h4><a href="#"> Trends and Predictions for 2023 and Beyond </a></h4>
									<span>01 Agus, 2023</span>
								</div>
							</div>
						</div>
						<div className="widget-recent-post d-flex">
							<div className="rpost-thumb">
								<a href="#"><img src="/assets/images/resource/popular2.jpg" alt="post thumb" /></a>
							</div>
							<div className="rpost-content">
								<div className="rpost-title">
									<h4><a href="#"> How to grow your Business Sales in 2023 </a></h4>
									<span>01 Agus, 2023</span>
								</div>
							</div>
						</div>
						<div className="widget-recent-post upper d-flex">
							<div className="rpost-thumb">
								<a href="#"><img src="/assets/images/resource/popular3.jpg" alt="post thumb" /></a>
							</div>
							<div className="rpost-content">
								<div className="rpost-title">
									<h4><a href="#"> How Marketing Agen Digital Adapting </a></h4>
									<span>01 Agus, 2023</span>
								</div>
							</div>
						</div>
					</div>
					<div className="widget-sidebar-box">
						<h4 className="sidebar-title upp">Categories</h4>
						<ul className="sidebar-menu">
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Branding </a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Graphic Design </a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Marketing </a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Web Design</a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Mation </a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> UI UX Design </a></li>
							<li><a href="#"> <i className="bi bi-chevron-double-right"></i> Business</a></li>
							<li className="sidbr-mb"><a href="#"> <i className="bi bi-chevron-double-right"></i> Uncategorized </a></li>
						</ul>
					</div>
					<div className="widget-sidebar-box">
						<h4 className="sidebar-title">Tags</h4>
						<div className="tag-item">
							<ul>
								<li><a href="#">#Mug</a></li>
								<li><a href="#">#Hoody</a></li>
								<li><a href="#">#Headphone</a></li>
								<li><a href="#">#T-Shart</a></li>
								<li><a href="#">#Sunglass</a></li>
								<li><a href="#">#Bags</a></li>
								<li><a className="item" href="#">#Woman Cloth’s</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
    );
};

export default BlogSidebar;