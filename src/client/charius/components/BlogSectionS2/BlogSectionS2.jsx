import React from "react";
import { Link } from "react-router-dom";
import blogs from '../../api/blogs'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSectionS2 = (props) => {





    return (
        <section className="wpo-blog-section-s2 section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-12">
                        <div className="wpo-section-title">
                            <span>- LATEST NEWS -</span>
                            <h2>Latest News
                                and Article’s
                                From blog.</h2>
                            <Link className="theme-btn" to="/blog-single/1">Other’s Post</Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {blogs.slice(0, 3).map((blog, bl) => (
                        <div className="col-lg-4 col-md-6 col-12" key={bl}>
                            <div className="blog-single-card">
                                <div className="image">
                                    <img src={blog.screens} alt="" />
                                </div>
                                <div className="content">
                                    <span>{blog.create_at}</span>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.subtitle}</p>
                                </div>
                                <Link className="theme-btn" onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>



    );
}

export default BlogSectionS2;










