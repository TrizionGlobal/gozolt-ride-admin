'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useAdminSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let socketInstance: Socket;

    const connectSocket = async () => {
      try {
        const res = await fetch('/api/auth/token');
        if (!res.ok) return;
        const { token } = await res.json();

        socketInstance = io(`${API_URL}/admin`, {
          auth: { token },
          transports: ['websocket'],
          autoConnect: true,
        });

        socketInstance.on('connect', () => {
          setConnected(true);
          console.log('[AdminSocket] Connected');
        });

        socketInstance.on('disconnect', () => {
          setConnected(false);
          console.log('[AdminSocket] Disconnected');
        });

        setSocket(socketInstance);
      } catch (err) {
        console.error('[AdminSocket] Error connecting:', err);
      }
    };

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return { socket, connected };
}
