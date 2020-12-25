import { Container, Fab, Tooltip, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";

import React from "react";
import AddIcon from "@material-ui/icons/Add";
import "./css/Items.css";
import ItemUpload from "./components/ItemUpload";
type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Items({ loggedIn, setLoggedIn }: Props) {
  return (
    <Container className="container" maxWidth="md">
      <div className="top-explanation">
        <Typography>
          Browse articles of clothing. You can filter existing items and upload
          your own{loggedIn ? null : " if you are logged in"}!
        </Typography>
      </div>
      {loggedIn ? (
        <div className="top-box">
          <Tooltip title="Upload a new item" aria-label="Upload a new item">
            <Fab className="fab" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
          <ItemUpload />
        </div>
      ) : null}

      <Typography>Welcome to the items page!</Typography>
    </Container>
  );
}

export default Items;
