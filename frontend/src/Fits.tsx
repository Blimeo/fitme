import {
  Container,
  Fab,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
} from "@material-ui/core";

import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import styles from "./css/Fits.module.css";
import { Fit } from "./util/util-types";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import FitCard from "./components/FitCard";
import {
  FitsSliceState,
  patchDiscover,
  patchRecommended,
} from "./store/slices/fitsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useTitle } from "./util/util-functions";
import { Link } from "react-router-dom";

type OwnProps = {
  readonly loggedIn: boolean;
};
// Subscribed from Redux store.
type Props = OwnProps & {
  fits: FitsSliceState;
  dispatch: Dispatch;
};

const Fits = ({ loggedIn, fits, dispatch }: Props): ReactElement => {
  const { discoverData, recommendedData, lastUpdated } = fits;

  useTitle("fitme | Fits");

  useEffect(() => {
    if (
      discoverData.length === 0 ||
      Date.now() - lastUpdated.getTime() > 100000
    ) {
      const access_token = localStorage.getItem("access_token");
      const accessTokenString = `Bearer ${access_token}`;
      fetch("/discover_fits", {
        method: "GET",
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchDiscover(response.fits as Fit[]));
        });

      fetch("/recommended_fits", {
        method: "GET",
        headers: {
          Authorization: loggedIn ? accessTokenString : "",
        },
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchRecommended(response.fits as Fit[]));
        });
    }
  });
  if (discoverData.length === 0 || recommendedData.length === 0) {
    return <LinearProgress />;
  } else {
    return (
      <>
        <Container className={styles.container} maxWidth="md">
          {loggedIn && (
            <div className={styles.topBox}>
              <Tooltip title="Upload a new fit" aria-label="Upload a new fit">
                <Link to="/fit-upload/">
                  <Fab className={styles.fab} color="primary" aria-label="add">
                    <AddIcon />
                  </Fab>
                </Link>
              </Tooltip>
            </div>
          )}
          <div className={styles.topExplanation}>
            <Typography>
              {!loggedIn &&
                "Log in to get personalized recommendations and upload your own fits!"}
            </Typography>
          </div>
          <div className={styles.recommended}>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Typography variant="h3">
                <b>Recommended</b>
              </Typography>
            </div>

            <Grid container alignItems="stretch" spacing={1}>
              {recommendedData.map((fit) => {
                return (
                  <Grid item xs={3} key={fit._id} style={{ display: "flex" }}>
                    <FitCard fit={fit} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
          <div className={styles.discover}>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Typography variant="h3">
                <b>Discover</b>
              </Typography>
            </div>
            <Grid container alignItems="stretch" spacing={1}>
              {discoverData.map((fit) => {
                return (
                  <Grid item xs={3} key={fit._id} style={{ display: "flex" }}>
                    <FitCard fit={fit} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Container>
      </>
    );
  }
};

const Connected = connect(({ fits }: RootState) => ({ fits }))(Fits);
export default Connected;
