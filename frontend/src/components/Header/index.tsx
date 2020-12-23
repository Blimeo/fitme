import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import LoginDialogue from "./LoginDialogue";
import RegisterDialogue from "./RegisterDialogue";
import LogoutButton from "./LogoutButton";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    expand: {
      flexGrow: 1,
    },
  })
);

type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Nav({ loggedIn, setLoggedIn }: Props) {
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
            {loggedIn && (
              <Link className={styles.link} to="/profile">
                <Tab label="Profile" />
              </Link>
            )}
          </Tabs>
          {loggedIn ? (
            <LogoutButton logged={setLoggedIn} />
          ) : (
            <div>
              <RegisterDialogue />
              <LoginDialogue logged={setLoggedIn} />
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Nav;
