import BlogDetails from "../Components/BlogDetails/BlogDetails";
import BreadCumb from "../Components/Common/BreadCumb";

const BlogDeatilsPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Blog"
                title="Blog Details"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <BlogDetails></BlogDetails>
        </div>
    );
};

export default BlogDeatilsPage;