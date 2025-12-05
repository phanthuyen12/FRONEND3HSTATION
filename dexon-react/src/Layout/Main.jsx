import { Outlet } from 'react-router-dom';
import Footer from '../Components/Footer/Footer';
import HeaderStyle from '../Components/Header/HeaderStyle';

const Main = () => {
    return (
        <div className='main-page-area'>
            <HeaderStyle></HeaderStyle>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;