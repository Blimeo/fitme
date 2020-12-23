import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Grid,
  Button,
  Avatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import LoginDialogue from "./LoginDialogue";
import RegisterDialogue from "./RegisterDialogue";
import LogoutButton from "./LogoutButton";
import Logo from "../../assets/img/fitme-logo.png";
import styles from "./index.module.css";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    container: {
      width: 1170,
      margin: "auto",
    },
    buttonFontSize: {
      fontSize: "12px",
      color: "#a1a1a1",
      textDecoration: "none",
    },
    AppBar: {
      backgroundColor: "#fff",
      backgroundSize: "cover",
    },
    mainLogo: {
      color: "#a1a1a1",
      justifyContent: "left",
      "&:hover": {
        background: "transparent",
      },
    },
    avatar: {
      height: "100%",
      width: "100px",
      borderRadius: 0,
    },
    loginButton: {
      background: "#e91e63",
      color: "#fff",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "#ff3b7d",
        boxShadow: "0px 2px 10px #888888",
      },
    },
    logoutButton: {
      background: "#fff",
      color: "#000",
      fontSize: "11px",
      border: "3px solid black",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "grey",
      },
    },
  })
);

type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Nav({ loggedIn, setLoggedIn }: Props) {
  const [inMobileView, setInMobileView] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setInMobileView(true)
        : setInMobileView(false);
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const displayDesktop = () => {
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.AppBar}>
          <Grid item sm={12} xs={12} className={classes.container}>
            <Toolbar>
              <Grid className={classes.grow}>
                <Button className={classes.mainLogo} href="/">
                  <Avatar src={Logo} className={classes.avatar} />
                </Button>
              </Grid>
              <Link to="/about" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  About
                </Button>
              </Link>
              <Link to="/items" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  Items
                </Button>
              </Link>
              <Link to="/fits" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  Fits
                </Button>
              </Link>
              {loggedIn ? (
                <>
                  <Link to="/profile" className={styles.link}>
                    <Button color="inherit" className={classes.buttonFontSize}>
                      Profile
                    </Button>
                  </Link>
                  <LogoutButton
                    logged={setLoggedIn}
                    className={classes.logoutButton}
                  />
                </>
              ) : (
                <>
                  <LoginDialogue
                    logged={setLoggedIn}
                    buttonClassName={classes.loginButton}
                  />
                  <RegisterDialogue buttonClassName={classes.loginButton} />
                </>
              )}
            </Toolbar>
          </Grid>
        </AppBar>
      </div>
    );
  };

  // TODO
  const displayMobile = () => {
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.AppBar}>
          <Grid item sm={12} xs={12} className={classes.container}>
            <Toolbar>
              <Grid className={classes.grow}>
                <Button className={classes.mainLogo} href="/">
                  <Avatar src={Logo} className={classes.avatar} />
                </Button>
              </Grid>
              <Link to="/about" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  About
                </Button>
              </Link>
              <Link to="/items" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  Items
                </Button>
              </Link>
              <Link to="/fits" className={styles.link}>
                <Button color="inherit" className={classes.buttonFontSize}>
                  Fits
                </Button>
              </Link>
              {loggedIn ? (
                <>
                  <Link to="/profile" className={styles.link}>
                    <Button color="inherit" className={classes.buttonFontSize}>
                      Profile
                    </Button>
                  </Link>
                  <LogoutButton
                    logged={setLoggedIn}
                    className={classes.logoutButton}
                  />
                </>
              ) : (
                <>
                  <LoginDialogue
                    logged={setLoggedIn}
                    buttonClassName={classes.loginButton}
                  />
                  <RegisterDialogue buttonClassName={classes.loginButton} />
                </>
              )}
            </Toolbar>
          </Grid>
        </AppBar>
      </div>
    );
  };

  return inMobileView ? displayMobile() : displayDesktop();
}

export default Nav;
