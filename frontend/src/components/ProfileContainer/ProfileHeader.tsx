import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { ProfileUser, User } from "../../util/util-types";
import InstagramIcon from "@material-ui/icons/Instagram";
import YouTubeIcon from "@material-ui/icons/YouTube";
import TwitterIcon from "@material-ui/icons/Twitter";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import styles from "./ProfileHeader.module.css";

type Props = {
  readonly classes: Record<
    | "container"
    | "avatar"
    | "userHeader"
    | "followButton"
    | "socialMediaLink"
    | "editIcon"
    | "profileTextField",
    string
  >;
  readonly profileData: User;
  readonly profileImage: string;
  readonly username: ProfileUser;
};

function ProfileHeader({
  classes,
  profileData,
  profileImage,
  username,
}: Props) {
  const [currentlyEditing, setCurrentlyEditing] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (profileData === null) {
    return null; // impossible
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Card>
        <CardContent>
          <Container maxWidth="md" className={classes.container}>
            {currentlyEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Tooltip title="Change profile picture">
                      <IconButton>
                        <Avatar
                          src={profileImage}
                          className={`${classes.avatar} ${styles.ProfileImageEditing}`}
                        ></Avatar>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <TextField
                      id="username"
                      label="Username"
                      defaultValue={profileData.username}
                      variant="outlined"
                      className={classes.profileTextField}
                      required
                    />
                    <TextField
                      id="instagram"
                      label="Instagram Link"
                      defaultValue={
                        profileData.instagram === "NONE_PROVIDED"
                          ? undefined
                          : profileData.instagram
                      }
                      variant="outlined"
                      className={classes.profileTextField}
                      type="url"
                    />
                    <TextField
                      id="youtube"
                      label="YouTube Link"
                      defaultValue={
                        profileData.youtube === "NONE_PROVIDED"
                          ? undefined
                          : profileData.youtube
                      }
                      variant="outlined"
                      className={classes.profileTextField}
                      type="url"
                    />
                    <TextField
                      id="twitter"
                      label="Twitter Link"
                      defaultValue={
                        profileData.twitter === "NONE_PROVIDED"
                          ? undefined
                          : profileData.twitter
                      }
                      variant="outlined"
                      className={classes.profileTextField}
                      type="url"
                    />
                  </Grid>
                </Grid>
                <Fab
                  color="primary"
                  aria-label="done"
                  className={classes.editIcon}
                  onClick={() => setCurrentlyEditing(false)}
                  type="submit"
                >
                  <DoneIcon />
                </Fab>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Avatar
                    src={profileImage}
                    className={classes.avatar}
                  ></Avatar>
                </Grid>
                <Grid item xs={12} md={6} className={classes.userHeader}>
                  <Typography variant="h5">{profileData.username}</Typography>
                  <Typography variant="subtitle2">
                    {profileData.following.length ?? 0} Following
                  </Typography>
                  <Typography variant="subtitle2">
                    {profileData.followers.length ?? 0} Followers
                  </Typography>
                  {profileData.instagram !== "NONE_PROVIDED" && (
                    <Link href={profileData.instagram} color="inherit">
                      <InstagramIcon className={classes.socialMediaLink} />
                    </Link>
                  )}
                  {profileData.youtube !== "NONE_PROVIDED" && (
                    <Link href={profileData.youtube} color="inherit">
                      <YouTubeIcon className={classes.socialMediaLink} />
                    </Link>
                  )}
                  {profileData.twitter !== "NONE_PROVIDED" && (
                    <Link href={profileData.twitter} color="inherit">
                      <TwitterIcon className={classes.socialMediaLink} />
                    </Link>
                  )}
                </Grid>
                <Grid item xs={12} md={3} className={classes.userHeader}>
                  {username !== "OWN_PROFILE" && (
                    <Button className={classes.followButton}>FOLLOW</Button>
                  )}
                </Grid>
                <Fab
                  color="primary"
                  aria-label="edit"
                  className={classes.editIcon}
                  onClick={() => setCurrentlyEditing(true)}
                >
                  <EditIcon />
                </Fab>
              </Grid>
            )}
          </Container>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfileHeader;
