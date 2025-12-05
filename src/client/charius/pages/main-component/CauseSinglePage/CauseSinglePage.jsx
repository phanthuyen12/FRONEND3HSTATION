import React, { Fragment, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { Link, useParams } from 'react-router-dom'
import Footer from '../../components/footer/Footer';
import Causes from '../../api/causes';
import Blog from '../../api/blogs'

import Logo from '../../images/logo.svg'
import DonationForm from './DonationForm';
import CommentForm from './CommentForm';

import Comment1 from "../../images/blog-details/comments-author/img-1.jpg";
import Comment2 from "../../images/blog-details/comments-author/img-2.jpg";
import Comment3 from "../../images/blog-details/comments-author/img-3.jpg";


// instagram
import insta1 from '../../images/instragram/img-1.jpg'
import insta2 from '../../images/instragram/img-2.jpg'
import insta3 from '../../images/instragram/img-3.jpg'
import insta4 from '../../images/instragram/img-4.jpg'
import insta5 from '../../images/instragram/img-4.jpg'
import insta6 from '../../images/instragram/img-6.jpg'

const CauseSinglePage = (props) => {
    const { slug } = useParams()

    const CauseSingle = Causes.find(item => item.slug === slug)

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
    const totalValue = (CauseSingle.raisedAmount / CauseSingle.goalAmount) * 100;

    const [activeTab, setActiveTab] = useState(0);
    const handleTabClick = (index) => {
        setActiveTab(index)
    }
    const SubmitHandler = (e) => {
        e.preventDefault()
    }

    return (
        <Fragment>
            <Navbar Logo={Logo} hclass={'wpo-site-header-s5'}  />
            <PageTitle pageTitle={CauseSingle.title} pagesub={'Cause'} />
            <div className="wpo-case-details-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-8">
                            <div className="wpo-case-details-wrap">
                                <div className="wpo-case-details-img">
                                    <img src={CauseSingle.Simage} alt="img" />
                                </div>
                                <div className="wpo-case-details-tab">
                                    <ul className="nav nav-tabs" >
                                        <li className="nav-item">
                                            <span className={activeTab === 0 ? 'active' : ''} onClick={() => handleTabClick(0)} >Description</span>
                                        </li>
                                        <li className="nav-item">
                                            <span className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)} >Donations</span>
                                        </li>
                                        <li className="nav-item">
                                            <span className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)} >Comments</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="wpo-case-details-text">
                                    <div className="tab-content">
                                        <div className={activeTab === 0 ? 'active' : 'hidden'}>
                                            <div className="Description">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="wpo-case-content">
                                                            <div className="wpo-case-text-top">
                                                                <h2>{CauseSingle.title}</h2>
                                                                <div className="progress-sub">
                                                                    <div className="progress-section">
                                                                        <div className="process">
                                                                            <div className="progress">
                                                                                <div className="progress-bar" style={{ width: `${totalValue}%` }}>
                                                                                    <div className="progress-value">
                                                                                        {totalValue.toFixed(1)}%</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <ul>
                                                                        <li><span>Raised:</span>${CauseSingle.raisedAmount}</li>
                                                                        <li><span>Goal:</span>${CauseSingle.goalAmount}</li>
                                                                        <li><span>Donar:</span> 380</li>
                                                                    </ul>
                                                                </div>
                                                                <div className="case-b-text">
                                                                    <p>On the other hand, we denounce with righteous indignation
                                                                        and dislike men who are so beguiled and demoralized by
                                                                        the charms of pleasure of the moment, so blinded by
                                                                        desire, that they cannot foresee the pain and trouble
                                                                        that are bound to ensue and equal blame belongs to those
                                                                        who fail in their duty through weakness of will, which
                                                                        is the same as saying through shrinking from toil and
                                                                        pain.</p>
                                                                    <p>These cases are perfectly simple and easy to distinguish.
                                                                        In a free hour, when our power of choice is untrammelled
                                                                        and when nothing prevents our being able to do what we
                                                                        like best, every pleasure is to be welcomed and every
                                                                        pain avoided.</p>
                                                                    <p>But in certain circumstances and owing to the claims of
                                                                        duty or the obligations of business it will frequently
                                                                        occur that pleasures have to be repudiated and
                                                                        annoyances accepted. The wise man therefore always holds
                                                                        in these matters to this principle of selection: he
                                                                        rejects pleasures.</p>
                                                                </div>
                                                                <div className="case-bb-text">
                                                                    <h3>We want to ensure the education for the kids.</h3>
                                                                    <p>These cases are perfectly simple and easy to distinguish.
                                                                        In a free hour, when our power of choice is untrammelled
                                                                        and when nothing prevents our being able to do what we
                                                                        like best, every pleasure.</p>
                                                                    <ul>
                                                                        <li>The wise man therefore always holds in these
                                                                            matters.</li>
                                                                        <li>In a free hour, when our power of choice and when
                                                                            nothing.</li>
                                                                        <li>Else he endures pains to avoid worse pains.</li>
                                                                        <li>We denounce with righteous indignation and dislike
                                                                            men. </li>
                                                                        <li>Which is the same as saying through.</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={activeTab === 1 ? 'active' : 'hidden'}>
                                            <DonationForm />
                                        </div>
                                        <div className={activeTab === 2 ? 'active' : 'hidden'}>
                                            <div className="wpo-blog-single-section">
                                                <div className="comments-area">
                                                    <div className="comments-section">
                                                        <h3 className="comments-title">Comments</h3>
                                                        <ol className="comments">
                                                            <li className="comment even thread-even depth-1" id="comment-1">
                                                                <div id="div-comment-1">
                                                                    <div className="comment-theme">
                                                                        <div className="comment-image"><img
                                                                            src={Comment1}
                                                                            alt="img" /></div>
                                                                    </div>
                                                                    <div className="comment-main-area">
                                                                        <div className="comment-wrapper">
                                                                            <div className="comments-meta">
                                                                                <h4>John Abraham <span
                                                                                    className="comments-date">Octobor 28,2024 At
                                                                                    9.00am</span></h4>
                                                                            </div>
                                                                            <div className="comment-area">
                                                                                <p>I will give you a complete account of the
                                                                                    system, and expound the actual teachings of
                                                                                    the great explorer of the truth, </p>
                                                                                <div className="comments-reply">
                                                                                    <Link className="comment-reply-link" onClick={ClickHandler} to="#"><i
                                                                                        className="fa fa-reply"
                                                                                        aria-hidden="true"></i><span>Reply</span></Link>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ul className="children">
                                                                    <li className="comment">
                                                                        <div>
                                                                            <div className="comment-theme">
                                                                                <div className="comment-image"><img
                                                                                    src={Comment2}
                                                                                    alt="img" /></div>
                                                                            </div>
                                                                            <div className="comment-main-area">
                                                                                <div className="comment-wrapper">
                                                                                    <div className="comments-meta">
                                                                                        <h4>Lily Watson <span
                                                                                            className="comments-date">Octobor
                                                                                            28,2024 At 9.00am</span></h4>
                                                                                    </div>
                                                                                    <div className="comment-area">
                                                                                        <p>I will give you a complete account of
                                                                                            the system, and expound the actual
                                                                                            teachings of the great explorer of
                                                                                            the truth, </p>
                                                                                        <div className="comments-reply">
                                                                                            <Link className="comment-reply-link"
                                                                                                onClick={ClickHandler} to="#"><span><i
                                                                                                    className="fa fa-reply"
                                                                                                    aria-hidden="true"></i>
                                                                                                    Reply</span></Link>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <ul>
                                                                            <li className="comment">
                                                                                <div>
                                                                                    <div className="comment-theme">
                                                                                        <div className="comment-image"><img
                                                                                            src={Comment3}
                                                                                            alt="img" /></div>
                                                                                    </div>
                                                                                    <div className="comment-main-area">
                                                                                        <div className="comment-wrapper">
                                                                                            <div className="comments-meta">
                                                                                                <h4>John Abraham <span
                                                                                                    className="comments-date">Octobor
                                                                                                    28,2024 At 9.00am</span>
                                                                                                </h4>
                                                                                            </div>
                                                                                            <div className="comment-area">
                                                                                                <p>I will give you a complete
                                                                                                    account of the system, and
                                                                                                    expound the actual teachings
                                                                                                    of the great explorer of the
                                                                                                    truth, </p>
                                                                                                <div className="comments-reply">
                                                                                                    <Link className="comment-reply-link"
                                                                                                        onClick={ClickHandler} to="#"><span><i
                                                                                                            className="fa fa-reply"
                                                                                                            aria-hidden="true"></i>
                                                                                                            Reply</span></Link>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                        </ol>
                                                    </div>
                                                </div>
                                                <div className="comment-respond">
                                                    <h3 className="comment-reply-title">Leave a Comment</h3>
                                                    <CommentForm />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-12">
                            <div className="blog-sidebar">
                                <div className="widget search-widget">
                                    <form onSubmit={SubmitHandler}>
                                        <div>
                                            <input type="text" className="form-control" placeholder="Search Post.." />
                                            <button type="submit"><i className="ti-search"></i></button>
                                        </div>
                                    </form>
                                </div>
                                <div className="widget recent-post-widget">
                                    <h3>Related Posts</h3>
                                    <div className="posts" >
                                        {Blog.slice(0, 3).map((blog, bitem) => (
                                            <div className='post' key={bitem}>
                                                <div className="img-holder">
                                                    <img src={blog.recent} alt="" />
                                                </div>
                                                <div className="details">
                                                    <h4>
                                                        <Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>
                                                            {blog.title}
                                                        </Link>
                                                    </h4>
                                                    <span className="date">{blog.create_at}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="widget wpo-instagram-widget">
                                    <div className="widget-title">
                                        <h3>Projects</h3>
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
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment >
    )
};
export default CauseSinglePage;


