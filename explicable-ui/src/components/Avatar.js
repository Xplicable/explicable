// components/Avatar.js
import React from "react";
import { DEFAULT_AVATAR } from "../constants/fallbacks";

const Avatar = ({ src, alt = "Avatar", ...props }) => {
  const imgSrc = src?.trim() ? src : DEFAULT_AVATAR;
  console.log("Rendering avatar:", imgSrc);
  return <img src={imgSrc} alt={alt} {...props} />;
};

export default Avatar;
