// ──────────────────────────────────────────────
// Yolora — Location Service
// ──────────────────────────────────────────────

import { PermissionsAndroid, Platform } from 'react-native';

// Note: In production, use react-native-geolocation-service
// This is a wrapper that works with both the native module and fallback

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Yolora Location Permission',
          message:
            'Yolora needs access to your location to connect you with nearby helpers.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }
  return true;
};

export const getCurrentPosition = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    // Try native geolocation first
    try {
      const Geolocation = require('react-native-geolocation-service').default;
      Geolocation.getCurrentPosition(
        (position: any) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error: any) => {
          console.warn('Geolocation error, using fallback:', error.message);
          // Fallback: Baku, Azerbaijan coordinates for demo
          resolve({
            latitude: 40.4093,
            longitude: 49.8671,
            accuracy: 100,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch {
      // Module not available, use fallback
      resolve({
        latitude: 40.4093,
        longitude: 49.8671,
        accuracy: 100,
      });
    }
  });
};

export const watchPosition = (
  onUpdate: (coords: LocationCoords) => void,
  onError?: (error: any) => void,
): number | null => {
  try {
    const Geolocation = require('react-native-geolocation-service').default;
    return Geolocation.watchPosition(
      (position: any) => {
        onUpdate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error: any) => {
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
      },
    );
  } catch {
    return null;
  }
};

export const clearWatch = (watchId: number | null) => {
  if (watchId !== null) {
    try {
      const Geolocation = require('react-native-geolocation-service').default;
      Geolocation.clearWatch(watchId);
    } catch {
      // Module not available
    }
  }
};
