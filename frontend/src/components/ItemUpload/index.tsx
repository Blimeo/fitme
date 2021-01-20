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
import { Autocomplete } from "@material-ui/lab";
import { clothingTypes, colorMap } from "../../util/data";

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
    gender: "Unisex",
    category: "",
    color: "",
  });
  const [open, setOpen] = useState(false);
  const [uploadFailure, setUploadFailure] = useState(false);
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
      })
      .catch((e) => {
        setUploadFailure(true);
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
      <Snackbar open={uploadFailure} autoHideDuration={6000}>
        <Alert onClose={() => setUploadFailure(false)} severity="error">
          There was an error when uploading this item. Make sure this item
          doesn't already exist in our database!
        </Alert>
      </Snackbar>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography gutterBottom variant="h5" component="h2">
              Showcase an item
            </Typography>
            <Grid container spacing={1}>
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
              <Grid item xs={12} sm={6}>
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
                <Autocomplete
                  id="color-select"
                  options={Object.keys(colorMap)}
                  onChange={(_, val: any) => {
                    setValues({ ...values, color: val });
                  }}
                  getOptionLabel={(color: string) => color}
                  renderOption={(color: string) => (
                    <React.Fragment>
                      {color === "Multicolored" ? (
                        <>
                          <div className={styles.rainbow} />
                          {color}
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              marginRight: "5px",
                              border: "1px solid black",
                              display: "inline-block",
                              //@ts-ignore
                              backgroundColor: colorMap[color],
                            }}
                          />
                          {color}
                        </>
                      )}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Color"
                      variant="outlined"
                      value={values.color}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
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
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="category-select"
                  options={clothingTypes}
                  onChange={(_, val) => {
                    setValues({ ...values, category: val as string });
                  }}
                  getOptionLabel={(option: string) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                      value={values.category}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <ChipInput
                  className={styles.TagInput}
                  label="Tags"
                  onChange={(tags) => setValues({ ...values, tags })}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>

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
