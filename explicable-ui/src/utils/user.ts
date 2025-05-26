/**
 * Utility: resolveProfilePhoto
 *
 * Safely resolves the correct avatar image URL for a user object,
 * falling back to the Google profile photo or a default image.
 *
 * Used by the Avatar component.
 */

import { DEFAULT_AVATAR } from "../constants/fallbacks";

interface UserProfile {
  profile_photo_url?: string;
  picture?: string;
}

interface User {
  profile?: UserProfile;
}

/**
 * Resolves the profile photo URL from a user object, falling back to a default avatar.
 * 
 * @param {UserProfile} [user] - The user object containing profile data.
 * @returns {string | null} - The URL to use for the profile photo, or null if none found.
 */
export const resolveProfilePhoto = (user: User | null): string => {
  if (!user || !user.profile) {
    console.warn("resolveProfilePhoto: user or profile missing");
    return DEFAULT_AVATAR;
  }

  const customPhoto = user.profile.profile_photo_url?.trim();
  const googlePhoto = user.profile.picture?.trim();

  return customPhoto || googlePhoto || DEFAULT_AVATAR;
};
