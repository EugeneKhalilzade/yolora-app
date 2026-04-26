// ──────────────────────────────────────────────
// Yolora — Type Definitions
// ──────────────────────────────────────────────

export enum UserRole {
  DISABLED = 'disabled',
  ABLE = 'able',
}

export enum DisabilityType {
  BLIND = 'blind',
  DEAF = 'deaf',
  WHEELCHAIR = 'wheelchair',
}

export enum HelpRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  disabilityType: DisabilityType | null;
  isOnline: boolean;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface NearbyUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  distance: number;
}

export interface HelpRequest {
  id: string;
  requesterId: string;
  helperId: string | null;
  status: HelpRequestStatus;
  requesterLatitude: number;
  requesterLongitude: number;
  helperLatitude: number | null;
  helperLongitude: number | null;
  description: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  requester?: User;
  helper?: User;
}

export interface HelpRequestCreated {
  helpRequest: HelpRequest;
  nearbyHelpers: NearbyUser[];
  nearbyCount: number;
}

export interface IncomingHelpRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  disabilityType: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface AcceptedRequest {
  requestId: string;
  helperId: string;
  helperName: string;
  helperLatitude: number;
  helperLongitude: number;
}

// Voice command types
export interface VoiceCommand {
  keywords: string[];
  action: () => void;
  description: string;
}

// Navigation param types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type DisabledStackParamList = {
  DisabledHome: undefined;
  RequestHelp: undefined;
  Tracking: { requestId: string };
};

export type AbleStackParamList = {
  AbleHome: undefined;
  HelpRequests: undefined;
  Navigate: { requestId: string; requesterLatitude: number; requesterLongitude: number };
};
