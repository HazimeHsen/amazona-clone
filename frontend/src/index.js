import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import GetData from "./Components/Sections/MainScreen/GetData/GetData";
import { StoreProvider } from "./Components/Store/Store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GetData>
      <StoreProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StoreProvider>
    </GetData>
  </React.StrictMode>
);
