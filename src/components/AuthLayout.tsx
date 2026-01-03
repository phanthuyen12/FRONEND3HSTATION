import { Link } from "react-router-dom";

interface AccountLayoutProps {
  pageImage?: any;
  authTitle?: string;
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
  hasForm?: boolean;
  hasThirdPartyLogin?: boolean;
  userImage?: string;
}

const AuthLayout = ({
  pageImage,
  authTitle,
  helpText,
  bottomLinks,
  isCombineForm,
  children,
  hasForm,
  hasThirdPartyLogin,
  userImage,
}: AccountLayoutProps) => {
  return (
    <>
      <div className="bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-700 dark:via-gray-900 dark:to-black">
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full">
            <div className="card overflow-hidden sm:rounded-md rounded-none">
              <div className="p-6">
                {/* Logo 3HSTATION */}
                <div className="mb-8">
                  <Link to="/" className="flex items-center gap-3 justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">3H</span>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-black text-slate-900 dark:text-white">3HSTATION</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Automation Platform</div>
                    </div>
                  </Link>
                </div>

                {/* Title & Help Text */}
                {(authTitle || helpText) && (
                  <div className="mb-6">
                    {authTitle && (
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{authTitle}</h4>
                    )}
                    {helpText && (
                      <p className="text-slate-600 dark:text-slate-400">{helpText}</p>
                    )}
                  </div>
                )}

                {/* Form Content */}
                {children}

                {/* Bottom Links */}
                {bottomLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
