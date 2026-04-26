import { useState, useEffect, useCallback } from 'react';
import {
  LocationCoords,
  requestLocationPermission,
  getCurrentPosition,
  watchPosition,
  clearWatch,
} from '../services/location';

export const useLocation = (enableWatch = false) => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return null;
      }
      const coords = await getCurrentPosition();
      setLocation(coords);
      return coords;
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    let id: number | null = null;
    
    if (enableWatch) {
      const setupWatch = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
          id = watchPosition(
            (coords) => setLocation(coords),
            (err) => setError(err.message || 'Failed to watch location')
          );
          setWatchId(id);
        }
      };
      setupWatch();
    }

    return () => {
      if (id !== null) {
        clearWatch(id);
      } else if (watchId !== null) {
        clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableWatch]);

  return { location, error, isLoading, fetchLocation };
};
