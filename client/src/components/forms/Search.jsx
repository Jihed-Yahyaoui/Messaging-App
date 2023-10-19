import {
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getData } from "../../utils/fetch";
import { useSelector } from "react-redux";
import SearchResult from "../searchResult";

export default function Search() {
  const [inputVal, setInputVal] = useState("");
  const [search, setSearch] = useState([]);

  // Json Web Tokens
  const tokens = useSelector((state) => {
    return {
      access_token: state.jwt.access_token,
      refresh_token: state.jwt.refresh_token,
    };
  });

  // Whenever user inputs, prepare a delayed request
  // Whenever a request is sent, pending requests are aborted
  useEffect(() => {
    const controller = new AbortController();

    const delayedRequest = setTimeout(() => {
      if (inputVal)
        getData("user/search/" + inputVal, tokens, controller.signal).then(
          ({ searchResult }) => setSearch(searchResult)
        );
    }, 500);

    if (!inputVal) setSearch([]);

    return () => {
      controller.abort();
      clearTimeout(delayedRequest);
    };
  }, [inputVal]);

  return (
    <Box sx={{ width: "max-content" }}>
      <TextField
        value={inputVal}
        variant="outlined"
        label="Search"
        onChange={(e) => setInputVal(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {inputVal && search.length !== 0
        ? search.map((user) => <SearchResult {...user}  key={user._id} />)
        : "no results"}
    </Box>
  );
}
