import { Container, Typography } from "@material-ui/core";
import React from "react";
import styles from "./Landing.module.css";
import OnlineShoppingSvg from "../../assets/svg/online_shopping.svg";

function Landing() {
  return (
    <div className={styles.HeroContainerBackground}>
      <Container maxWidth="lg" className={styles.HeroContainer}>
        <Typography variant="h2" className={styles.HeroHeading}>
          The data-driven platform for fashion.
        </Typography>
      </Container>
      <img
        src={OnlineShoppingSvg}
        alt="Online shopping illustration"
        className={styles.HeroIllustration}
      />
    </div>
  );
}

export default Landing;
