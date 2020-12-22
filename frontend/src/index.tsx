import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import Home from "./Home";
import Profile from "./Profile";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Switch } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <main>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={Home} />
          <Route path="/items" component={Home} />
          <Route path="/fits" component={Home} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </main>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
