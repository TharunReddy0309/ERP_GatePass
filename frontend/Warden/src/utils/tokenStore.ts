import { Platform } from 'react-native';

// In-memory store (for Expo Go native)
let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _userId: string | null = null;

const isWeb = Platform.OS === 'web';

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  userId: string,
): Promise<void> {
  _accessToken = accessToken;
  _refreshToken = refreshToken;
  _userId = userId;
  if (isWeb) {
    localStorage.setItem('warden_access_token', accessToken);
    localStorage.setItem('warden_refresh_token', refreshToken);
    localStorage.setItem('warden_user_id', userId);
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (isWeb) return localStorage.getItem('warden_access_token');
  return _accessToken;
}

export async function getUserId(): Promise<string | null> {
  if (isWeb) return localStorage.getItem('warden_user_id');
  return _userId;
}

export async function clearTokens(): Promise<void> {
  _accessToken = null;
  _refreshToken = null;
  _userId = null;
  if (isWeb) {
    localStorage.removeItem('warden_access_token');
    localStorage.removeItem('warden_refresh_token');
    localStorage.removeItem('warden_user_id');
  }
}
