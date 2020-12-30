import { Container, Typography } from "@material-ui/core";
import React from "react";
import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container maxWidth="md" className={styles.Container}>
      <div className={styles.TextContainer}>
        <Typography variant="h1">404.</Typography>
        <Typography variant="h5">
          We couldn't find what you're looking for 😭.{" "}
          <Link to="/">Click here</Link> to go back to the homepage.
        </Typography>
      </div>
    </Container>
  );
}
