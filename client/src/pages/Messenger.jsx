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

export default function Messenger() {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [files, setFiles] = useState(new FormData());
  const areFilesEmpty = files.keys().next().done;

  const id = useSelector((state) => state.user.id); // User Id
  const secondUserId = useParams(id).id; // The second user id

  // Adds a message to the interface
  const addMessage = ({ text, senderId }) => {
    if (senderId === secondUserId || senderId === id)
      setMessages([{ senderId, text }, ...messages]);
  };

  // Sends messages and files and adds them to the interface
  const sendMessage = () => {
    if (inputVal) {
      const newMsg = { senderId: id, secondUserId, text: inputVal };
      setMessages([newMsg, ...messages]);
      setInputVal("");

      socket.emit("message", newMsg);
    }

    if (!areFilesEmpty) {
      fetch(`http://localhost:5000/file/${secondUserId}?senderId=${id}`, {
        method: "POST",
        body: files,
      }).then((res) => console.log(res));

      // eslint-disable-next-line no-unused-vars
      for (let [filename, file] of files) {
        const newFile = { senderId: id, secondUserId, filename, mimetype: file.type };
        socket.emit("message", newFile);
      }
    }
  };

  // Add one or many files (NO duplicates)
  const addFile = async () => {
    const selectedFiles = await window.showOpenFilePicker({ multiple: true });
    const readingFiles = new FormData();

    // eslint-disable-next-line no-unused-vars
    for (let [name, file] of files) readingFiles.append(name, file);

    for (let selectedFile of selectedFiles) {
      let file = await selectedFile.getFile();
      if (readingFiles.get(file.name)) {
        console.log("Duplicate file found!");
        return;
      }
      readingFiles.append(file.name, file);
    }
    setFiles(readingFiles);
  };

  const removeFile = (filename) => {
    const readingFiles = new FormData();

    // eslint-disable-next-line no-unused-vars
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

  useEffect(() => {
    // Get messages from DB and add to the interface
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
          // Message container
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
            {/* Message text container */}
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
          value={inputVal}
          variant="outlined"
          autoComplete="false"
          sx={{
            width: "-webkit-fill-available",
            "& .MuiInputBase-root": {
              paddingRight: "6px",
            },
          }}
          onChange={(e) => setInputVal(e.target.value)}
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
