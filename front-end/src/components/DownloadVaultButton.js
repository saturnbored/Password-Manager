import { Button, Popover } from "@mui/material";
import { useState } from "react";
import DownloadPopup from "./DownloadPopup";

const DownloadVaultButton = () => {
  const [anchor, setAnchor] = useState(null);

  const handleClick = function (event) {
    console.log("download vault button was clicked");
    setAnchor(event.currentTarget);
  };

  return (
    <>
      <Button variant="contained" size="large" onClick={handleClick}>
        Download Vault
      </Button>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose = {() => {
            setAnchor(null);
        }}
      >
        <DownloadPopup />
      </Popover>
    </>
  );
};

export default DownloadVaultButton;
