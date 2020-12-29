import {
  Container,
  LinearProgress,
  makeStyles,
  Typography,
  createStyles,
  Theme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ProfileUser, User } from "../../util/util-types";
import DefaultProfileImage from "../../assets/img/default_avatar.png";
import ProfileHeader from "./ProfileHeader";
import NotFound from "../Error/NotFound";

type Props = {
  readonly username: ProfileUser | undefined;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: 12,
      position: "relative",
    },
    avatar: {
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
    userHeader: {
      textAlign: "left",
    },
    profileTextField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
    followButton: {
      background: "#e91e63",
      color: "#fff",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "#ff3b7d",
      },
    },
    socialMediaLink: {
      marginTop: "0.2em",
      marginRight: "1em",
    },
    editIcon: {
      position: "absolute",
      right: 0,
      bottom: 0,
    },
  })
);

function ProfileContainer({ username }: Props) {
  const [profileData, setProfileData] = useState<User>(null);
  const [doesUsernameExist, setDoesUsernameExist] = useState<boolean>(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchProfileData = async (
      accessTokenString: string
    ): Promise<void> => {
      fetch(
        username === "OWN PROFILE"
          ? "/my_profile_data"
          : `/profile_data?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: accessTokenString,
          },
        }
      )
        .then((r) => {
          if (r.ok) {
            return r.json();
          } else {
            setDoesUsernameExist(false);
          }
        })
        .then((data) => {
          setProfileData(data as User);
        })
        .catch(() => setDoesUsernameExist(false));
    };

    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      alert("You are not logged in");
    } else {
      const bearer = `Bearer ${access_token}`;
      fetchProfileData(bearer);
    }
  }, [username]);

  if (!doesUsernameExist) {
    return <NotFound />;
  }
  return profileData === null || username === undefined ? (
    <LinearProgress />
  ) : (
    <>
      <ProfileHeader
        classes={classes}
        profileData={profileData}
        setProfileData={setProfileData}
        profileImage={
          profileData.avatar === "DEFAULT_PROFILE_IMAGE"
            ? DefaultProfileImage
            : profileData.avatar
        }
        username={username}
      />
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h5">
          🤵 {username === "OWN PROFILE" && "My"} Fits
        </Typography>
        {profileData.uploaded_fits.length === 0 ? (
          <Typography>Nothing here yet.</Typography>
        ) : (
          <Typography>TODO</Typography>
        )}

        <Typography variant="h5">
          🧣 {username === "OWN PROFILE" && "My"} Items
        </Typography>
        {profileData.uploaded_items.length === 0 ? (
          <Typography>Nothing here yet.</Typography>
        ) : (
          <Typography>TODO</Typography>
        )}

        <Typography variant="h5">
          🌟 {username === "OWN PROFILE" && "My"} Favorites
        </Typography>
        {profileData.favorite_items.length === 0 ? (
          <Typography>Nothing here yet.</Typography>
        ) : (
          <Typography>TODO</Typography>
        )}
      </Container>
    </>
  );
}

export default ProfileContainer;
