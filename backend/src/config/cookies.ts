import type { CookieOptions, Response } from 'express';

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
): void {
  response.cookie(env.ACCESS_COOKIE_NAME, tokens.accessToken, accessCookieOptions());
  response.cookie(env.REFRESH_COOKIE_NAME, tokens.refreshToken, refreshCookieOptions());
}

export function clearAuthCookies(response: Response): void {
  const { maxAge: _accessMaxAge, ...accessClearOptions } = accessCookieOptions();
  const { maxAge: _refreshMaxAge, ...refreshClearOptions } = refreshCookieOptions();

  response.clearCookie(env.ACCESS_COOKIE_NAME, accessClearOptions);
  response.clearCookie(env.REFRESH_COOKIE_NAME, refreshClearOptions);
}
