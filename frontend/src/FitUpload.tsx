import {
    Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { FitUploadType } from "./util/util-types";
import styles from "./css/FitUpload.module.css";
import ChipInput from "material-ui-chip-input";
import { DropzoneArea } from "material-ui-dropzone";
export default function FitUpload() {
  const [fit, setFit] = useState<FitUploadType>({
    name: "",
    tags: [],
    description: "",
    img: [], //it's only a single image but the dropzone library requires an array of files
    items: [],
    itemBoxes: [],
  });

  //possible views for this page:
  //AWAITING_IMAGE: user has not yet uploaded image
  //IMAGE_PROCESSING: image uploaded but ML not done yet, display loading
  //IMAGE_RETURNED: ML done, show final submit button
  const [view, setView] = useState("AWAITING_IMAGE");
  const handleChange = (prop: keyof FitUploadType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setFit({ ...fit, [prop]: event.target.value });
  const handleSubmitImg = () => {
      if (fit.img.length === 0) {
        alert('Please submit an image.')
      } else {
        setView("IMAGE_PROCESSING");
      }
  };
  return (
    <Container className={styles.container} maxWidth="md">
      <Typography gutterBottom variant="h5" component="h2">
        Showcase a fit
      </Typography>
      {view === "AWAITING_IMAGE" && (
        <div>
          <Typography>
            Upload an image featuring multiple items! 5MB maximum.
          </Typography>
          <DropzoneArea
            onChange={(files: File[]) => setFit({ ...fit, img: files })}
            filesLimit={1}
            acceptedFiles={["image/jpeg", "image/png"]}
            maxFileSize={5000000}
          />
          <Button variant="outlined" onClick={() => handleSubmitImg()}>
            Next
          </Button>
        </div>
      )}
      {view === "IMAGE_PROCESSING" && (
        <div>
          <Typography>Identifying clothes in your fit...</Typography>
          <CircularProgress />
        </div>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name of fit"
            type="text"
            fullWidth
            onChange={handleChange("name")}
            variant="outlined"
            value={fit.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-multiline-flexible"
            label="Description (<500 characters)"
            multiline
            fullWidth
            rows={5}
            variant="outlined"
            inputProps={{ maxLength: 500 }}
            value={fit.description}
            error={fit.description.length >= 500}
            onChange={handleChange("description")}
          />
        </Grid>
        <Grid item xs={12}>
          <ChipInput
            className={styles.TagInput}
            label="Tags"
            onChange={(tags) => setFit({ ...fit, tags: tags })}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
}
