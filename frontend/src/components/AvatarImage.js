import React, { useState, useEffect } from "react";
import { getProfilePictureUrl } from "../api/users";

function AvatarImage({ profilePicture, placeholder = "/placeholder.svg?height=40&width=40", ...props }) {
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    if (profilePicture) {
      const url = getProfilePictureUrl(profilePicture);
      console.log("Generated blob URL:", url);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [profilePicture]);

  return (
    <img
      src={blobUrl || placeholder}
      alt="User avatar"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = placeholder;
      }}
      {...props}
    />
  );
}

export default AvatarImage;
