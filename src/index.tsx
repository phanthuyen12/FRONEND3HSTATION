import React from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from './App'
import "./assets/scss/app.scss";
import { store } from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary";

console.log('🚀 Starting application...');
console.log('Root element:', document.getElementById('konrix'));
console.log('Store:', store);

const container = document.getElementById('konrix');
if (!container) {
  console.error('❌ Root element with id "konrix" not found!');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Lỗi: Không tìm thấy root element</h1><p>Vui lòng kiểm tra file index.html có element với id="konrix"</p></div>';
} else {
  console.log('✅ Root element found, rendering app...');
  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <Provider store={store}>
          <React.Fragment>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <App />
            </BrowserRouter>
          </React.Fragment>
        </Provider>
      </ErrorBoundary>
    );
    console.log('✅ App rendered successfully');
    const splashScreen = document.querySelector(".splash-screen");
    if (splashScreen) {
      splashScreen.classList.add("splash-screen--hidden");
      window.setTimeout(() => {
        if (splashScreen.parentElement) {
          splashScreen.parentElement.removeChild(splashScreen);
        }
      }, 700);
    }
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    container.innerHTML = `<div style="padding: 20px; text-align: center;">
      <h1>Lỗi khi render ứng dụng</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>`;
  }
}
