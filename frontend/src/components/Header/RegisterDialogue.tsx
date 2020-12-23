import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import styles from "./LoginDialogue.module.css";

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRegister = (e: any) => {
    e.preventDefault();
    const opts = {
      email: email,
      username: username,
      password: password,
    };
    fetch("/register", {
      method: "POST",
      body: JSON.stringify(opts),
    })
      .then((r) => r.json())
      .then((token) => {
        alert(token.message);
      });
    setOpen(false);
  };
  return (
    <div>
      <Button className={styles.loginButton} onClick={handleClickOpen}>
        Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Register</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the items below to register.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            margin="dense"
            id="name"
            label="Username"
            type="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
