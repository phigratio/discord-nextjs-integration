// frontend/components/ClientProvider.js

'use client'; // Marks this component as a client component

import { SocketProvider } from '../contexts/SocketContext'; // Adjust the path if necessary

const ClientProvider = ({ children }) => {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
};

export default ClientProvider;
