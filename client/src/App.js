import React from 'react';
import './App.css';

import { Link, Route, HashRouter} from "react-router-dom";

import Login from "./Login.jsx";
import Home from "./Home.jsx";

function App() {
  return (
    <div className="App">
     <HashRouter>
         <div>
             <Link to={"/Login"}>Login </Link>

             <Route exact path={"/"} component={Home}></Route>
             <Route exact path={"/Login"} component={Login}></Route>
         </div>
     </HashRouter>
    </div>
  );
}

export default App;
