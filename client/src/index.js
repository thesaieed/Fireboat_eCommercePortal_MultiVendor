import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./context/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <Provider>
    {/* wrapping the app and routes in provider component for accessiing the contextapi */}
    <BrowserRouter>
      {/* wrapping the app  in routes component for accessiing the routes */}
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
