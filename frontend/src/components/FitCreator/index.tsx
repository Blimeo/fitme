import { Button, Card, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Annotation from "react-image-annotation";
import AnnotationEditor from "./AnnotationEditor";
import TextEditor from "./TextEditor";
import styles from "./index.module.css";
import { getItemNameFromCustomString } from "../../util/util-functions";

type Props = {
  readonly img: string;
  readonly boxes: number[][];
  readonly width: number;
  readonly height: number;
  readonly annotations: any;
  readonly setAnnotations: any;
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
        isBeingEdited: true,
        isMLAnnotation: true,
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
export default function FitCreator({
  img,
  boxes,
  width,
  height,
  annotations,
  setAnnotations,
}: Props) {
  const [baseAnnotation, setBaseAnnotation] = useState<any>({});
  const [activeAnnotations, setActiveAnnotations] = useState<any>([]);
  useEffect(() => {
    setAnnotations(setMLAnnotations(boxes, width, height));
  }, [boxes, img, width, height, setAnnotations]);

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
          isBeingEdited: false,
          isMLAnnotation: false,
        },
      },
    ]);
  };

  const renderEditor = ({ annotation, onChange, onSubmit }: any) => (
    <AnnotationEditor
      annotation={annotation}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Annotation
          src={img}
          alt="Your fit upload image"
          annotations={annotations.map((anno: any) => ({
            ...anno,
            data: { text: getItemNameFromCustomString(anno.data.text) },
          }))}
          value={baseAnnotation}
          activeAnnotations={activeAnnotations}
          onChange={setBaseAnnotation}
          onSubmit={onSubmit}
          renderEditor={renderEditor}
          allowTouch
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container direction="column" spacing={1}>
          {annotations.map((anno: any, index: number) => {
            return (
              <Grid item xs={12} key={index}>
                <Card
                  style={{ padding: "6px" }}
                  onMouseOver={() => setActiveAnnotations([anno])}
                  onMouseOut={() => setActiveAnnotations([])}
                >
                  <Typography variant="h6">
                    {getItemNameFromCustomString(anno.data.text)}
                  </Typography>

                  {anno.data.isBeingEdited ? (
                    <>
                      <TextEditor
                        value={anno.data.text}
                        onChange={(text: string) => {
                          setAnnotations(
                            annotations.map((a: any) =>
                              a === anno
                                ? {
                                    ...a,
                                    data: {
                                      ...a.data,
                                      isBeingEdited: false,
                                      text,
                                    },
                                  }
                                : a
                            )
                          );
                        }}
                      />
                      {!anno.data.isMLAnnotation && (
                        <Button
                          variant="contained"
                          color="primary"
                          className={styles.AnnotationButton}
                          onClick={() =>
                            setAnnotations(
                              annotations.map((a: any) =>
                                a === anno
                                  ? {
                                      ...a,
                                      data: {
                                        ...a.data,
                                        isBeingEdited: false,
                                      },
                                    }
                                  : a
                              )
                            )
                          }
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={styles.AnnotationButton}
                      onClick={() =>
                        setAnnotations(
                          annotations.map((a: any) =>
                            a === anno
                              ? {
                                  ...a,
                                  data: {
                                    ...a.data,
                                    isBeingEdited: true,
                                  },
                                }
                              : a
                          )
                        )
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      setAnnotations(annotations.filter((a: any) => a !== anno))
                    }
                  >
                    Remove
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}
