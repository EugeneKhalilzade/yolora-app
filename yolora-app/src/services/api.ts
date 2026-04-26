// ──────────────────────────────────────────────
// Yolora — API Service
// ──────────────────────────────────────────────

import { AuthResponse, HelpRequest, HelpRequestCreated, NearbyUser } from '../types';

const BASE_URL = 'http://10.0.2.2:3000'; // Android emulator localhost

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const headers = (): Record<string, string> => {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    h['Authorization'] = `Bearer ${authToken}`;
  }
  return h;
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

// ─── Auth ────────────────────────────────────

export const apiRegister = async (
  email: string,
  password: string,
  displayName: string,
  role: string,
  disabilityType?: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, displayName, role, disabilityType }),
  });
  return handleResponse(response);
};

export const apiLogin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// ─── Users ───────────────────────────────────

export const apiGetNearbyUsers = async (
  latitude: number,
  longitude: number,
  radius?: number,
): Promise<NearbyUser[]> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  if (radius) params.append('radius', radius.toString());

  const response = await fetch(`${BASE_URL}/users/nearby?${params}`, {
    headers: headers(),
  });
  return handleResponse(response);
};

export const apiUpdateLocation = async (
  latitude: number,
  longitude: number,
): Promise<void> => {
  await fetch(`${BASE_URL}/users/location`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ latitude, longitude }),
  });
};

// ─── Help Requests ───────────────────────────

export const apiCreateHelpRequest = async (
  latitude: number,
  longitude: number,
  description?: string,
): Promise<HelpRequestCreated> => {
  const response = await fetch(`${BASE_URL}/help/request`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ latitude, longitude, description }),
  });
  return handleResponse(response);
};

export const apiAcceptHelpRequest = async (
  requestId: string,
  latitude: number,
  longitude: number,
): Promise<{ helpRequest: HelpRequest; helper: any }> => {
  const response = await fetch(`${BASE_URL}/help/accept/${requestId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ latitude, longitude }),
  });
  return handleResponse(response);
};

export const apiRejectHelpRequest = async (requestId: string): Promise<void> => {
  await fetch(`${BASE_URL}/help/reject/${requestId}`, {
    method: 'POST',
    headers: headers(),
  });
};

export const apiCompleteHelpRequest = async (
  requestId: string,
  rating?: number,
): Promise<void> => {
  await fetch(`${BASE_URL}/help/complete/${requestId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ rating }),
  });
};

export const apiGetActiveRequest = async (): Promise<HelpRequest | null> => {
  const response = await fetch(`${BASE_URL}/help/active`, {
    headers: headers(),
  });
  return handleResponse(response);
};

export const apiGetNearbyRequests = async (
  latitude: number,
  longitude: number,
): Promise<any[]> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  const response = await fetch(`${BASE_URL}/help/nearby?${params}`, {
    headers: headers(),
  });
  return handleResponse(response);
};
