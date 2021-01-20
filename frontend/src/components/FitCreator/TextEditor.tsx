import React, { useEffect } from "react";
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

type Props = {
  readonly value: any;
  readonly onChange: any;
};

type SearchResult = {
  readonly id: string;
  readonly name: string;
};

function TextEditor({ value, onChange }: Props) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  useEffect(() => {
    if (searchQuery) {
      fetch(`/item_search/${searchQuery}`, {
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
          options={
            searchQuery.length > 1
              ? [
                  `Create new item (item not in list): ${searchQuery}`,
                  ...searchResults.map((result) => result.name),
                ]
              : searchResults.map((result) => result.name)
          }
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
