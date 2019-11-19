import React from 'react';
import './App.css';
import { Route, HashRouter } from "react-router-dom";

import Login from "./Components/Login/Login.js";
import Main from "./Components/Main/Main.js";
import SubmitTicket from "./Components/SubmitTicket/SubmitTicket";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Login}/>
          <Route exact path={"/Main"} component={Main}/>
          <Route exact path={"/SubmitTicket"} component={SubmitTicket}/>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
