import { Typography } from "@material-ui/core";
import React, { useEffect, useRef} from "react";

function Profile() {
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("You are not logged in");
    } else {
      const bearer = "Bearer " + access_token;
      fetch("/profile_data", {
        method: "POST",
        headers: {
          Authorization: bearer,
        },
      })
        .then((r) => r.json())
        .then((token) => {
          alert(token.identity)
        });
    }
  });
  return (
    <div className="Home">
      <Typography>Welcome to your profile!</Typography>
    </div>
  );
}

export default Profile;
