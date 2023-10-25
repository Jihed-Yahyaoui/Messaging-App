import { Box, ButtonBase } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function FileCard({ name, removeFile }) {
  return (
    <Box
      sx={{
        backgroundColor: "#ddd",
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: "-7px",
          top: "-7px",
          borderRadius: "15px",
          backgroundColor: "#bbb",
          cursor: "pointer",
          width: "1.3rem",
          aspectRatio: "1/1",
          textAlign: "center",
          transition: "all 0.25s",
          "&:hover": {
            backgroundColor: "#999",
          },
        }}
        onClick={() => removeFile(name)}
      >
        &nbsp;x&nbsp;
      </Box>
      <InsertDriveFileIcon />
      <Box>{name}</Box>
    </Box>
  );
}

export default function FilesUploadBox({
  files,
  isEmpty,
  addFile,
  removeFile,
}) {
  if (isEmpty) return <></>;
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "100%",
        backgroundColor: "white",
        left: "2px",
        right: "20px", // Scrollbar width, to be set later
        overflowX: "auto",
        overflowY: "hidden",
        height: "5rem",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
      }}
    >
      <ButtonBase>
        <AddCircleIcon sx={{ fontSize: "36px" }} onClick={addFile} />
      </ButtonBase>
      {Array.from(files.values()).map((file) => (
        <FileCard key={file.name} name={file.name} removeFile={removeFile} />
      ))}
    </Box>
  );
}
