// src/utils/user.js
import { DEFAULT_AVATAR } from "../constants/fallbacks";

/**
 * Safely resolves a user's profile photo URL.
 * Falls back to DEFAULT_AVATAR if nothing valid is found.
 *
 * @param {object|null} user - The user object containing profile data
 * @returns {string} - A valid image URL
 */
export const resolveProfilePhoto = (user = null) => {
  if (!user || typeof user !== 'object' || !user.profile) {
    console.warn("resolveProfilePhoto: user or profile missing");
    return DEFAULT_AVATAR;
  }

  const customPhoto = user.profile?.profile_photo_url?.trim();
  const googlePhoto = user.profile?.picture?.trim();

  if (customPhoto) return customPhoto;
  if (googlePhoto) return googlePhoto;

  return DEFAULT_AVATAR;
};
