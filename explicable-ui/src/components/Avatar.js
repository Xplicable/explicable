/**
 * Avatar component with fallback logic.
 * Displays a circular image for the user, with support for size, alt text,
 * and fallback avatar if the image fails to load.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.src] - The source URL of the avatar image.
 * @param {string} [props.alt] - Alt text for the image.
 * @param {number} [props.size=36] - Size in pixels (width & height).
 * @returns {JSX.Element}
 */
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
