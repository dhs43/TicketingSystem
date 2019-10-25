import React from 'react';
import './App.css';

import { Link, Route, HashRouter } from "react-router-dom";

import Login from "./Components/Login/Login.js";
import Home from "./Components/Home/Home.js";
import SubmitTicket from "./Components/SubmitTicket/SubmitTicket";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Home}></Route>
          <Route exact path={"/Login"} component={Login}></Route>
          <Route exact path={"/SubmitTicket"} component={SubmitTicket}></Route>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
