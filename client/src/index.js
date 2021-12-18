import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { UserContextProvider } from "./context/userContext";
import { CartContextProvider } from "./context/cartContext";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
