import { Typography } from "@material-ui/core";
import React from "react";
import Header from "./components/Header";

function Home() {
  return (
    <div className="Home">
      <Header />
      <Typography>Welcome to Fitme!</Typography>
    </div>
  );
}

export default Home;
