import React from "react";
import Landing from "./components/Landing";
import { useTitle } from "./util/util-functions";

function Home() {
  useTitle("fitme | Data-Driven Platform For Fashion");

  return <Landing />;
}

export default Home;
