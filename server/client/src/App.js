import React from 'react';
import './App.css';

import { Link, Route, HashRouter } from "react-router-dom";

import Login from "./Components/Login/Login.js";
import Home from "./Components/Home/Home.js";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Home}></Route>
          <Route exact path={"/Login"} component={Login}></Route>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
