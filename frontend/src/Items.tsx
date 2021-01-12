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
import CloseIcon from "@material-ui/icons/Close";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
import { Item } from "./util/util-types";
import ItemCard from "./components/ItemCard";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import {
  ItemsSliceState,
  patchDiscover,
  patchRecommended,
} from "./store/slices/itemsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { useTitle } from "./util/util-functions";

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
  const { discoverData, recommendedData, lastUpdated } = items;

  useTitle("fitme | Items");

  useEffect(() => {
    if (
      discoverData.length === 0 ||
      Date.now() - lastUpdated.getTime() > 100000
    ) {
      const access_token = localStorage.getItem("access_token");
      const accessTokenString = `Bearer ${access_token}`;
      fetch("/discover_items", {
        method: "GET",
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchDiscover(response.items as Item[]));
        });

      fetch("/recommended_items", {
        method: "GET",
        headers: {
          Authorization: loggedIn ? accessTokenString : "",
        },
      })
        .then((r) => r.json())
        .then((response) => {
          dispatch(patchRecommended(response.items as Item[]));
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
          <div className={styles.recommended}>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              <Typography variant="h3">
                <b>Recommended</b>
              </Typography>
            </div>

            <Grid container alignItems="stretch" spacing={1}>
              {recommendedData.map((it) => {
                return (
                  <Grid item xs={3} key={it._id} style={{ display: "flex" }}>
                    <ItemCard item={it} />
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
              {discoverData.map((it) => {
                return (
                  <Grid item xs={3} key={it._id} style={{ display: "flex" }}>
                    <ItemCard item={it} />
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

const Connected = connect(({ items }: RootState) => ({ items }))(Items);
export default Connected;
