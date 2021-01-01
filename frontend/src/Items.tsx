import { Container, Fab, Tooltip, Typography, Grid } from "@material-ui/core";

import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
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
  return (
    <Container className={styles.container} maxWidth="md">
      {loggedIn && (
        <div className={styles.topBox}>
          <Tooltip title="Upload a new item" aria-label="Upload a new item">
            <Fab
              onClick={() => {
                setUploadHidden(!uploadHidden);
              }}
              className={styles.fab}
              color="primary"
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          {!uploadHidden && <ItemUpload setUploadHidden={setUploadHidden} />}
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
          <Typography variant="h5">
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
          <Typography variant="h5">
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
  );
};

const Connected = connect(({ items }: RootState) => ({ items }))(Items);
export default Connected;
