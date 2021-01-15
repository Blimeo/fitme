import styles from "./index.module.css";
import React, { ReactElement } from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Gender } from "../../util/util-types";
import { Typography } from "@material-ui/core";

type Props = {
  readonly value: Gender;
  readonly onChange: (_: React.MouseEvent<HTMLElement>, gender: Gender) => void;
};
const GenderToggleButtons = ({ value, onChange }: Props): ReactElement => {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={onChange}
      aria-label="Gender type"
      exclusive
      aria-required
      className={styles.ToggleButtons}
    >
      <ToggleButton value="Men" aria-label="MEN">
        <Typography>Men</Typography>
      </ToggleButton>
      <ToggleButton value="Women" aria-label="WOMEN">
        <Typography>Women</Typography>
      </ToggleButton>
      <ToggleButton value="Unisex" aria-label="UNISEX">
        <Typography>Unisex</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default GenderToggleButtons;
