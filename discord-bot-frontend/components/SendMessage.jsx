// frontend/components/SendMessage.js

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PropTypes from 'prop-types'; // Optional: For prop type checking

const SendMessage = ({ channelId }) => {
  const [formData, setFormData] = useState({
    username: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const { username, message } = formData;

    // Basic validation
    if (!username || !message) {
      toast.error('Please fill in all required fields.');
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          message,
          channelId, // Ensure channelId is included
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message.');
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Message sent successfully.');
        // Reset form
        setFormData({
          username: '',
          message: '',
        });
      } else {
        throw new Error(data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Optional: Log channelId to verify it's received
  useEffect(() => {
    console.log('SendMessage component received channelId:', channelId);
  }, [channelId]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 rounded mb-2"
        required
      />

      <textarea
        placeholder="What do you want to say?"
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="border p-2 rounded mb-2"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded py-2"
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

// Optional: Define prop types for better type checking
SendMessage.propTypes = {
  channelId: PropTypes.string.isRequired,
};

export default SendMessage;
