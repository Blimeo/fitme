import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Fit } from "../../util/util-types";

type Props = {
  readonly fit: Fit;
};
export default function FitCard({ fit }: Props) {
  return (
    <Link to={`/fit/${fit._id}`} style={{ textDecoration: "none" }}>
      <Card
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            alt={fit.name}
            height="300"
            image={fit.img_url}
            title={fit.name}
          />
          <CardContent>
            <Typography variant="body2" style={{ color: "gray" }}>
              Uploaded by {fit.uploader}
            </Typography>
            <Typography variant="body1">{fit.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
