import { ButtonBase, Card, CardContent, CardMedia, Divider } from "@mui/material";

export default function SearchResult({
  _id: id,
  firstname,
  lastname,
  profile_picture: photo,
}) {
  return (
    <ButtonBase sx={{ display: "block", width: "100%", fontSize: "1rem" }}>
      <Card
        onClick={() => {window.location.href=`message/${id}`}}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5em",
          textDecoration: "none",
        }}
      >
        <CardContent>{`${firstname} ${lastname}`}</CardContent>
        <CardMedia
          component="img"
          sx={{ width: "50px", borderRadius: "50%" }}
          image={photo || "/avatar.jpg"}
        />
      </Card>
      <Divider />
    </ButtonBase>
  );
}
