import React from "react";
import Button from "@material-ui/core/Button";
import styles from "./LoginDialogue.module.css";

type Props = {
  readonly logged: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LogoutButton({ logged }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logged(false);
  };
  return (
    <div>
      <Button className={styles.loginButton} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
