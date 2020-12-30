import {
  Button,
  Card,
  CardContent,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
import OnlineShoppingSvg from "../../assets/svg/online_shopping.svg";
import TShirtSvg from "../../assets/svg/fashion-tshirts-colour.svg";

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      textDecoration: "none",
    },
    cta: {
      background: "#e91e63",
      textDecoration: "none",
      color: "#fff",
      borderRadius: "100px",
      padding: "0px 25px",
      fontWeight: 600,
      fontSize: "2em",
      marginTop: "0.5em",
      "&:hover": {
        background: "#ff3b7d",
        boxShadow: "0px 2px 10px #888888",
      },
    },
  })
);

function Landing() {
  const classes = useStyles();
  return (
    <>
      <div className={styles.HeroContainerBackground}>
        <Container maxWidth="lg" className={styles.HeroContainer}>
          <div className={styles.HeroHeading}>
            <Typography variant="h2" className={styles.HeroHeadingText}>
              The data-driven platform for fashion.
            </Typography>
            <Link to="/fits" className={classes.link}>
              <Button className={classes.cta}>BROWSE</Button>
            </Link>
          </div>
        </Container>
        <img
          src={OnlineShoppingSvg}
          alt="Online shopping illustration"
          className={styles.HeroIllustration}
        />
      </div>
      <div className={styles.HeroContainerBackground}>
        <Container maxWidth="lg" className={styles.HeroContainer}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <img
                src={TShirtSvg}
                alt="T shirt wearing illustration"
                className={styles.ExplainerIllustration}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4">Placeholder1</Typography>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4">Placeholder2</Typography>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}

export default Landing;
