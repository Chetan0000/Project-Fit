/**
 * Username rules for the onboarding profile.
 *
 * Pure domain logic: no React or React Native imports, so this is trivially
 * unit-testable and safe to reuse from any layer.
 */

/** Letters, numbers and underscores only (matches the mockup's hint). */
export const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 20;

/** Removes characters the user shouldn't be able to keep typing (spaces). */
export function sanitizeUsername(raw: string): string {
  return raw.replace(/\s/g, "");
}

/** True when `name` meets the length and character requirements. */
export function isValidUsername(name: string): boolean {
  return name.length >= USERNAME_MIN_LENGTH && USERNAME_RE.test(name);
}
