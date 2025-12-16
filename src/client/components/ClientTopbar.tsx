import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { AppDispatch } from "../../redux/store";
import { useViewPort } from "../../hooks";
import { changeSideBarType } from "../../redux/actions";
import { SideBarType } from "../../constants/layout";

//logo
import logoLight from '../../assets/images/logo-light.png'
import logoDark from '../../assets/images/logo-dark.png'
import logoSm from '../../assets/images/logo-sm.png'
import { TopBarSearch, MaximizeScreen } from "../../components";
import ClientProfileDropDown from "./ClientProfileDropDown";

const ClientTopbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useViewPort();

  /**
  * Toggle the leftmenu when having mobile screen
  */
  const handleLeftMenuCallBack = () => {
    if (width < 1140) {
      if (document.getElementsByTagName('html')[0].classList.contains('sidenav-enable')) {
        hideLeftSideBarBackdrop();
      } else {
        dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
        showLeftSideBarBackdrop();
        document.getElementsByTagName('html')[0].classList.add('sidenav-enable');
      }
    } else if (document.getElementsByTagName('html')[0].classList.contains('sidenav-enable')) {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_DEFAULT));
      document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
      hideLeftSideBarBackdrop();
    } else {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_SMALL))
    }
  }

  /**
   * toggling style to the body tag
   */
  function toggleBodyStyle(set: boolean) {
    if (set == false) {
      document.body.removeAttribute('style')
    }
    else {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '16px'
    }
  }

  /**
   * creates backdrop for leftsidebar
   */
  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    backdrop.className = 'transition-all fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80';
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function () {
      document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
      toggleBodyStyle(false)
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
      hideLeftSideBarBackdrop();
    });
  }

  function hideLeftSideBarBackdrop() {
    const backdrop = document.getElementById('backdrop');
    document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
    if (backdrop) {
      document.body.removeChild(backdrop);
      document.body.style.removeProperty('overflow');
    }
  }

  return (
    <>
      <header className="app-header flex items-center px-2 sm:px-4 gap-2 sm:gap-3">
        <button
          id="button-toggle-menu"
          className="nav-link p-2"
          onClick={handleLeftMenuCallBack}
        >
          <span className="sr-only">Menu Toggle Button</span>
          <span className="flex items-center justify-center h-6 w-6">
            <i className="mgc_menu_line text-xl"></i>
          </span>
        </button>

        <Link to="/" className="logo-box flex-shrink-0">
          <div className="logo-light">
            <img src={logoLight} className="logo-lg" alt="Light logo" />
          </div>

          <div className="logo-dark">
            <img src={logoDark} className="logo-lg" alt="Dark logo" />
          </div>
        </Link>

        <div className="hidden md:block flex-1">
          <TopBarSearch />
        </div>

        <div className="hidden lg:block">
          <MaximizeScreen />
        </div>

        <div className="ml-auto flex-shrink-0">
          <ClientProfileDropDown />
        </div>
      </header>
    </>
  )
}

export default ClientTopbar



