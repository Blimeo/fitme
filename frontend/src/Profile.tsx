import { ReactElement } from "react";
import { useParams } from "react-router-dom";
import ProfileContainer from "./components/ProfileContainer";

type Props = {
  readonly loggedIn: boolean;
};

const Profile = ({ loggedIn }: Props): ReactElement => {
  const { username } = useParams<Record<string, string | undefined>>();

  return (
    <ProfileContainer
      username={username ?? "OWN PROFILE"}
      loggedIn={loggedIn}
    />
  );
};

export default Profile;
