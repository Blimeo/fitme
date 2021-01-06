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
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Crop } from "react-image-crop";


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
  //CROP_SCREEN: crop the image they have uploaded (need 3:4 aspect)
  //PROCESSING: display loading
  //IMAGE_RETURNED: ML done, show final submit button
  const [view, setView] = useState("AWAITING_IMAGE");
  const handleChange = (prop: keyof FitUploadType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setFit({ ...fit, [prop]: event.target.value });

  const [crop, setCrop] = useState<Crop>({ aspect: 3 / 4, width: 300 });
  const [cropURL, setCropURL] = useState("");

  const handleSubmitImg = () => {
    if (fit.img.length === 0) {
      alert("Please submit an image.");
    } else {
      setView("PROCESSING");
      setCropURL(URL.createObjectURL(fit.img[0]));
      
      setView("CROP_SCREEN");
    }
  };

  const handleSubmitCroppedImg = async (): Promise<void> => {
    setView("PROCESSING");
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;
    const form_data = new FormData();
    
    form_data.append("img", fit.img[0], fit.img[0].name);
    form_data.append("crop", JSON.stringify(crop));
    const response = await fetch(`/submit_fit_image`, {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: form_data,
    });
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
      {view === "CROP_SCREEN" && (
        <div>
          <Typography>
            Before we proceed, let's crop your image...
          </Typography>
          <ReactCrop src={cropURL} minWidth={200} crop={crop} onChange={(newCrop : Crop) => setCrop(newCrop)} />
          <br />
          <Button variant="outlined" onClick={() => setView("AWAITING_IMAGE")}>
            Back
          </Button>
          <Button variant="outlined" onClick={() => handleSubmitCroppedImg()}>
            Next
          </Button>
        </div>
      )}
      {view === "PROCESSING" && (
        <div>
          <CircularProgress />
        </div>
      )}
      {view === "IMAGE_RETURNED" && (
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
      )}
      
    </Container>
  );
}