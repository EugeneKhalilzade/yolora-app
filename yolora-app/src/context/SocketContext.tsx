// ──────────────────────────────────────────────
// Yolora — Socket Context
// ──────────────────────────────────────────────

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../services/socket';
import { IncomingHelpRequest, AcceptedRequest } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  incomingRequests: IncomingHelpRequest[];
  acceptedRequest: AcceptedRequest | null;
  helperLocation: { latitude: number; longitude: number } | null;
  clearIncomingRequest: (id: string) => void;
  clearAcceptedRequest: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  incomingRequests: [],
  acceptedRequest: null,
  helperLocation: null,
  clearIncomingRequest: () => {},
  clearAcceptedRequest: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<IncomingHelpRequest[]>([]);
  const [acceptedRequest, setAcceptedRequest] = useState<AcceptedRequest | null>(null);
  const [helperLocation, setHelperLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const s = getSocket();
      if (s) {
        setIsConnected(s.connected);

        // Register event listeners once
        if (!s.hasListeners('new_help_request')) {
          s.on('new_help_request', (data: IncomingHelpRequest) => {
            console.log('📨 New help request:', data);
            setIncomingRequests((prev) => [data, ...prev]);
          });

          s.on('request_accepted', (data: AcceptedRequest) => {
            console.log('✅ Request accepted:', data);
            setAcceptedRequest(data);
          });

          s.on('helper_location', (data: { latitude: number; longitude: number }) => {
            setHelperLocation(data);
          });

          s.on('request_completed', (data: { requestId: string }) => {
            console.log('🏁 Request completed:', data.requestId);
            setAcceptedRequest(null);
            setHelperLocation(null);
          });

          s.on('connect', () => setIsConnected(true));
          s.on('disconnect', () => setIsConnected(false));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        socket: getSocket(),
        isConnected,
        incomingRequests,
        acceptedRequest,
        helperLocation,
        clearIncomingRequest,
        clearAcceptedRequest,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
