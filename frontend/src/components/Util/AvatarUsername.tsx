import { Typography, Avatar } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../util/util-types";
import styles from "./AvatarUsername.module.css";

type Props = {
  readonly username: string;
};

const AvatarUsername = ({ username }: Props): ReactElement => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    fetch(`/profile_data?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        const user = data as User;
        if (user) {
          setAvatarUrl(user.avatar);
        }
      });
  }, [username]);
  if (avatarUrl === "") {
    return (
      <>
        <Link to={`/user/${username}`} className={styles.Link}>
          <Typography>{username}</Typography>
        </Link>
      </>
    );
  } else {
    return (
      <div className={styles.Container}>
        <Avatar src={avatarUrl} />
        <Link to={`/user/${username}`} className={styles.Link}>
          <Typography className={styles.Text}>{username}</Typography>
        </Link>
      </div>
    );
  }
};

export default AvatarUsername;
