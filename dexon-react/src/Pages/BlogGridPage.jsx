
import BlogGrid from '../Components/Blog/BlogGrid';
import BreadCumb from '../Components/Common/BreadCumb';

const BlogGridPage = () => {
    return (
        <div>
            <BreadCumb
                bgImg="/assets/images/resource/inner-bg.jpg"
                subTitle="Blog Grid"
                title="Blog Grid"
                content="Ullamcorper risus ultrices risus lorem. Mollis libero in pellentesque Vulputate ut aliquam, consectetur turpis"
            ></BreadCumb>
            <BlogGrid></BlogGrid>
        </div>
    );
};

export default BlogGridPage;