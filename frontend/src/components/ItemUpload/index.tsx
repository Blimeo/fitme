import {
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ChipInput from "material-ui-chip-input";
import { DropzoneArea } from "material-ui-dropzone";

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
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = () => {
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;

    let form_data = new FormData();
    // form_data.append("postData", JSON.stringify(values));
    // for (const file of values.images) {
    //   form_data.append('files[]', file, file.name);
    // }
    form_data.append('file', values.images[0], values.images[0].name);
    alert(form_data.getAll('file'));

    fetch("/submit_item", {
      method: "POST",
      headers: {
        Authorization: bearer,
      },
      
      body: form_data,
    })
      .then((r) => r.json())
  };
  return (
    <div>
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
      <TextField
        margin="dense"
        id="brand"
        label="Brand"
        type="text"
        style={{ marginRight: 8 }}
        onChange={handleChange("brand")}
        variant="outlined"
        value={values.brand}
      />
      <TextField
        margin="dense"
        id="price"
        label="Price"
        type="text"
        onChange={handleChange("price")}
        variant="outlined"
        value={values.price}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />

      <Typography>Enter tags (at least 3) </Typography>
      <ChipInput
        defaultValue={["foo", "bar"]}
        onChange={(tags: string[]) => handleChange("tags")}
        variant="outlined"
      />
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
        onChange={handleChange("description")}
      />
      <Typography>
        Add up to 10 images below. JPEG and PNG files accepted, max 5MB per
        image.
      </Typography>
      <div>
        <DropzoneArea
          onChange={(files: File[]) => setValues({ ...values, images: files })}
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
    </div>
  );
}
