import { Grid } from "@mui/material";
import MessageCard from "./MessageCard";
import FileCard from "./FileCard";

export default function MessageContainer({ msg, secondUserId }) {
  return (
    <Grid
      item
      container
      direction="row"
      sx={{
        width: "100%",
        justifyContent:
          msg.senderId === secondUserId ? "flex-start" : "flex-end",
        padding: "0.5rem",

        border: "1px solid #ccc",
      }}
    >
      {/* Message text container */}
      {msg.text && <MessageCard text={msg.text} />}

      {/* Message file container */}
      {msg.file && <FileCard file={msg.file} />}
    </Grid>
  );
}
