import {
  Container,
  LinearProgress,
  makeStyles,
  Typography,
  createStyles,
  Theme,
  Grid,
  Button,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { Fit, Item, ProfileUser, User } from "../../util/util-types";
import DefaultProfileImage from "../../assets/img/default_avatar.png";
import ProfileHeader from "./ProfileHeader";
import NotFound from "../Error/NotFound";
import ItemCard from "../ItemCard";
import FitCard from "../FitCard";
import styles from "./index.module.css";

type Props = {
  readonly username: ProfileUser | undefined;
  readonly loggedIn: boolean;
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
    unfollowButton: {
      background: "#d6d6d6",
      color: "#fff",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "#999999",
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

type DisplayItem = {
  items: Item[];
  currentPage: number;
};

type DisplayFit = {
  fits: Fit[];
  currentPage: number;
};

function ProfileContainer({ username, loggedIn }: Props) {
  const [profileData, setProfileData] = useState<User>(null);
  const [profileItems, setProfileItems] = useState<DisplayItem>({
    items: [],
    currentPage: 1,
  });
  const [profileFits, setProfileFits] = useState<DisplayFit>({
    fits: [],
    currentPage: 1,
  });
  const [profileFavItems, setProfileFavItems] = useState<DisplayItem>({
    items: [],
    currentPage: 1,
  });
  const [profileFavFits, setProfileFavFits] = useState<DisplayFit>({
    fits: [],
    currentPage: 1,
  });
  const [doesUsernameExist, setDoesUsernameExist] = useState<boolean>(true);
  const [viewerIsFollowingThisUser, setViewerIsFollowingThisUser] = useState<
    boolean | undefined
  >(undefined);
  const classes = useStyles();
  const access_token = localStorage.getItem("access_token");
  const accessTokenString = `Bearer ${access_token}`;

  const fetchFollowersList = useCallback(async (): Promise<void> => {
    const response = await fetch("/my_profile_data", {
      method: "GET",
      headers: {
        Authorization: accessTokenString,
      },
    });
    const data = (await response.json()) as User;
    if (username !== undefined) {
      setViewerIsFollowingThisUser(
        data !== null && data?.following.includes(username)
      );
    } else {
      setViewerIsFollowingThisUser(false);
    }
  }, [accessTokenString, username]);

  useEffect(() => {
    const fetchUserDataType = async (
      dataType: "ITEMS" | "FITS" | "FAV_ITEMS" | "FAV_FITS"
    ): Promise<void> => {
      let route;
      let pageNumber;
      switch (dataType) {
        case "ITEMS":
          route = "/get_user_items";
          pageNumber = profileItems.currentPage;
          break;
        case "FITS":
          route = "/get_user_fits";
          pageNumber = profileFits.currentPage;
          break;
        case "FAV_ITEMS":
          route = "/get_user_fav_items";
          pageNumber = profileFavItems.currentPage;
          break;
        case "FAV_FITS":
          route = "/get_user_fav_fits";
          pageNumber = profileFavFits.currentPage;
          break;
        default:
          throw new Error("Impossible");
      }
      if (profileData !== null) {
        route += `?username=${profileData.username}&page=${pageNumber}`;
        const response = await fetch(route, {
          method: "GET",
          headers: {
            Authorization: accessTokenString,
          },
        });
        if (response.ok) {
          const data = await response.json();
          switch (dataType) {
            case "ITEMS":
              setProfileItems({
                items: data.items as Item[],
                currentPage: pageNumber,
              });
              break;
            case "FITS":
              setProfileFits({
                fits: data.fits as Fit[],
                currentPage: pageNumber,
              });
              break;
            case "FAV_ITEMS":
              setProfileFavItems({
                items: data.items as Item[],
                currentPage: pageNumber,
              });
              break;
            case "FAV_FITS":
              setProfileFavFits({
                fits: data.fits as Fit[],
                currentPage: pageNumber,
              });
              break;
            default:
              throw new Error("Impossible");
          }
        } else {
          alert(
            "There was a problem grabbing this user's data. Please try refreshing the page."
          );
        }
      }
    };
    const fetchProfileData = (accessTokenString?: string): void => {
      const profilePromise = accessTokenString
        ? fetch(
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
        : fetch(`/profile_data?username=${username}`, {
            method: "GET",
          });
      profilePromise
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

    if (profileData === null) {
      if (loggedIn) {
        const access_token = localStorage.getItem("access_token");
        const bearer = `Bearer ${access_token}`;
        fetchProfileData(bearer);
        fetchFollowersList();
      } else {
        fetchProfileData();
        setViewerIsFollowingThisUser(false);
      }
    } else {
      fetchUserDataType("ITEMS");
      fetchUserDataType("FITS");
      fetchUserDataType("FAV_ITEMS");
      fetchUserDataType("FAV_FITS");
    }
  }, [
    accessTokenString,
    doesUsernameExist,
    fetchFollowersList,
    loggedIn,
    profileData,
    profileFavFits.currentPage,
    profileFavItems.currentPage,
    profileFits.currentPage,
    profileItems.currentPage,
    username,
  ]);

  if (!doesUsernameExist) {
    return <NotFound />;
  }
  return profileData === null ||
    username === undefined ||
    viewerIsFollowingThisUser === undefined ? (
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
        loggedIn={loggedIn}
        viewerIsFollowingThisUser={viewerIsFollowingThisUser}
        fetchFollowersList={fetchFollowersList}
      />
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h4">
          🤵 {username === "OWN PROFILE" && "My"} Fits
        </Typography>
        {profileData.uploaded_fits.length !== 0 && profileFits !== null ? (
          <>
            <Grid container alignItems="stretch" spacing={1}>
              {profileFits.fits.map((fit, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  key={`${fit._id} ${index}`}
                  style={{ display: "flex" }}
                >
                  <FitCard fit={fit} />
                </Grid>
              ))}
            </Grid>
            <div>
              {profileFits.currentPage > 1 && (
                <Button
                  variant="contained"
                  onClick={() =>
                    setProfileFits({
                      ...profileFits,
                      currentPage: profileFits.currentPage - 1,
                    })
                  }
                  className={styles.pageNavButton}
                >
                  {profileFits.currentPage - 1}
                </Button>
              )}

              {profileData.uploaded_fits.length > 4 && (
                <>
                  <Button
                    variant="contained"
                    className={styles.pageNavButton}
                    disabled
                  >
                    {profileFits.currentPage}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setProfileFits({
                        ...profileFits,
                        currentPage: profileFits.currentPage + 1,
                      })
                    }
                    className={styles.pageNavButton}
                  >
                    {profileFits.currentPage + 1}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <Typography>Nothing here yet.</Typography>
        )}

        <Typography variant="h4" className={styles.ProfileSectionHeader}>
          🧣 {username === "OWN PROFILE" && "My"} Items
        </Typography>
        {profileData.uploaded_items.length !== 0 && profileItems !== null ? (
          <>
            <Grid container spacing={1}>
              {profileItems.items.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  key={`${item._id} ${index}`}
                  style={{ display: "flex" }}
                >
                  <ItemCard item={item} />
                </Grid>
              ))}
            </Grid>
            <div>
              {profileItems.currentPage > 1 && (
                <Button
                  variant="contained"
                  onClick={() =>
                    setProfileItems({
                      ...profileItems,
                      currentPage: profileItems.currentPage - 1,
                    })
                  }
                  className={styles.pageNavButton}
                >
                  {profileItems.currentPage - 1}
                </Button>
              )}

              {profileData.uploaded_items.length > 4 && (
                <>
                  <Button
                    variant="contained"
                    className={styles.pageNavButton}
                    disabled
                  >
                    {profileItems.currentPage}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setProfileItems({
                        ...profileItems,
                        currentPage: profileItems.currentPage + 1,
                      })
                    }
                    className={styles.pageNavButton}
                  >
                    {profileItems.currentPage + 1}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <Typography>Nothing here yet.</Typography>
        )}

        <Typography variant="h4" className={styles.ProfileSectionHeader}>
          🌟 {username === "OWN PROFILE" && "My"} Favorites
        </Typography>
        <Typography variant="h5" className={styles.ProfileSectionHeader}>
          {username === "OWN PROFILE" && "My"} Favorite Fits
        </Typography>
        {profileData.favorite_fits.length !== 0 && profileFavFits !== null ? (
          <>
            <Grid container alignItems="stretch" spacing={1}>
              {profileFavFits.fits.map((fit, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  key={`${fit._id} ${index}`}
                  style={{ display: "flex" }}
                >
                  <FitCard fit={fit} />
                </Grid>
              ))}
            </Grid>
            <div>
              {profileFavFits.currentPage > 1 && (
                <Button
                  variant="contained"
                  onClick={() =>
                    setProfileFavFits({
                      ...profileFavFits,
                      currentPage: profileFavFits.currentPage - 1,
                    })
                  }
                  className={styles.pageNavButton}
                >
                  {profileFavFits.currentPage - 1}
                </Button>
              )}

              {profileData.favorite_fits.length > 4 && (
                <>
                  <Button
                    variant="contained"
                    className={styles.pageNavButton}
                    disabled
                  >
                    {profileFavFits.currentPage}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setProfileFavFits({
                        ...profileFavFits,
                        currentPage: profileFavFits.currentPage + 1,
                      })
                    }
                    className={styles.pageNavButton}
                  >
                    {profileFavFits.currentPage + 1}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <Typography>
            No favorites yet. Look around for some inspiration!
          </Typography>
        )}
        <Typography variant="h5" className={styles.ProfileSectionHeader}>
          {username === "OWN PROFILE" && "My"} Favorite Items
        </Typography>
        {profileData.favorite_items.length !== 0 && profileFavItems !== null ? (
          <>
            <Grid container spacing={1}>
              {profileFavItems.items.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  md={3}
                  key={`${item._id} ${index}`}
                  style={{ display: "flex" }}
                >
                  <ItemCard item={item} />
                </Grid>
              ))}
            </Grid>
            <div>
              {profileFavItems.currentPage > 1 && (
                <Button
                  variant="contained"
                  onClick={() =>
                    setProfileFavItems({
                      ...profileFavItems,
                      currentPage: profileFavItems.currentPage - 1,
                    })
                  }
                  className={styles.pageNavButton}
                >
                  {profileFavItems.currentPage - 1}
                </Button>
              )}
              {profileData.favorite_items.length > 4 && (
                <>
                  <Button
                    variant="contained"
                    className={styles.pageNavButton}
                    disabled
                  >
                    {profileFavItems.currentPage}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setProfileFavItems({
                        ...profileFavItems,
                        currentPage: profileFavItems.currentPage + 1,
                      })
                    }
                    className={styles.pageNavButton}
                  >
                    {profileFavItems.currentPage + 1}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <Typography>No favorites yet.</Typography>
        )}
      </Container>
    </>
  );
}

export default ProfileContainer;
