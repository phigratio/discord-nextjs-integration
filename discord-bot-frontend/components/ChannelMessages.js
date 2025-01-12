// frontend/components/ChannelMessages.js

'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import SendMessage from './SendMessage';
import { toast } from 'sonner';

const ChannelMessages = ({ selectedChannel }) => {
  const { socket, joinChannel, leaveChannel } = useSocket();
  const [messages, setMessages] = useState([]);
  const previousChannelRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // If there was a previous channel, leave its room
    if (previousChannelRef.current && previousChannelRef.current !== selectedChannel.id) {
      leaveChannel(previousChannelRef.current);
    }

    // Join the new channel's room
    joinChannel(selectedChannel.id);
    previousChannelRef.current = selectedChannel.id;

    // Listen for 'new-message' events
    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    };

    socket.on('new-message', handleNewMessage);

    // Cleanup on component unmount or when selectedChannel changes
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, selectedChannel, joinChannel, leaveChannel]);

  // Optional: Clear messages when switching channels
  useEffect(() => {
    setMessages([]);
  }, [selectedChannel]);

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl mb-4">#{selectedChannel.name} Channel</h2>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 && <p className="text-gray-600">No messages in this channel.</p>}
        {messages.map((msg, index) => (
          <div key={index} className="border p-4 rounded mb-4 bg-white shadow-md flex">
            <img
              src={msg.avatar}
              alt={msg.username}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">{msg.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-gray-700">{msg.content}</p>
              <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                <span>Guild: {msg.guild}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Send Message Form */}
      <SendMessage channelId={selectedChannel.id} />
    </div>
  );
};

export default ChannelMessages;
