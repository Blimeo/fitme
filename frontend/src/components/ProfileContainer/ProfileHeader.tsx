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
import React, { useRef, useState } from "react";
import { ProfileUpdateRequest, ProfileUser, User } from "../../util/util-types";
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
  readonly profileData: NonNullable<User>;
  readonly setProfileData: React.Dispatch<React.SetStateAction<User>>;
  readonly profileImage: string;
  readonly username: ProfileUser;
};

function ProfileHeader({
  classes,
  profileData,
  setProfileData,
  profileImage,
  username,
}: Props) {
  const [currentlyEditing, setCurrentlyEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageLink, setProfileImageLink] = useState<string>(
    profileImage
  );
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    is_updating_avatar: false,
    username: username,
    instagram: profileData.instagram,
    twitter: profileData.twitter,
    youtube: profileData.youtube,
  });

  const inputFile = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const access_token = localStorage.getItem("access_token");
    const bearer = "Bearer " + access_token;
    e.preventDefault();
    const requestBody = new FormData();
    requestBody.append("postData", JSON.stringify(formData));
    if (profileImageFile !== null) {
      requestBody.append(
        "profileImage",
        profileImageFile,
        profileImageFile.name
      );
    }
    const response = await fetch("/update_profile", {
      method: "PUT",
      headers: {
        Authorization: bearer,
      },
      body: requestBody,
    });
    if (response.ok) {
      const response = await fetch("/my_profile_data", {
        method: "GET",
        headers: {
          Authorization: bearer,
        },
      });
      const data = await response.json();
      setProfileData(data as User);
      setCurrentlyEditing(false);
    } else {
      alert("error");
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Card>
        <CardContent>
          <Container maxWidth="md" className={classes.container}>
            {currentlyEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <input
                      type="file"
                      accept="image/*"
                      id="file"
                      ref={inputFile}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        // @ts-ignore
                        setProfileImageFile(event.currentTarget.files[0]);
                        setProfileImageLink(
                          // @ts-ignore
                          URL.createObjectURL(event.currentTarget.files[0])
                        );
                        setFormData({ ...formData, is_updating_avatar: true });
                      }}
                    />
                    <Tooltip title="Change profile picture">
                      <IconButton
                        onClick={() => {
                          // @ts-ignore
                          inputFile.current.click();
                        }}
                      >
                        <Avatar
                          src={
                            profileImageFile === null
                              ? profileImage
                              : profileImageLink
                          }
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
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, youtube: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
                <Fab
                  color="primary"
                  aria-label="done"
                  className={classes.editIcon}
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
                  {username !== "OWN PROFILE" && (
                    <Button className={classes.followButton}>FOLLOW</Button>
                  )}
                </Grid>
                {username === "OWN PROFILE" && (
                  <Fab
                    color="primary"
                    aria-label="edit"
                    className={classes.editIcon}
                    onClick={() => setCurrentlyEditing(true)}
                  >
                    <EditIcon />
                  </Fab>
                )}
              </Grid>
            )}
          </Container>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProfileHeader;
