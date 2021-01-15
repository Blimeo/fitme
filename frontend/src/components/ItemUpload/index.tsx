import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import ChipInput from "material-ui-chip-input";
import { DropzoneArea } from "material-ui-dropzone";
import styles from "./index.module.css";
import { Gender, ItemUploadType } from "../../util/util-types";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import GenderToggleButtons from "../Util/GenderToggleButtons";

type Props = {
  readonly setUploadHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ItemUpload({ setUploadHidden }: Props) {
  const [values, setValues] = useState<ItemUploadType>({
    name: "",
    brand: "",
    price: 0.0,
    tags: [],
    description: "",
    images: [],
    gender: "UNISEX",
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGender = (_: React.MouseEvent<HTMLElement>, gender: Gender) => {
    setValues({ ...values, gender });
  };
  const handleChange = (prop: keyof ItemUploadType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setValues({ ...values, [prop]: event.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (values.images.length === 0) {
      setOpen(true);
      return;
    }
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;

    const form_data = new FormData();
    form_data.append("postData", JSON.stringify(values));
    let i = 0;
    for (const file of values.images) {
      form_data.append("files-" + i, file, file.name);
      i++;
    }
    setIsSubmitting(true);
    fetch("/submit_item", {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: form_data,
    })
      .then((r) => r.json())
      .then((r) => {
        setUploadHidden(true);
        setIsSubmitting(false);
      });
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="error">
          Please add at least one photo to show what this item looks like.
        </Alert>
      </Snackbar>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography gutterBottom variant="h5" component="h2">
              Showcase an item
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name of item"
                  type="text"
                  fullWidth
                  onChange={handleChange("name")}
                  variant="outlined"
                  value={values.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  margin="dense"
                  id="brand"
                  label="Brand"
                  type="text"
                  fullWidth
                  style={{ marginRight: 8 }}
                  onChange={handleChange("brand")}
                  variant="outlined"
                  value={values.brand}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  id="price"
                  label="Price"
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.01" }}
                  onChange={handleChange("price")}
                  variant="outlined"
                  value={values.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                className={styles.TagInput}
                label="Tags"
                onChange={(tags) => setValues({ ...values, tags })}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <TextField
              id="standard-multiline-flexible"
              label="Description (<500 characters)"
              multiline
              fullWidth
              style={{ marginTop: 8 }}
              rows={5}
              variant="outlined"
              inputProps={{ maxLength: 500 }}
              value={values.description}
              error={values.description.length >= 500}
              onChange={handleChange("description")}
            />
            <Typography>
              Add up to 10 images below. JPEG and PNG files accepted, max 5MB
              per image.
            </Typography>
            <div>
              <DropzoneArea
                onChange={(files: File[]) =>
                  setValues({ ...values, images: files })
                }
                filesLimit={10}
                acceptedFiles={["image/jpeg", "image/png"]}
                maxFileSize={5000000}
              />
            </div>
            <Grid item xs={12} md={8}>
              <GenderToggleButtons
                value={values.gender}
                onChange={handleGender}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button
                  className={styles.SubmitButton}
                  variant="outlined"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
