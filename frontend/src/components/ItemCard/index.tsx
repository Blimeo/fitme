import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../../util/util-types";

type Props = {
  readonly item: Item;
};
export default function ItemCard({ item }: Props) {
  return (
    <Link to={"/item/"+item._id} style={{ textDecoration: 'none' }}>
    <Card style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={item.name}
          height="300"
          image={item.imgs[0]}
          title={item.name}
        />
        <CardContent>
          <Typography variant="body2">
            {item.name} <b>${item.price}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </Link>
  );
}
