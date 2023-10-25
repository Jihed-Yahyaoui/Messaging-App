import { ButtonBase, InputAdornment } from "@mui/material";

export default function InputBtn({ onClick, children }) {
  return (
    <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={onClick}>
      <ButtonBase sx={{ padding: "0.4em" }}>
        {children}
      </ButtonBase>
    </InputAdornment>
  );
}
