import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import ChipInput from "material-ui-chip-input";
import { DropzoneArea } from "material-ui-dropzone";
import styles from "./index.module.css";

type Item = {
  name: string;
  brand: string;
  price: number;
  tags: string[];
  description: string;
  images: File[];
};

export default function ItemUpload() {
  const [values, setValues] = useState<Item>({
    name: "",
    brand: "",
    price: 0.0,
    tags: [],
    description: "",
    images: [],
  });
  const handleChange = (prop: keyof Item) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setValues({ ...values, [prop]: event.target.value });

  const handleSubmit = () => {
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;

    let form_data = new FormData();
    form_data.append("postData", JSON.stringify(values));
    for (const file of values.images) {
      form_data.append("files[]", file, file.name);
    }
    console.log(values);
    fetch("/submit_item", {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      body: form_data,
    }).then((r) => r.json());
  };
  return (
    <Card>
      <CardContent>
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
        {/* <Typography>Give a brief description of the item...</Typography> */}
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
          Add up to 10 images below. JPEG and PNG files accepted, max 5MB per
          image.
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
        <Button
          style={{ marginTop: 8 }}
          variant="outlined"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
