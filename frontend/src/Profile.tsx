import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileContainer from "./components/ProfileContainer";
import { useTitle } from "./util/util-functions";
import { User } from "./util/util-types";

type Props = {
  readonly loggedIn: boolean;
  readonly ownProfile: boolean;
};

const Profile = ({ loggedIn, ownProfile }: Props): ReactElement => {
  const { username } = useParams<Record<string, string | undefined>>();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  useTitle(
    () =>
      username === undefined || ownProfile
        ? "fitme | My Profile"
        : `fitme | ${username}'s Profile`,
    [username]
  );

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token === null) {
      setIsOwnProfile(false);
    }
    if (loggedIn) {
      fetch("/my_profile_data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const user = data as User;
          if (user && user.username !== username) {
            setIsOwnProfile(false);
          } else {
            setIsOwnProfile(true);
          }
        });
    }
  }, [loggedIn, username]);

  return (
    <ProfileContainer
      username={
        username === undefined || isOwnProfile || ownProfile
          ? "OWN PROFILE"
          : username
      }
      loggedIn={loggedIn}
    />
  );
};

export default Profile;
