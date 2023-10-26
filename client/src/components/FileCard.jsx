import { ButtonBase, Grid } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

export default function FileCard({ file }) {
  const { originalname, filename } = file;
  return (
    <Grid
      item
      container
      direction="row"
      component="a"
      target="_blank"
      href={`${import.meta.env.VITE_SERVER_LINK}/file/${filename}?filename=${originalname}`}
      download={originalname}
      sx={{
        maxWidth: "40%",
        border: "1px solid #ccc",
        borderRadius: "10px",
        wordBreak: "break-word",
        color: "black",
        textDecoration: "underline",
      }}
    >
      <ButtonBase sx={{ padding: "5px" }}>
        <Grid item>
          <DescriptionIcon />
        </Grid>
        <Grid item>{originalname}</Grid>
      </ButtonBase>
    </Grid>
  );
}
