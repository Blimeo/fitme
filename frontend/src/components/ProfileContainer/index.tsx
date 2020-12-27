import {
  Card,
  CardContent,
  Container,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ProfileUser, User } from "../../util/util-types";

type Props = {
  username: ProfileUser;
};

const useStyles = makeStyles({
  container: {
    marginTop: 12,
  },
});

function ProfileContainer({ username }: Props) {
  const [profileData, setProfileData] = useState<User>(null);
  const classes = useStyles();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("You are not logged in");
    } else {
      const bearer = `Bearer ${access_token}`;
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
        .then((data) => setProfileData(data as User));
    }
  }, [profileData, username]);

  return profileData === null ? (
    <LinearProgress />
  ) : (
    <Container maxWidth="lg" className={classes.container}>
      <Card>
        <CardContent>
          <Typography>{profileData.username}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfileContainer;
