import { Container, Fab, Tooltip, Typography, Grid } from "@material-ui/core";

import React, { ReactElement, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
import { Item } from "./util/util-types";
import ItemCard from "./components/ItemCard";
import { connect } from "react-redux";
import { RootState } from "./store/rootReducer";
import { ItemsSliceState, setItems } from "./store/slices/itemsSlice";
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
  const { itemsData, lastUpdated } = items;

  useEffect(() => {
    console.log(itemsData);
    if (itemsData.length === 0 || Date.now() - lastUpdated.getTime() > 100000) {
      fetch("/discover", {
        method: "GET",
      })
        .then((r) => r.json())
        .then((response) => {
          const itemsResponse: Item[] = response.items as Item[];
          console.log(itemsResponse);
          dispatch(setItems(itemsResponse));
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
          Browse articles of clothing. You can filter existing items and upload
          your own{loggedIn ? null : " if you are logged in"}!
        </Typography>
      </div>
      <div className={styles.discover}>
        <Typography variant="h5">
          <b>Discover</b>
        </Typography>
        <Grid container alignItems="stretch" spacing={1}>
          {itemsData.map((it) => {
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
