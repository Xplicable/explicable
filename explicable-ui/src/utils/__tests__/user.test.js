import { resolveProfilePhoto } from '../user';
import { DEFAULT_AVATAR } from '../../../constants/fallbacks';

describe('resolveProfilePhoto()', () => {
  it('returns custom photo if present', () => {
    const user = {
      profile: {
        profile_photo_url: 'https://example.com/avatar.jpg'
      }
    };
    expect(resolveProfilePhoto(user)).toBe('https://example.com/avatar.jpg');
  });

  it('returns Google picture if no custom photo is present', () => {
    const user = {
      profile: {
        picture: 'https://lh3.googleusercontent.com/example'
      }
    };
    expect(resolveProfilePhoto(user)).toBe('https://lh3.googleusercontent.com/example');
  });

  it('returns fallback avatar if no photo is present', () => {
    const user = { profile: {} };
    expect(resolveProfilePhoto(user)).toBe(DEFAULT_AVATAR);
  });

  it('returns fallback avatar if user is null', () => {
    expect(resolveProfilePhoto(null)).toBe(DEFAULT_AVATAR);
  });
});
