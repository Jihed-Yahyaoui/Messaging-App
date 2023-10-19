import {
  Box,
  ButtonBase,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { getData } from "../utils/fetch";

export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const id = useSelector((state) => state.user.id); // User Id
  const secondUserId = useParams(id).id; // The second user id

  const addMessage = ({ text, senderId }) => {
    // Adds a message to the interface

    // Check if the sender belongs to the active users in the conversation
    if (senderId === secondUserId || senderId === id)
      setMessages([{ senderId, text }, ...messages]);
  };

  const sendMessage = () => {
    // Sends a message and adds it to the interface
    if (!inputVal) return;

    const newMsg = { senderId: id, secondUserId, text: inputVal };
    setMessages([newMsg, ...messages]);
    setInputVal("");

    socket.emit("message", newMsg);
  };

  // Add socket message listener
  useEffect(() => {
    socket.on("message", addMessage);

    return () => {
      socket.off("message", addMessage);
    };
  }); // Do not add dependency array even empty

  useEffect(() => {
    // Get messages from DB and add to the interface
    getData(`message/${secondUserId}?senderId=${id}`).then((res) => {
      setMessages(res.messages.reverse());
    });
  }, []);

  return (
    <Grid
      container
      direction="column"
      sx={{ width: "50%", margin: "3rem auto" }}
    >
      <Grid
        item
        container
        direction="column-reverse"
        wrap="nowrap"
        sx={{
          height: "30rem",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <Grid
            item
            container
            direction="row"
            key={index}
            sx={{
              width: "100%",
              justifyContent:
                msg.senderId === secondUserId ? "flex-start" : "flex-end",
              padding: "0.5rem",

              border: "1px solid #ccc",
            }}
          >
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
              <Box>{msg.text}</Box>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <TextField
        value={inputVal}
        variant="outlined"
        autoComplete="false"
        sx={{ "& .MuiInputBase-root": { paddingRight: "6px" } }}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ cursor: "pointer" }}
              onClick={sendMessage}
            >
              <ButtonBase>
                <SendIcon sx={{ margin: "0.4em" }} />
              </ButtonBase>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
