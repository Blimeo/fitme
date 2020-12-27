import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ProfileUser, User } from "../../util/util-types";

type Props = {
  username: ProfileUser;
};

function ProfileContainer({ username }: Props) {
  const [profileData, setProfileData] = useState<User>(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("You are not logged in");
    } else {
      const bearer = "Bearer " + access_token;
      fetch(
        username === "OWN_PROFILE"
          ? "/my_profile_data"
          : `/profile_data/${username}`,
        {
          method: "GET",
          headers: {
            Authorization: bearer,
          },
        }
      )
        .then((r) => r.json())
        .then((data) => {
          setProfileData(data as User);
        });
    }
  });
  return (
    <div className="Home">
      <Typography>Welcome to your profile!</Typography>
    </div>
  );
}

export default ProfileContainer;
