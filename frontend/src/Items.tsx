import {
  Card,
  CardContent,
  Container,
  Fab,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import styles from "./css/Items.module.css";
import ItemUpload from "./components/ItemUpload";
type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Items({ loggedIn, setLoggedIn }: Props) {
  const [uploadHidden, setUploadHidden] = useState(true);
  return (
    <Container className={styles.container} maxWidth="md">
      <div className={styles.topExplanation}>
        <Typography>
          Browse articles of clothing. You can filter existing items and upload
          your own{loggedIn ? null : " if you are logged in"}!
        </Typography>
      </div>
      {loggedIn ? (
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
          {uploadHidden && <ItemUpload />}
        </div>
      ) : null}
      <Card>
        <CardContent>
          <Typography>Welcome to the items page!</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Items;
