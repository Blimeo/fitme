import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { FitUploadType, Gender } from "./util/util-types";
import styles from "./css/FitUpload.module.css";
import ChipInput from "material-ui-chip-input";
import { DropzoneArea } from "material-ui-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Crop } from "react-image-crop";
import FitCreator from "./components/FitCreator";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import GenderToggleButtons from "./components/Util/GenderToggleButtons";

type View = "AWAITING_IMAGE" | "CROP_SCREEN" | "PROCESSING" | "IMAGE_RETURNED";

export default function FitUpload() {
  const [fit, setFit] = useState<FitUploadType>({
    name: "",
    tags: [],
    description: "",
    img_url: "",
    itemBoxes: [],
    width: 0,
    height: 0,
    gender: "UNISEX",
  });
  const [img, setImg] = useState<File[]>([]); //it's only a single image but the dropzone library requires an array of files
  const [view, setView] = useState<View>("AWAITING_IMAGE");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailure, setUploadFailure] = useState(false);
  const [annotations, setAnnotations] = useState<any>([]);
  const handleChange = (prop: keyof FitUploadType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setFit({ ...fit, [prop]: event.target.value });

  const handleGender = (_: React.MouseEvent<HTMLElement>, gender: Gender) => {
    setFit({ ...fit, gender });
  };

  const [crop, setCrop] = useState<Crop>({ aspect: 3 / 4, width: 300 });
  const [cropURL, setCropURL] = useState("");
  const history = useHistory();
  const handleSubmitImg = () => {
    if (img.length === 0) {
      alert("Please submit an image.");
    } else {
      setView("PROCESSING");
      setCropURL(URL.createObjectURL(img[0]));

      setView("CROP_SCREEN");
    }
  };

  const handleSubmitFit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;
    const form_data = new FormData();
    form_data.append("data", JSON.stringify(fit));
    form_data.append("annotations", JSON.stringify(annotations));
    if (
      annotations.some(
        ({ data }: any) =>
          data.text === "Label this fit item!" || data.text.trim() === ""
      )
    ) {
      setUploadFailure(true);
      return;
    }
    fetch("/upload_fit", {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: form_data,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          setUploadSuccess(true);
          setTimeout(() => {
            history.push("/fits");
          }, 2000);
        }
      });
  };

  const handleSubmitCroppedImg = async (): Promise<void> => {
    setView("PROCESSING");
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;
    const form_data = new FormData();

    form_data.append("img", img[0], img[0].name);
    form_data.append("crop", JSON.stringify(crop));
    const response = await fetch(`/submit_fit_image`, {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: form_data,
    });
    if (response.ok) {
      const labelData = await response.json();
      setFit({
        ...fit,
        img_url: labelData.img_url,
        itemBoxes: labelData.boxes,
        width: labelData.width,
        height: labelData.height,
      });
      setView("IMAGE_RETURNED");
    } else {
      setView("AWAITING_IMAGE");
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
            onChange={(files: File[]) => setImg(files)}
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
          <Typography>Before we proceed, let's crop your image...</Typography>
          <ReactCrop
            src={cropURL}
            minWidth={200}
            crop={crop}
            onChange={(newCrop: Crop) => setCrop(newCrop)}
          />
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
        <form onSubmit={handleSubmitFit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>
                Draw a rectangle over each item you want to label, then search
                for the item in our database!
              </Typography>
              <FitCreator
                img={fit.img_url}
                boxes={fit.itemBoxes}
                width={fit.width}
                height={fit.height}
                annotations={annotations}
                setAnnotations={setAnnotations}
              />
            </Grid>
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
                required
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
                required
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
            <Grid item xs={12}>
              <GenderToggleButtons value={fit.gender} onChange={handleGender} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" type="submit">
                Publish
              </Button>
            </Grid>
            <Snackbar open={uploadSuccess} autoHideDuration={6000}>
              <Alert severity="success">Upload successful!</Alert>
            </Snackbar>
            <Snackbar open={uploadFailure} autoHideDuration={6000}>
              <Alert onClose={() => setUploadFailure(false)} severity="error">
                Make sure to annotate each of this fit's items!
              </Alert>
            </Snackbar>
          </Grid>
        </form>
      )}
    </Container>
  );
}
