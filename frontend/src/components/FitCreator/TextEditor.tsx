import React from "react";
import styled from "styled-components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const Inner = styled.div`
  padding: 8px 16px;
  textarea {
    border: 0;
    font-size: 14px;
    margin: 6px 0;
    min-height: 60px;
    outline: 0;
  }
`;

const Button = styled.div`
  background: whitesmoke;
  border: 0;
  box-sizing: border-box;
  color: #363636;
  cursor: pointer;
  font-size: 1rem;
  margin: 0;
  outline: 0;
  padding: 8px 16px;
  text-align: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: background 0.21s ease-in-out;
  &:focus,
  &:hover {
    background: #eeeeee;
  }
`;

type Props = {
  readonly itemNames: any;
  readonly value: any;
  readonly onChange: any;
  readonly onSubmit: any;
};

function TextEditor({ itemNames, value, onChange, onSubmit }: Props) {
  return (
    <>
      <Inner>
        <Autocomplete
          id="combo-box-demo"
          options={itemNames}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for an item... "
              variant="outlined"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </Inner>
      {value && <Button onClick={onSubmit}>ok</Button>}
    </>
  );
}

export default TextEditor;
