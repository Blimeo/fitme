import React, { useState, useEffect } from "react";
import "./css/index.css";
import Home from "./Home";
import Profile from "./Profile";
import Items from "./Items";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

export default function App() {
  const theme = createMuiTheme({
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Work Sans"',
        '"Helvetica Neue"',
      ].join(","),
    },
  });
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch("/verify_access_token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((response) => setLoggedIn(response.ok));
    } else {
      setLoggedIn(false);
    }
    console.log("Logged in: " + loggedIn);
  }, [loggedIn]);
  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <main>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/about" component={Home} />
              <Route path="/items">
                <Items loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
              </Route>
              <Route path="/fits" component={Home} />
              <Route path="/profile">
                {loggedIn ? <Profile /> : <Redirect to="/" />}
              </Route>
            </Switch>
          </main>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
