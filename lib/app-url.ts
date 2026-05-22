const PRODUCTION_APP_URL = 'https://finora-woad.vercel.app';
const LOCAL_APP_URL = 'http://localhost:3000';

function normalizeAppUrl(url: string) {
  return url.trim().replace(/\/+$/, '');
}

export function getAppUrl() {
  const configuredUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return normalizeAppUrl(configuredUrl);
  }

  return process.env.NODE_ENV === 'production' ? PRODUCTION_APP_URL : LOCAL_APP_URL;
}

export function getAppHostname() {
  try {
    return new URL(getAppUrl()).hostname;
  } catch {
    return undefined;
  }
}