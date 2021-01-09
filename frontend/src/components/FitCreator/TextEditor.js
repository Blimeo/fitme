import React from "react";
import styled, { keyframes } from "styled-components";
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

function TextEditor(props) {
  return (
    <React.Fragment>
      <Inner>
        <Autocomplete
          id="combo-box-demo"
          options={props.itemNames}
          getOptionLabel={(option) => option}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for an item... "
              variant="outlined"
              value={props.value} //i think this is wrong
              onChange={props.onChange}
            />
          )}
        />
      </Inner>
      {props.value && <Button onClick={props.onSubmit}>ok</Button>}
    </React.Fragment>
  );
}

export default TextEditor;
