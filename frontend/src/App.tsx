import React, { useState, useEffect } from "react";
import "./css/index.css";
import Home from "./Home";
import Profile from "./Profile";
import Items from "./Items";
import ItemView from "./ItemView";
import FitUpload from "./FitUpload";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import NotFound from "./components/Error/NotFound";
import Footer from "./components/Footer";

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
                <Items loggedIn={loggedIn} />
              </Route>
              <Route path="/fits" component={Home} />
              <Route path="/profile">
                {loggedIn ? <Profile loggedIn /> : <Redirect to="/" />}
              </Route>
              <Route path="/fit-upload">
                <FitUpload />
                {/* {loggedIn ? <FitUpload /> : <Redirect to="/fits" />} */}
              </Route>
              <Route path="/user/:username">
                <Profile loggedIn={loggedIn} />
              </Route>
              <Route path="/item/:item_id">
                <ItemView loggedIn={loggedIn} />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
