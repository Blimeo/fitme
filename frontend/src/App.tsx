import React, { useState, useEffect } from "react";
import "./css/index.css";
import Home from "./Home";
import Profile from "./Profile";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setLoggedIn(access_token !== null);
    console.log("Logged in: " + loggedIn);
  }, [loggedIn]);
  return (
    <div>
      <BrowserRouter>
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <main>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/about" component={Home} />
            <Route path="/items" component={Home} />
            <Route path="/fits" component={Home} />
            <Route path="/profile">
              {loggedIn ? <Profile /> : <Redirect to="/" />}
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}
