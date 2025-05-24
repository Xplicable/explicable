import { DEFAULT_AVATAR } from "../constants/fallbacks";

interface UserProfile {
  profile_photo_url?: string;
  picture?: string;
}

interface User {
  profile?: UserProfile;
}

/**
 * Returns the user's profile photo URL with fallback logic.
 * @param user - Authenticated user object
 * @returns a valid avatar URL string
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
