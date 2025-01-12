// frontend/contexts/SocketContext.js

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.io client
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => newSocket.close();
  }, []);

  // Function to join a channel
  const joinChannel = (channelId) => {
    if (socket) {
      socket.emit('join-channel', channelId);
    }
  };

  // Function to leave a channel
  const leaveChannel = (channelId) => {
    if (socket) {
      socket.emit('leave-channel', channelId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinChannel, leaveChannel }}>
      {children}
    </SocketContext.Provider>
  );
};
