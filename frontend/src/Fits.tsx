import {
  Container,
  Fab,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
  CircularProgress,
  Button,
} from "@material-ui/core";

import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import styles from "./css/Fits.module.css";
import { Fit, FitResponse, Gender } from "./util/util-types";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import FitCard from "./components/FitCard";
import {
  FitsSliceState,
  patchDiscover,
  patchGenderFilter,
  patchRecommended,
  patchPage,
} from "./store/slices/fitsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { arraysSetEquality, useTitle } from "./util/util-functions";
import { Link } from "react-router-dom";
import GenderFilterUI from "./components/Util/GenderFilterUI";

type OwnProps = {
  readonly loggedIn: boolean;
};
// Subscribed from Redux store.
type Props = OwnProps & {
  fits: FitsSliceState;
  dispatch: Dispatch;
};

const Fits = ({ loggedIn, fits, dispatch }: Props): ReactElement => {
  const {
    discoverData,
    recommendedData,
    lastUpdated,
    currentGenderFilter,
    currentPage,
  } = fits;

  useTitle("fitme | Fits");

  const [genderFilter, setGenderFilter] = useState<Gender[]>(() => [
    "Men",
    "Women",
    "Unisex",
  ]);
  const [numFitsTotalInQuery, setNumFitsTotalInQuery] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const handleGenderFilter = (
    _: React.MouseEvent<HTMLElement>,
    genders: Gender[]
  ) => {
    setGenderFilter(genders);
  };

  useEffect(() => {
    if (
      !arraysSetEquality(genderFilter, currentGenderFilter) ||
      Date.now() - lastUpdated > 180000 ||
      page !== currentPage ||
      (discoverData.length === 1 && discoverData[0]._id === "LOADING") ||
      (recommendedData.length === 1 && recommendedData[0]._id === "LOADING")
    ) {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      const accessTokenString = `Bearer ${access_token}`;
      fetch(
        `/discover_fits?gender=${genderFilter.toString()}&page=${page.toString()}`,
        {
          method: "GET",
        }
      )
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchDiscover(response.fits as Fit[]));
        });

      fetch(`/recommended_fits?gender=${genderFilter.toString()}`, {
        method: "GET",
        headers: {
          Authorization: loggedIn ? accessTokenString : "",
        },
      })
        .then((r) => r.json())
        .then((response) => {
          const fitsResponse = response.fits as FitResponse[];
          if (fitsResponse.length > 0) {
            setNumFitsTotalInQuery(fitsResponse[0].num_docs);
          }
          dispatch(patchRecommended(response.fits as Fit[]));
          setLoading(false);
        });
      dispatch(patchGenderFilter(genderFilter));
      dispatch(patchPage(page));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFilter, page]);
  if (
    discoverData.length === 1 &&
    recommendedData.length === 1 &&
    (discoverData[0]._id === "LOADING" || recommendedData[0]._id === "LOADING")
  ) {
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
          {loading ? (
            <CircularProgress />
          ) : (
            <GenderFilterUI
              genderFilter={genderFilter}
              handleGenderFilter={handleGenderFilter}
            />
          )}
          <div className={styles.recommended}>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              {recommendedData.length >= 3 && (
                <Typography variant="h3">
                  <b>Recommended</b>
                </Typography>
              )}
            </div>

            <Grid container alignItems="stretch" spacing={1}>
              {loading ? (
                <CircularProgress />
              ) : (
                recommendedData.length >= 3 &&
                recommendedData.map((fit) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      md={3}
                      key={fit._id}
                      style={{ display: "flex" }}
                    >
                      <FitCard fit={fit} />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </div>
          <div className={styles.discover}>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Typography variant="h3">
                <b>Discover</b>
              </Typography>
            </div>
            <Grid container alignItems="stretch" spacing={1}>
              {loading ? (
                <CircularProgress />
              ) : discoverData.length === 0 ? (
                <Typography>
                  We couldn't find any fits under that criteria.
                </Typography>
              ) : (
                discoverData.map((fit) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      md={3}
                      key={fit._id}
                      style={{ display: "flex" }}
                    >
                      <FitCard fit={fit} />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </div>
          <div className={styles.pageNav}>
            {page > 1 && (
              <Button
                variant="contained"
                onClick={() => setPage(page - 1)}
                className={styles.pageNavButton}
              >
                {page - 1}
              </Button>
            )}

            {discoverData.length >= 12 && numFitsTotalInQuery > 12 && (
              <>
                <Button
                  variant="contained"
                  className={styles.pageNavButton}
                  disabled
                >
                  {page}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setPage(page + 1)}
                  className={styles.pageNavButton}
                >
                  {page + 1}
                </Button>
              </>
            )}
          </div>
        </Container>
      </>
    );
  }
};

const Connected = connect(({ fits }: RootState) => ({ fits }))(Fits);
export default Connected;
