import React, { useEffect, useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import LoginDialogue from "./LoginDialogue";
import RegisterDialogue from "./RegisterDialogue";
import LogoutButton from "./LogoutButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    expand: {
      flexGrow: 1,
    },
  })
);

function Nav() {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setLoggedIn(access_token !== null);
  }, []);
  const renderProfileButton = () => {
    if (loggedIn) {
      return (
        <Link className={styles.link} to="/profile">
          <Tab label="Profile" />
        </Link>
      );
    }
    return null;
  };
  const renderTopRight = () => {
    if (!loggedIn) {
      return (
        <div>
          <RegisterDialogue />
          <LoginDialogue logged={setLoggedIn} />
        </div>
      );
    } else {
      return <LogoutButton logged={setLoggedIn} />;
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Fitme</Typography>
          <Tabs className={classes.expand}>
            <Link className={styles.link} to="/">
              <Tab label="Home" />
            </Link>
            <Link className={styles.link} to="/about">
              <Tab label="About" />
            </Link>
            <Link className={styles.link} to="/items">
              <Tab label="Items" />
            </Link>
            <Link className={styles.link} to="/fits">
              <Tab label="Fits" />
            </Link>
            {renderProfileButton()}
          </Tabs>
          {renderTopRight()}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Nav;
