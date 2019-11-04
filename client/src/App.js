import React from 'react';
import './App.css';
import { Route, HashRouter } from "react-router-dom";

import Home from "./Components/Home/Home.js";
import Main from "./Components/Main/Main.js";
import SubmitTicket from "./Components/SubmitTicket/SubmitTicket";
import TicketPage from "./Components/TicketPage/TicketPage";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Home}></Route>
          <Route exact path={"/Main"} component={Main}></Route>
          <Route exact path={"/SubmitTicket"} component={SubmitTicket}></Route>
          <Route exact path={"/TicketPage"} component={TicketPage}></Route>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
