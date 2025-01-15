// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSocket } from "../contexts/SocketContext";
// import SendMessage from "./SendMessage";
// import { toast } from "sonner";

// const ChannelMessages = ({ selectedChannel }) => {
//   const { socket, joinChannel, leaveChannel } = useSocket();
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const previousChannelRef = useRef(null);

//   useEffect(() => {
//     if (!socket) return;

//     // If there was a previous channel, leave its room
//     if (
//       previousChannelRef.current &&
//       previousChannelRef.current !== selectedChannel.id
//     ) {
//       leaveChannel(previousChannelRef.current);
//     }

//     // Join the new channel's room
//     joinChannel(selectedChannel.id);
//     previousChannelRef.current = selectedChannel.id;

//     // Fetch existing messages from the backend
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages?channelId=${selectedChannel.id}`
//         );
//         const data = await response.json();

//         if (data.success) {
//           setMessages(data.messages);
//         } else {
//           throw new Error(data.message || "Failed to load messages.");
//         }
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//         setError(true);
//         toast.error(err.message || "Failed to load messages.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMessages();

//     // Listen for 'new-message' events
//     const handleNewMessage = (message) => {
//       setMessages((prevMessages) => [message, ...prevMessages]);
//     };

//     socket.on("new-message", handleNewMessage);

//     // Cleanup on component unmount or when selectedChannel changes
//     return () => {
//       socket.off("new-message", handleNewMessage);
//     };
//   }, [socket, selectedChannel, joinChannel, leaveChannel]);

//   // Optional: Clear messages when switching channels
//   useEffect(() => {
//     setMessages([]);
//     setIsLoading(true);
//   }, [selectedChannel]);

//   return (
//     <div className="flex flex-col flex-1">
//       <h2 className="text-2xl mb-4">#{selectedChannel.name} Channel</h2>

//       {/* Messages List */}
//       <div className="flex-1 overflow-y-auto mb-4">
//         {isLoading ? (
//           <p className="text-gray-600">Loading messages...</p>
//         ) : error ? (
//           <p className="text-red-500">Error loading messages.</p>
//         ) : messages.length === 0 ? (
//           <p className="text-gray-600">No messages in this channel.</p>
//         ) : (
//           messages.map((msg, index) => (
//             <div
//               key={index}
//               className="border p-4 rounded mb-4 bg-white shadow-md flex"
//             >
//               <img
//                 src={msg.avatar || "https://i.imgur.com/mDKlggm.png"} // Fallback avatar
//                 alt={msg.username}
//                 className="w-16 h-16 rounded-full mr-4"
//               />
//               <div className="flex-1">
//                 <div className="flex justify-between items-center">
//                   <p className="font-semibold text-lg">{msg.username}</p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(msg.timestamp).toLocaleString()}
//                   </p>
//                 </div>
//                 <p className="mt-2 text-gray-700">{msg.content}</p>
//                 <div className="mt-2 flex space-x-4 text-sm text-gray-500">
//                   <span>Guild: {msg.guild}</span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Send Message Form */}
//       <SendMessage channelId={selectedChannel.id} />
//     </div>
//   );
// };

// export default ChannelMessages;
"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../contexts/SocketContext";
import SendMessage from "./SendMessage";
import { toast } from "sonner";

const ChannelMessages = ({ selectedChannel }) => {
  const { socket, joinChannel, leaveChannel } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const previousChannelRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    if (
      previousChannelRef.current &&
      previousChannelRef.current !== selectedChannel.id
    ) {
      leaveChannel(previousChannelRef.current);
    }

    joinChannel(selectedChannel.id);
    previousChannelRef.current = selectedChannel.id;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages?channelId=${selectedChannel.id}`
        );
        const data = await response.json();

        if (data.success) {
          setMessages(data.messages);
        } else {
          throw new Error(data.message || "Failed to load messages.");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(true);
        toast.error(err.message || "Failed to load messages.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    const handleNewMessage = (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, selectedChannel, joinChannel, leaveChannel]);

  useEffect(() => {
    setMessages([]);
    setIsLoading(true);
  }, [selectedChannel]);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">#{selectedChannel.name}</h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 bg-white p-4 rounded-lg shadow">
        {isLoading ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : error ? (
          <p className="text-red-500">Error loading messages.</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600">No messages in this channel.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 border rounded-lg"
            >
              <img
                src={msg.avatar || "https://i.imgur.com/mDKlggm.png"}
                alt={msg.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{msg.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-700">{msg.content}</p>
                <p className="text-xs text-gray-500">Guild: {msg.guild}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <SendMessage channelId={selectedChannel.id} />
    </div>
  );
};

export default ChannelMessages;
