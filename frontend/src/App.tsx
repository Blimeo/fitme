import React, { useState, useEffect } from "react";
import "./css/index.css";
import Home from "./Home";
import Profile from "./Profile";
import Items from "./Items";
import Fits from "./Fits";
import ItemView from "./ItemView";
import FitView from "./FitView";
import FitUpload from "./FitUpload";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import NotFound from "./components/Error/NotFound";
import Footer from "./components/Footer";
import { useHistory } from "react-router-dom";
import { apiURL } from "./util/data";

export default function App() {
  const history = useHistory();
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
      fetch(`${apiURL}/verify_access_token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => setLoggedIn(response.ok))
        .catch(() => history.push("/"));
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, history]);
  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <main>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/items">
                <Items loggedIn={loggedIn} />
              </Route>
              <Route path="/fits">
                <Fits loggedIn={loggedIn} />
              </Route>
              <Route path="/profile">
                {loggedIn ? (
                  <Profile ownProfile loggedIn key={"own_profile_route"} />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/fit-upload">
                <FitUpload />
                {/* {loggedIn ? <FitUpload /> : <Redirect to="/fits" />} */}
              </Route>
              <Route path="/user/:username">
                <Profile
                  ownProfile={false}
                  loggedIn={loggedIn}
                  key={"user_route"}
                />
              </Route>
              <Route path="/item/:item_id">
                <ItemView loggedIn={loggedIn} />
              </Route>
              <Route path="/fit/:fit_id">
                <FitView loggedIn={loggedIn} />
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
