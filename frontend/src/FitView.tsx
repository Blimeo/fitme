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
import { useTitle } from "./util/util-functions";
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
    gender: "UNISEX",
  });

  useTitle(() =>
    loading ? "fitme | Loading Fit" : `fitme | ${fit.name} by ${fit.uploader}`
  );

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

  if (loading) {
    return <LinearProgress />;
  }
  return (
    <Container className={styles.container} maxWidth="md">
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
                <Button variant="contained" color="secondary">
                  Favorite
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Container>
  );
}
