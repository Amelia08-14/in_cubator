import type { CookieOptions, Response } from 'express';

import { cookieNamesFor, type AuthRealm } from './realm.js';
import { env } from './env.js';

const sharedCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
});

export const accessCookieOptions = (): CookieOptions => ({
  ...sharedCookieOptions(),
  path: '/',
  maxAge: env.JWT_ACCESS_TTL_SECONDS * 1_000,
});

export const refreshCookieOptions = (): CookieOptions => ({
  ...sharedCookieOptions(),
  path: env.REFRESH_COOKIE_PATH,
  maxAge: env.JWT_REFRESH_TTL_SECONDS * 1_000,
});

export function setAuthCookies(
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
  realm: AuthRealm = 'member',
): void {
  const names = cookieNamesFor(realm);
  response.cookie(names.access, tokens.accessToken, accessCookieOptions());
  response.cookie(names.refresh, tokens.refreshToken, refreshCookieOptions());
}

export function clearAuthCookies(response: Response, realm: AuthRealm = 'member'): void {
  const { maxAge: _accessMaxAge, ...accessClearOptions } = accessCookieOptions();
  const { maxAge: _refreshMaxAge, ...refreshClearOptions } = refreshCookieOptions();
  const names = cookieNamesFor(realm);

  response.clearCookie(names.access, accessClearOptions);
  response.clearCookie(names.refresh, refreshClearOptions);
}
