import { Box, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import { getData } from "../utils/fetch";
import InputBtn from "../components/InputBtn";
import FilesUploadBox from "../components/FilesUploadBox";
import MessageContainer from "../components/MessageContainer";
import { v4 as uuidv4 } from "uuid";

// Voice record and visualize https://mdn.github.io/dom-examples/media/web-dictaphone/
export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState(new FormData());
  const areFilesEmpty = !Array.from(files).length;
  
  const id = useSelector((state) => state.user.id); // User Id
  const secondUserId = useParams(id).id; // The second user id

  // Adds a message to the interface
  const addMessage = (newMessage) => {

      setMessages(messages => [newMessage, ...messages]);
  };

  // Sends messages and files and adds them to the interface
  const sendMessage = () => {
    const sentMessages = [];
    let newMessage = {};

    // Queue text message
    if (inputValue) {
      newMessage = { senderId: id, secondUserId, text: inputValue };
      sentMessages.push(newMessage);
    }

    // Save files
    if (!areFilesEmpty) {
      fetch(`${import.meta.env.VITE_SERVER_LINK}/file/${secondUserId}?senderId=${id}`, {
        method: "POST",
        body: files,
      }).then((res) => console.log(res));

      // Queue file messages
      for (let [filename, file] of files) {
        newMessage = {
          filename,
          originalname: file.name,
        };
        sentMessages.push({ senderId: id, secondUserId, file: newMessage });
      }
    }

    // Send Messages
    for (let i = 0; i < sentMessages.length; i++)
      socket.emit("message", sentMessages[i]);
    setMessages([...sentMessages.reverse(), ...messages]);

    // Reset input
    setInputValue("");
    setFiles(new FormData());
  };

  // Add one or many files (NO duplicates)
  // Copy files into a new object and assign each file a uuid
  const addFile = async () => {
    const selectedFiles = await window.showOpenFilePicker({ multiple: true });
    const readingFiles = new FormData();

    for (let [name, file] of files) readingFiles.append(name, file);

    for (let selectedFile of selectedFiles) {
      let file = await selectedFile.getFile();

      if (readingFiles.get(file.name)) {
        console.log("Duplicate file found!");
        return;
      }

      readingFiles.append(uuidv4(), file);
    }
    setFiles(readingFiles);
  };

  const removeFile = (filename) => {
    const readingFiles = new FormData();

    for (let [name, file] of files) readingFiles.append(name, file);

    readingFiles.delete(filename);
    setFiles(readingFiles);
  };

  // Add socket message listener
  useEffect(() => {
    socket.on("message", addMessage);

    return () => {
      socket.off("message", addMessage);
    };
  }); // Do not add dependency array even empty

  // Get messages from DB and add to the interface
  useEffect(() => {
    getData(`message/${secondUserId}?senderId=${id}`).then((res) => {
      setMessages(res.messages.reverse());
    });
  }, []);

  return (
    // The parent container
    <Grid
      container
      direction="column"
      sx={{ width: "50%", margin: "3rem auto" }}
    >
      {/* The message container */}
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
          position: "relative",
        }}
      >
        {/* Messages are mapped through and shown here */}
        {messages.map((msg, index) => (
          <MessageContainer key={index} msg={msg} secondUserId={secondUserId} />
        ))}
      </Grid>

      {/* A container for input and upload */}
      <Box sx={{ position: "relative", width: "100%" }}>
        {/* Upload Box */}
        <FilesUploadBox
          files={files}
          isEmpty={areFilesEmpty}
          addFile={addFile}
          removeFile={removeFile}
        />
        {/* Input Box */}
        <TextField
          value={inputValue}
          variant="outlined"
          autoComplete="false"
          sx={{
            width: "-webkit-fill-available",
            "& .MuiInputBase-root": {
              paddingRight: "6px",
            },
          }}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
          InputProps={{
            endAdornment: (
              // Send button and upload button
              <>
                {areFilesEmpty && (
                  <InputBtn onClick={addFile}>
                    <AttachFileIcon />
                  </InputBtn>
                )}
                <InputBtn onClick={sendMessage}>
                  <SendIcon />
                </InputBtn>
              </>
            ),
          }}
        />
      </Box>
    </Grid>
  );
}
