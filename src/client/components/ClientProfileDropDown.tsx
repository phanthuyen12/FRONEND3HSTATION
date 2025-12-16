import { Link, useNavigate } from 'react-router-dom'
import React from 'react';
import { PopoverLayout } from '../../components/HeadlessUI';
import { authService } from '../../config';
import { useViewPort } from '../../hooks';

export type ProfileMenuItem = {
  label: string;
  icon: string;
  redirectTo: string;
}

/**
 * profile menu items
 */
const profileMenus: ProfileMenuItem[] = [
  {
    label: 'Profile',
    icon: 'mgc_user_line me-2',
    redirectTo: '/profile',
  },
  {
    label: 'Lock Screen',
    icon: 'mgc_lock_line me-2',
    redirectTo: '/lock-screen',
  },
];

const ClientProfileDropDown = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const { width } = useViewPort();
  
  // Điều chỉnh placement dựa trên kích thước màn hình
  const placement = width < 640 ? 'bottom-start' : 'bottom-end';

  const PopoverToggler = () => {
    return (
      <button 
        className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Profile menu"
      >
        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </button>
    )
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login");
    }
  }

  return (
    <div className="relative">
      <PopoverLayout 
        placement={placement} 
        toggler={<PopoverToggler />} 
        togglerClass='' 
        menuClass='w-56 sm:w-64 z-50 mt-2 bg-white shadow-lg border rounded-lg p-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 max-w-[calc(100vw-2rem)]'
      >
        {user && (
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        )}
        {(profileMenus || []).map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <Link 
                className="flex items-center py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors" 
                to={item.redirectTo}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </Link>
            </React.Fragment>
          )
        })}
        <hr className="my-2 -mx-2 border-gray-200 dark:border-gray-700" />
        <button 
          className="w-full flex items-center py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors" 
          onClick={handleLogout}
        >
          <i className='mgc_exit_line me-2' />
          <span>Logout</span>
        </button>
      </PopoverLayout>
    </div>
  )
}

export default ClientProfileDropDown



