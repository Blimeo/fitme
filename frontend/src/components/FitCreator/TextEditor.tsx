import React, { useEffect, useState } from "react";
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
  readonly value: any;
  readonly onChange: any;
};

type SearchResult = {
  readonly id : string;
  readonly name : string;
}

function TextEditor({value, onChange}: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  useEffect(() => {
    if (searchQuery) {
      fetch("/item_search/" + searchQuery, {
        method: "GET",
      })
        .then((r) => r.json())
        .then((r) => {
          setSearchResults(r.items);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  return (
    <>
      <Inner>
        <Autocomplete
          id="combo-box-demo"
          options={searchResults.map((result) => result.name)}
          style={{ width: 300 }}
          freeSolo
          onChange={(_, value: any) => {
            onChange(value);
          }}
          onInputChange={(_, newInputValue) => {
            setSearchQuery(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for an item... "
              variant="outlined"
              value={value}
            />
          )}
        />
      </Inner>
    </>
  );
}

export default TextEditor;
