import { Typography } from "@material-ui/core";
import React from "react";
import Header from "./components/Header";

function Profile() {
    return (
      <div className="Home">
        <Header />
        <Typography>Welcome to your profile!</Typography>
      </div>
    );
  }
  
  export default Profile;