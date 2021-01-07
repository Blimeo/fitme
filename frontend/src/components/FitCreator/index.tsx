import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";
import { RectangleSelector } from "react-image-annotation/lib/selectors";

type Props = {
  img: string;
  boxes: number[][];
};

export default function FitCreator({ img, boxes }: Props) {
  let annotations: any[] = [];
  let annotation = {};
  const onSubmit = (label: any) => {
    const { geometry, data } = label;
    annotation = {};
    annotations = annotations.concat({
        geometry, 
        data: {
            ...data,
            id: Math.random()
        }
    })
  };
  useEffect(() => {
    console.log(img, boxes);
  });
  return (
    <Grid container spacing={1}>
        <Grid item xs={6}>
        <Annotation
        src={img}
        alt="wutface"
        annotations={annotations}
        type={RectangleSelector}
        value={annotation}
        onChange={(newLabel: {}) => {annotation=newLabel;}
        }
        onSubmit={onSubmit}
        allowTouch
      />
        </Grid>
      <Grid item xs={6}>
          <h1>placeholder</h1>
      </Grid>
      
    </Grid>
  );
}
