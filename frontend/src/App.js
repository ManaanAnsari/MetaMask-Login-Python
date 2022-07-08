import React from "react";
import "./styles.css";

import "bootstrap/dist/css/bootstrap.css";

import {AccountInfoContextProvider} from "./components/ctx/account-context"
import Home from "./components/home";

export default function App() {
  

  return (
    <AccountInfoContextProvider>
      <div className="App">
        <Home />
      </div>
    </AccountInfoContextProvider>
  );
}
