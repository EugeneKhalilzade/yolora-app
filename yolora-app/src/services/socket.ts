// ──────────────────────────────────────────────
// Yolora — Socket.IO Service
// ──────────────────────────────────────────────

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://10.0.2.2:3000';

let socket: Socket | null = null;

export const connectSocket = (userId: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connection error:', error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

export const emitLocationUpdate = (
  userId: string,
  latitude: number,
  longitude: number,
) => {
  socket?.emit('location_update', { userId, latitude, longitude });
};

export const emitHelperLocation = (
  requesterId: string,
  latitude: number,
  longitude: number,
) => {
  socket?.emit('helper_location', { requesterId, latitude, longitude });
};
