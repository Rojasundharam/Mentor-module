export const authConfig = {
  authServerUrl: process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'https://auth.jkkn.ai',
  clientId: process.env.NEXT_PUBLIC_APP_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/callback',
  apiKey: process.env.API_KEY || '',
  scopes: 'read write profile',
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes buffer before token expiry
} as const;

export type AuthConfig = typeof authConfig;
