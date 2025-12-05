import React from 'react';
import { Link } from 'react-router-dom'
import about from '../../images/blog-details/author.jpg'
import blogs from '../../api/blogs'


// instagram
import insta1 from '../../images/instragram/img-1.jpg'
import insta2 from '../../images/instragram/img-2.jpg'
import insta3 from '../../images/instragram/img-3.jpg'
import insta4 from '../../images/instragram/img-4.jpg'
import insta5 from '../../images/instragram/img-5.jpg'
import insta6 from '../../images/instragram/img-6.jpg'

const SubmitHandler = (e) => {
    e.preventDefault()
}

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSidebar = (props) => {
    return (
        <div className={`col col-lg-4 col-12 ${props.blLeft}`}>
            <div className="blog-sidebar">
                <div className="widget about-widget">
                    <div className="img-holder">
                        <img src={about} alt="" />
                    </div>
                    <h4>Bernard Rodgers</h4>
                    <p>Hi! beautiful people. I`m an authtor of this blog. Read our post - stay with us</p>
                    <div className="social">
                        <ul className="clearfix">
                            <li><Link onClick={ClickHandler} to="/"><i className="ti-facebook"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/"><i className="ti-twitter-alt"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/"><i className="ti-linkedin"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/"><i className="ti-pinterest"></i></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="widget search-widget">
                    <h3>Search Here</h3>
                    <form onSubmit={SubmitHandler}>
                        <div>
                            <input type="text" className="form-control" placeholder="Search Post.." />
                            <button type="submit"><i className="ti-search"></i></button>
                        </div>
                    </form>
                </div>
                <div className="widget category-widget">
                    <h3>Post Categories</h3>
                    <ul>
                        <ul>
                            <li><Link onClick={ClickHandler} to="/blog-single/1">Child Education<span>5</span></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/1">Healthy Food<span>7</span></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/1">Clean Water<span>3</span></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/1">Secure Life<span>2</span></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/1">Healthy Lifestyle<span>8</span></Link></li>
                        </ul>
                    </ul>
                </div>
                <div className="widget recent-post-widget">
                    <h3>Related Posts</h3>
                    <div className="posts">
                        {blogs.map((blog, bl) => (
                            <div className="post" key={bl}>
                                <div className="img-holder">
                                    <img src={blog.recent} alt="" />
                                </div>
                                <div className="details">
                                    <h4><Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.title}</Link></h4>
                                    <span className="date">{blog.create_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="widget wpo-instagram-widget">
                    <div className="widget-title">
                        <h3>Instagram</h3>
                    </div>
                    <ul className="d-flex">
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta1}
                            alt="" /></Link></li>
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta2}
                            alt="" /></Link></li>
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta3}
                            alt="" /></Link></li>
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta4}
                            alt="" /></Link></li>
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta5}
                            alt="" /></Link></li>
                        <li><Link to="/event-single/1" onClick={ClickHandler} ><img src={insta6}
                            alt="" /></Link></li>
                    </ul>
                </div>
                <div className="widget tag-widget">
                    <h3>Tags</h3>
                    <ul>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Charity</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Planning</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Helping</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Education</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Medical</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Wildlife</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Donation</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">Help</Link></li>
                        <li><Link onClick={ClickHandler} to="/event-single/1">World Pandamic</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default BlogSidebar;
