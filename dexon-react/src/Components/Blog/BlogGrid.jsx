import { Link } from "react-router-dom";
import data from '../../Data/blog.json';

const BlogGrid = () => {
    return (
        <div className="blogs-section">
		<div className="container">
			<div className="row">
            {data.map((item, i) => (
				<div key={i} className="col-lg-4 col-md-6">
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
	</div>
    );
};

export default BlogGrid;