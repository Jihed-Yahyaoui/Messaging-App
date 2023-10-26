import { Box, Grid } from "@mui/material";

export default function MessageCard({ text }) {
  return (
    <Grid
      item
      sx={{
        maxWidth: "40%",
        padding: " 0.3rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
        wordBreak: "break-word",
      }}
    >
      <Box>{text}</Box>
    </Grid>
  );
}
