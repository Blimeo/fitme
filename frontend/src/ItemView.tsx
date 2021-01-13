import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Item, Fit } from "./util/util-types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import styles from "./css/ItemView.module.css";
import AvatarUsername from "./components/Util/AvatarUsername";
import FitCard from "./components/FitCard";

type Props = {
  readonly loggedIn: boolean;
};
export default function ItemView({ loggedIn }: Props) {
  const { item_id } = useParams<Record<string, string | undefined>>();
  const history = useHistory();
  const [item, setItem] = useState<Item>({
    _id: "",
    name: "",
    brand: "",
    price: 0,
    tags: [],
    description: "",
    imgs: [],
    uploader: "",
    favorited: 0,
    inFits: [],
  });
  const [galleryImgs, setGalleryImgs] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [includedFits, setIncludedFits] = useState<Fit[]>([]);
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
          history.push("/items");
        } else {
          setItem(response.item as Item);
          let d: { original: string }[] = [];
          response.item.imgs.forEach((url: string) => {
            d.push({ original: url });
          });
          setGalleryImgs(d);
          setLoading(false);
        }
      });
  }, [item_id, history]);

  useEffect(() => {
    if (loggedIn) {
      const access_token = localStorage.getItem("access_token");
      if (access_token !== null) {
        fetch("/item_favorite_status/" + item_id, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then((r) => r.json())
          .then((response) => {
            setFavorited(response.found);
          });
      }
    }
  }, [loggedIn, item_id]);

  useEffect(() => {
    if (item.inFits.length > 0) {
      fetch("/get_fits", {
        method: "POST",
        body: JSON.stringify(
          item.inFits.slice(0, Math.min(4, item.inFits.length))
        ),
      })
        .then((r) => r.json())
        .then((response) => {
          console.log(response.fits);
          setIncludedFits(response.fits);
        });
    }
  }, [item.inFits]);

  const handleFavorite = () => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch("/favorite_item/" + item_id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setItem({ ...item, favorited: item.favorited + 1 });
      setFavorited(true);
    }
  };

  const handleUnfavorite = () => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch("/unfavorite_item/" + item_id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setItem({ ...item, favorited: item.favorited - 1 });
      setFavorited(false);
    }
  };
  if (loading) {
    return <LinearProgress />;
  } else {
  }
  return (
    <Container className={styles.container} maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs>
          <ImageGallery showThumbnails={false} items={galleryImgs} />
          {loggedIn && (
            <Card className={styles.itemActionPane} variant="outlined">
              <CardContent>
                <Typography>❤️ {item.favorited}</Typography>
                {favorited ? (
                  <Button variant="contained" onClick={handleUnfavorite}>
                    Unfavorite
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleFavorite}
                  >
                    Favorite
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography>Brand: {item.brand}</Typography>
                  <Typography variant="h5">
                    <b>{item.name}</b>
                  </Typography>
                  <Typography variant="h3">${item.price}</Typography>
                  <Typography>Uploaded by:</Typography>
                  <AvatarUsername username={item.uploader} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <b>Item Description</b>
                  </Typography>
                  <Typography>{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <b>Tags</b>
                  </Typography>
                  <Typography>
                    {item.tags.map((tag) => (
                      <Button
                        className={styles.tagButton}
                        style={{
                          margin: "5px",
                          backgroundColor: "#545454",
                          color: "white",
                        }}
                        variant="contained"
                      >
                        {tag}
                      </Button>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={styles.includedFits} variant="outlined">
                <CardContent>
                  <Typography>
                    <b>Fits featuring this item</b>
                  </Typography>
                  <Grid container spacing={1}>
                    {includedFits.map((fit) => {
                      return (
                        <Grid item xs={6}>
                          <FitCard fit={fit} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography>
                    <b>Links</b>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
