import React, { useEffect } from "react";

import AppRouter from "./routes/AppRouter";
import { authService } from "./config";

import { configureFakeBackend } from "./helpers";

import "nouislider/distribute/nouislider.css";

import "./assets/scss/app.scss";
import "./assets/scss/icons.scss";

// configure fake backend
configureFakeBackend();

const App = () => {
  useEffect(() => {
    const handleSessionReplaced = () => {
      window.location.href = "/landing-login?reason=session-replaced";
    };

    window.addEventListener("auth:session-replaced", handleSessionReplaced);
    authService.startSessionWatcher();

    return () => {
      window.removeEventListener("auth:session-replaced", handleSessionReplaced);
    };
  }, []);

  return (
    <React.Fragment>
      <AppRouter />
    </React.Fragment>
  );
};

export default App;
