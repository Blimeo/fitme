import {
  Container,
  Fab,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
} from "@material-ui/core";

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
  const [items, setItems] = useState<Item[]>([]);
  
  useEffect(() => {
    fetch("/discover", {
      method: "GET",
    })
      .then((r) => r.json())
      .then((response) => {
        setItems(response.items as Item[]);
      });
  }, []);
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
          {items.map((it) => {
            return (
              <Grid item xs={3} style={{ display: "flex" }}>
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
