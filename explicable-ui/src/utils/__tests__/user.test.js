import { resolveProfilePhoto } from '../user';

describe('resolveProfilePhoto()', () => {
  it('returns custom photo if available', () => {
    const user = { profile: { profile_photo_url: 'custom.jpg' } };
    expect(resolveProfilePhoto(user)).toBe('custom.jpg');
  });

  it('falls back to Google picture', () => {
    const user = { profile: { picture: 'google.jpg' } };
    expect(resolveProfilePhoto(user)).toBe('google.jpg');
  });

  it('returns null when no photo found', () => {
    const user = { profile: {} };
    expect(resolveProfilePhoto(user)).toBeNull();
  });
});
