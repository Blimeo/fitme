import { Card, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";
import AnnotationEditor from "./AnnotationEditor.js";

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
  const [allItems, setAllItems] = useState<string[]>([]);
  useEffect(() => {
    setAnnotations(setMLAnnotations(boxes, width, height));
    fetch("/item_names", {
      method: "GET",
    })
      .then((r) => r.json())
      .then((r) => {
        setAllItems(r.items);
      });
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
  const renderEditor = ({ annotation, onChange, onSubmit }: any) => (
    <AnnotationEditor
      annotation={annotation}
      onChange={onChange}
      onSubmit={onSubmit}
      itemNames={allItems}
    />
  );
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
          renderEditor={renderEditor}
          allowTouch
        />
      </Grid>
      <Grid item xs={6}>
        {annotations.map((anno: any) => {
          return <Card>{anno.data.text}</Card>;
        })}
      </Grid>
    </Grid>
  );
}
