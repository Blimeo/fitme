import { ReactElement } from "react";
import { useParams } from "react-router-dom";
import ProfileContainer from "./components/ProfileContainer";

const Profile = (): ReactElement => {
  const { username } = useParams<Record<string, string | undefined>>();

  return <ProfileContainer username={username ?? "OWN PROFILE"} />;
};

export default Profile;
