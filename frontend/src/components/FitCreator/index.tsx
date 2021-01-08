import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";

type Props = {
  readonly img: string;
  readonly boxes: number[][];
  readonly width: number;
  readonly height: number;
};

// Precomputation on given boxes to make them annotations
const setMLAnnotations = (boxes: number[][], width: number, height: number) => {
  return boxes.map(([x1, y1, x2, y2], index) => {
    const computedWidth = ((x2 - x1) / width) * 100;
    const computedHeight = ((y2 - y1) / height) * 100;
    // percentile based on image dimensions
    const computedX = (x1 / width) * 100;
    const computedY = (y1 / height) * 100;
    return {
      data: {
        id: index,
        text: "Label this fit item!",
      },
      geometry: {
        height: computedHeight,
        type: "RECTANGLE",
        width: computedWidth,
        x: computedX,
        y: computedY,
      },
    };
  });
};

// prodigious use of any because react-image-annotation does not have TS support
export default function FitCreator({ img, boxes, width, height }: Props) {
  const [annotations, setAnnotations] = useState<any>([]);
  const [baseAnnotation, setBaseAnnotation] = useState<any>({});

  useEffect(() => {
    setAnnotations(setMLAnnotations(boxes, width, height));
  }, [boxes, img, width, height]);

  const onSubmit = (annotation: any) => {
    const { geometry, data } = annotation;
    setBaseAnnotation({});
    setAnnotations([
      ...annotations,
      {
        geometry,
        data: {
          ...data,
          id: annotations.length,
        },
      },
    ]);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Annotation
          src={img}
          alt="wutface"
          annotations={annotations}
          value={baseAnnotation}
          onChange={setBaseAnnotation}
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
