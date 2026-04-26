import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { emitHelperLocation, emitLocationUpdate, getSocket } from '../services/socket';
import {
  apiAcceptHelpRequest,
  apiCompleteHelpRequest,
  apiCreateHelpRequest,
  apiRejectHelpRequest,
} from '../services/api';
import {
  AcceptedRequest,
  HelpRequest,
  HelpRequestCreated,
  IncomingHelpRequest,
} from '../types';
import { AuthContext } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  incomingRequests: IncomingHelpRequest[];
  acceptedRequest: AcceptedRequest | null;
  helperLocation: { latitude: number; longitude: number } | null;
  userLocations: Record<string, { latitude: number; longitude: number }>;
  requestHelp: (payload: {
    latitude: number;
    longitude: number;
    description?: string;
  }) => Promise<HelpRequestCreated>;
  acceptHelpRequest: (
    requestId: string,
    location: { latitude: number; longitude: number },
  ) => Promise<{ helpRequest: HelpRequest; helper: { id: string; displayName: string; latitude: number; longitude: number } }>;
  rejectHelpRequest: (requestId: string) => Promise<void>;
  completeHelpRequest: (requestId: string, rating?: number) => Promise<void>;
  sendLocationUpdate: (location: { latitude: number; longitude: number }) => void;
  sendHelperLocation: (
    requesterId: string,
    location: { latitude: number; longitude: number },
  ) => void;
  clearIncomingRequest: (id: string) => void;
  clearAcceptedRequest: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  incomingRequests: [],
  acceptedRequest: null,
  helperLocation: null,
  userLocations: {},
  requestHelp: async () => {
    throw new Error('Socket context not ready');
  },
  acceptHelpRequest: async () => {
    throw new Error('Socket context not ready');
  },
  rejectHelpRequest: async () => {},
  completeHelpRequest: async () => {},
  sendLocationUpdate: () => {},
  sendHelperLocation: () => {},
  clearIncomingRequest: () => {},
  clearAcceptedRequest: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<IncomingHelpRequest[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<AcceptedRequest | null>(null);
  const [helperLocation, setHelperLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userLocations, setUserLocations] = useState<
    Record<string, { latitude: number; longitude: number }>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      setSocket(getSocket());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleNewHelpRequest = (data: IncomingHelpRequest) => {
      setIncomingRequests((prev) => {
        if (prev.some((request) => request.id === data.id)) {
          return prev;
        }
        return [data, ...prev];
      });
    };
    const handleRequestAccepted = (data: AcceptedRequest) => {
      setAcceptedRequest(data);
    };
    const handleHelperLocation = (data: { latitude: number; longitude: number }) => {
      setHelperLocation(data);
    };
    const handleRequestCompleted = () => {
      setAcceptedRequest(null);
      setHelperLocation(null);
    };
    const handleUserLocationChanged = (data: {
      userId: string;
      latitude: number;
      longitude: number;
    }) => {
      setUserLocations((prev) => ({
        ...prev,
        [data.userId]: { latitude: data.latitude, longitude: data.longitude },
      }));
    };

    setIsConnected(socket.connected);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_help_request', handleNewHelpRequest);
    socket.on('request_accepted', handleRequestAccepted);
    socket.on('helper_location', handleHelperLocation);
    socket.on('request_completed', handleRequestCompleted);
    socket.on('user_location_changed', handleUserLocationChanged);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_help_request', handleNewHelpRequest);
      socket.off('request_accepted', handleRequestAccepted);
      socket.off('helper_location', handleHelperLocation);
      socket.off('request_completed', handleRequestCompleted);
      socket.off('user_location_changed', handleUserLocationChanged);
    };
  }, [socket]);

  const requestHelp = useCallback(
    async (payload: { latitude: number; longitude: number; description?: string }) => {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      return apiCreateHelpRequest(payload.latitude, payload.longitude, payload.description);
    },
    [user],
  );

  const acceptHelpRequest = useCallback(
    async (
      requestId: string,
      location: { latitude: number; longitude: number },
    ) => {
      const response = await apiAcceptHelpRequest(
        requestId,
        location.latitude,
        location.longitude,
      );
      setIncomingRequests((prev) => prev.filter((request) => request.id !== requestId));
      return response;
    },
    [],
  );

  const rejectHelpRequest = useCallback(async (requestId: string) => {
    await apiRejectHelpRequest(requestId);
    setIncomingRequests((prev) => prev.filter((request) => request.id !== requestId));
  }, []);

  const completeHelpRequest = useCallback(async (requestId: string, rating?: number) => {
    await apiCompleteHelpRequest(requestId, rating);
  }, []);

  const sendLocationUpdate = useCallback(
    (location: { latitude: number; longitude: number }) => {
      if (!user) {
        return;
      }
      emitLocationUpdate(user.id, location.latitude, location.longitude);
    },
    [user],
  );

  const sendHelperLocation = useCallback(
    (requesterId: string, location: { latitude: number; longitude: number }) => {
      emitHelperLocation(requesterId, location.latitude, location.longitude);
    },
    [],
  );

  const clearIncomingRequest = useCallback((id: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAcceptedRequest = useCallback(() => {
    setAcceptedRequest(null);
    setHelperLocation(null);
  }, []);

  return (
      <SocketContext.Provider
      value={{
        socket,
        isConnected,
        incomingRequests,
        acceptedRequest,
        helperLocation,
        userLocations,
        requestHelp,
        acceptHelpRequest,
        rejectHelpRequest,
        completeHelpRequest,
        sendLocationUpdate,
        sendHelperLocation,
        clearIncomingRequest,
        clearAcceptedRequest,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
