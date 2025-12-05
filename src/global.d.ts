declare module 'feather-icons-react'
declare module 'google-maps-react';
declare module 'swiper';
declare module 'react-joyride';
declare module 'redux-persist/integration/react';

// Allow importing .jsx files with named exports
declare module '*.jsx' {
  const Component: any;
  export default Component;
  // Allow any named exports
  export const store: any;
  export const persistor: any;
}

// Redux DevTools Extension
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?: () => any;
}
