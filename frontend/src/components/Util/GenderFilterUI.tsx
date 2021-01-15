import React, { ReactElement } from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Typography, withStyles } from "@material-ui/core";
import { Gender } from "../../util/util-types";

type Props = {
  readonly genderFilter: readonly string[];
  readonly handleGenderFilter: (
    _: React.MouseEvent<HTMLElement>,
    genders: Gender[]
  ) => void;
};

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

const GenderFilterUI = ({
  genderFilter,
  handleGenderFilter,
}: Props): ReactElement => {
  return (
    <StyledToggleButtonGroup
      size="large"
      value={genderFilter}
      onChange={handleGenderFilter}
      aria-label="Filter by gender"
    >
      <ToggleButton value="MEN">
        <Typography>MEN</Typography>
      </ToggleButton>
      <ToggleButton value="WOMEN">
        <Typography>WOMEN</Typography>
      </ToggleButton>
      <ToggleButton value="UNISEX">
        <Typography>UNISEX</Typography>
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default GenderFilterUI;
