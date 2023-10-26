import { Box } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function FileUploadCard({ uniqueName, filename, removeFile }) {
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
          onClick={() => removeFile(uniqueName)}
        >
          &nbsp;x&nbsp;
        </Box>
        <InsertDriveFileIcon />
        <Box>{filename}</Box>
      </Box>
    );
  }
  