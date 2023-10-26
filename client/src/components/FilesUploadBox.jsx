import { Box, ButtonBase } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileUploadCard from "./FileUploadCard";

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

      {/* Loop through selected files */}
      {Array.from(files.entries()).map(([key, value]) => (
        <FileUploadCard
          key={key}
          uniqueName={key}
          filename={value.name}
          removeFile={removeFile}
        />
      ))}
    </Box>
  );
}
