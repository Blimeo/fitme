import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Item } from "./util/util-types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import styles from "./css/ItemView.module.css";

type Props = {
  readonly loggedIn: boolean;
};
export default function ItemView({ loggedIn }: Props) {
  const { item_id } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [item, setItem] = useState<Item>({
    name: "bruh",
    brand: "bruh",
    price: 69420,
    tags: ["ok"],
    description: "hyperbruh",
    imgs: ["ok"],
    uploader: "bruh",
  });
  const [galleryImgs, setGalleryImgs] = useState<any>([]);
  useEffect(() => {
    let opts = {
      item_id: item_id,
    };
    fetch("/get_item", {
      method: "POST",
      body: JSON.stringify(opts),
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.error === "true") {
          history.push("/");
        }
        setItem(response.item as Item);
        let d: { original: string }[] = [];
        response.item.imgs.map((url: string) => {
          d.push({ original: url });
        });
        setGalleryImgs(d);
      });
  }, [item_id]);

  return (
    <Container className={styles.container} maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs>
          <ImageGallery showThumbnails={false} items={galleryImgs} />
          {loggedIn && (
            <Card className={styles.itemActionPane} variant="outlined">
              <CardContent>
                <Button variant="contained" color="secondary">
                  Favorite
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs>
          <Card className={styles.itemInfo} variant="outlined">
            <CardContent>
              <Typography>Brand: {item.brand}</Typography>
              <Typography variant="h5">
                <b>{item.name}</b>
              </Typography>
              <Typography variant="h3">${item.price}</Typography>
              <Typography>
                Uploaded by:{" "}
                <div className="uploaderText" style={{ color: "gray" }}>
                  {item.uploader}
                </div>
              </Typography>
            </CardContent>
          </Card>
          <Card className={styles.itemDesc} variant="outlined">
            <CardContent>
              <Typography>
                <b>Item Description</b>
              </Typography>
              <Typography>{item.description}</Typography>
            </CardContent>
          </Card>
          <Card className={styles.itemDesc} variant="outlined">
            <CardContent>
              <Typography>
                <b>Tags</b>
              </Typography>
              <Typography>
                {item.tags.map((tag) => (
                  <Button className={styles.tag} variant="contained" color="primary">
                    {tag}
                  </Button>
                ))}
              </Typography>
            </CardContent>
          </Card>
          <Card className={styles.itemDesc} variant="outlined">
            <CardContent>
              <Typography>
                <b>Links</b>
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
