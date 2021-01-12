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
import { Link, useHistory, useParams } from "react-router-dom";
import { Fit } from "./util/util-types";
import styles from "./css/FitView.module.css";
import Annotation from "react-image-annotation";
import AvatarUsername from "./components/Util/AvatarUsername";
type Props = {
  readonly loggedIn: boolean;
};

export default function ItemView({ loggedIn }: Props) {
  const { fit_id } = useParams<Record<string, string | undefined>>();
  const [activeAnnotations, setActiveAnnotations] = useState<any>([]);
  const [dummyAnno, setDummyAnno] = useState<any>({});
  const history = useHistory();
  const [fit, setFit] = useState<Fit>({
    _id: "",
    name: "",
    tags: [],
    description: "",
    img_url: "",
    items: [],
    uploader: "",
    annotations: [],
    favorited: [],
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/get_fit/" + fit_id, {
      method: "GET",
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.error === "true") {
          history.push("/items");
        } else {
          setFit(response.fit as Fit);
          setLoading(false);
        }
      });
  }, [fit_id, history]);

  const [favorited, setFavorited] = useState(false);
  useEffect(() => {
    if (loggedIn) {
      const access_token = localStorage.getItem("access_token");
      if (access_token !== null) {
        fetch("/fit_favorite_status/" + fit_id, {
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
  }, [loggedIn]);

  const handleFavorite = () => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch("/favorite_fit/" + fit_id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setFavorited(true);
    }
  };

  const handleUnfavorite = () => {
    const access_token = localStorage.getItem("access_token");
    if (access_token !== null) {
      fetch("/unfavorite_fit/" + fit_id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setFavorited(false);
    }
  };
  return (
    <Container className={styles.container} maxWidth="md">
      {loading && <LinearProgress />}
      {!loading && (
        <Grid container spacing={1}>
          <Grid item style={{ textAlign: "center" }} xs={12}>
            <Typography variant="h4">{fit.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Annotation
              src={fit.img_url}
              annotations={fit.annotations}
              value={dummyAnno}
              activeAnnotations={activeAnnotations}
              disableSelector
              disableEditor
              disableOverlay
              allowTouch
            />
          </Grid>
          <Grid item xs={6}>
            <Card className={styles.itemDesc} variant="outlined">
              <CardContent>
                <Typography>
                  <b>Uploaded by:</b>
                </Typography>
                <AvatarUsername username={fit.uploader} />
                <Typography>
                  <b>Fit Description</b>
                </Typography>
                <Typography>{fit.description}</Typography>
              </CardContent>
            </Card>
            <Card className={styles.itemDesc} variant="outlined">
              <CardContent>
                <Typography>
                  <b>Tags</b>
                </Typography>
                <Typography>
                  {fit.tags.map((tag) => (
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
            <Grid container direction="column" spacing={1}>
              {fit.annotations.map((anno: any, index: number) => {
                return (
                  <Grid item xs={12}>
                    <Link
                      to={"/item/" + fit.items[index]._id}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        style={{ padding: "6px" }}
                        onMouseOver={() => setActiveAnnotations([anno])}
                        onMouseOut={() => setActiveAnnotations([])}
                        key={index}
                      >
                        <div style={{ color: "gray" }}>
                          <Typography>Item</Typography>
                        </div>
                        <Typography>
                          <b>{anno.data.text}</b>
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            {loggedIn && (
              <Card className={styles.itemActionPane} variant="outlined">
                <CardContent>
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
          <Grid item xs={6}></Grid>
        </Grid>
      )}
    </Container>
  );
}
