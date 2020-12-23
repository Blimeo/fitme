import React, { ChangeEvent, useState } from "react";
import Button from "@material-ui/core/Button";
import styles from "./LoginDialogue.module.css";
import { Link } from "react-router-dom";
type props = {
  logged: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function LogoutButton({ logged }: props) {
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
