import React from "react";

import AppRouter from "./routes/AppRouter";

import { configureFakeBackend } from "./helpers";

import "nouislider/distribute/nouislider.css";

import "./assets/scss/app.scss";
import "./assets/scss/icons.scss";

// configure fake backend
configureFakeBackend();

const App = () => {
  return (
    <React.Fragment>
      <AppRouter />
    </React.Fragment>
  );
};

export default App;
