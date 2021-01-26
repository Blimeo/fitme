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
                  <Typography variant="h5">
                    Share Outfits With Less Hassle
                  </Typography>
                  <Typography className={styles.LandingCardDescriptionText}>
                    We put each outfit ("fit") image into our machine learning
                    model to automatically section off each part of your outfit
                    so you can easily label them and show off your style!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Save and Showcase</Typography>
                  <Typography className={styles.LandingCardDescriptionText}>
                    Our social network allows for you to showcase your favorite
                    fashion items and fits while saving your favorites posted by
                    others. Customize your profile to show off your social media
                    accounts, or even change your profile picture!
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
