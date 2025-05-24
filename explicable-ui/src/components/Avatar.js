// src/components/Avatar.js
import React from "react";
import { DEFAULT_AVATAR } from "../constants/fallbacks";

const Avatar = ({ src, alt = "Avatar", size = 36, ...props }) => {
  const fallback = DEFAULT_AVATAR;
  const imageSrc = src?.trim() ? src : fallback;

  console.log("Rendering avatar:", imageSrc);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        objectFit: "cover",
        backgroundColor: "#eee",
        cursor: "pointer",
      }}
      {...props}
    />
  );
};

export default Avatar;

