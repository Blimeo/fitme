import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Button,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import styles from "./css/Header.module.css";
import LoginDialogue from './LoginDialogue'

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
          </Tabs>
          <LoginDialogue />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Nav;
