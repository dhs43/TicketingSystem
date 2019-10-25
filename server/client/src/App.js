import React from 'react';
import './App.css';

import { Link, Route, HashRouter } from "react-router-dom";

import Home from "./Components/Home/Home.js";
import Main from "./Components/Main/Main.js";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Main}></Route>
          <Route exact path={"/Main"} component={Home}></Route>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
