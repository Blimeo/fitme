import {
  Container,
  Fab,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
import { Gender, Item } from "./util/util-types";
import ItemCard from "./components/ItemCard";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import {
  ItemsSliceState,
  patchDiscover,
  patchRecommended,
  patchGenderFilter,
} from "./store/slices/itemsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { arraysSetEquality, useTitle } from "./util/util-functions";
import GenderFilterUI from "./components/Util/GenderFilterUI";

type OwnProps = {
  readonly loggedIn: boolean;
};
// Subscribed from Redux store.
type Props = OwnProps & {
  items: ItemsSliceState;
  dispatch: Dispatch;
};

const Items = ({ loggedIn, items, dispatch }: Props): ReactElement => {
  const [uploadHidden, setUploadHidden] = useState(true);
  const {
    discoverData,
    recommendedData,
    lastUpdated,
    currentGenderFilter,
  } = items;
  const [genderFilter, setGenderFilter] = useState<Gender[]>(() => [
    "MEN",
    "WOMEN",
    "UNISEX",
  ]);
  const [loading, setLoading] = useState(false);

  const handleGenderFilter = (
    _: React.MouseEvent<HTMLElement>,
    genders: Gender[]
  ) => {
    setGenderFilter(genders);
  };

  useTitle("fitme | Items");

  useEffect(() => {
    if (
      !arraysSetEquality(genderFilter, currentGenderFilter) ||
      Date.now() - lastUpdated > 180000 ||
      (discoverData.length === 1 && discoverData[0]._id === "LOADING") ||
      (recommendedData.length === 1 && recommendedData[0]._id === "LOADING")
    ) {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");
      const accessTokenString = `Bearer ${access_token}`;
      fetch(`/discover_items?filter=${genderFilter.toString()}`, {
        method: "GET",
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchDiscover(response.items as Item[]));
        });

      fetch(`/recommended_items?filter=${genderFilter.toString()}`, {
        method: "GET",
        headers: {
          Authorization: loggedIn ? accessTokenString : "",
        },
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchRecommended(response.items as Item[]));
          setLoading(false);
        });
      dispatch(patchGenderFilter(genderFilter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFilter]);

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
              <Tooltip
                title={uploadHidden ? "Upload a new item" : "Close editor"}
                aria-label="Upload a new item"
              >
                <Fab
                  onClick={() => {
                    setUploadHidden(!uploadHidden);
                  }}
                  className={styles.fab}
                  color="primary"
                  aria-label={uploadHidden ? "add" : "close"}
                >
                  {uploadHidden ? <AddIcon /> : <CloseIcon />}
                </Fab>
              </Tooltip>
              {!uploadHidden && (
                <ItemUpload setUploadHidden={setUploadHidden} />
              )}
            </div>
          )}
          <div className={styles.topExplanation}>
            <Typography>
              {!loggedIn &&
                "Log in to get personalized recommendations and upload your own items!"}
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
              <Typography variant="h3">
                <b>Recommended</b>
              </Typography>
            </div>

            <Grid container alignItems="stretch" spacing={1}>
              {loading ? (
                <CircularProgress />
              ) : (
                recommendedData.map((it) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      md={3}
                      key={it._id}
                      style={{ display: "flex" }}
                    >
                      <ItemCard item={it} />
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
              ) : (
                discoverData.map((it) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      md={3}
                      key={it._id}
                      style={{ display: "flex" }}
                    >
                      <ItemCard item={it} />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </div>
        </Container>
      </>
    );
  }
};

const Connected = connect(({ items }: RootState) => ({ items }))(Items);
export default Connected;
