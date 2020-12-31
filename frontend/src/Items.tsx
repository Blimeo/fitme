import { Container, Fab, Tooltip, Typography, Grid } from "@material-ui/core";

import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
import { Item } from "./util/util-types";
import ItemCard from "./components/ItemCard";
type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Items({ loggedIn, setLoggedIn }: Props) {
  const [uploadHidden, setUploadHidden] = useState(true);
  const [discoverItems, setDiscoverItems] = useState<Item[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([]);
  const access_token = localStorage.getItem("access_token");
  const accessTokenString = `Bearer ${access_token}`;
  useEffect(() => {
    fetch("/discover_items", {
      method: "GET",
    })
      .then((r) => r.json())
      .then((response) => {
        setDiscoverItems(response.items as Item[]);
      });

    fetch("/recommended_items", {
      method: "GET",
      headers: {
        Authorization: loggedIn ? accessTokenString : "",
      },
    })
      .then((r) => r.json())
      .then((response) => {
        setRecommendedItems(response.items as Item[]);
      });
  }, [accessTokenString, loggedIn]);
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
          {recommendedItems.map((it) => {
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
          {discoverItems.map((it) => {
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
}

export default Items;
