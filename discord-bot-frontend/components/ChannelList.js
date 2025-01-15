// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// const ChannelList = ({ onSelectChannel }) => {
//   const [channels, setChannels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     const fetchChannels = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels`
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to fetch channels.");
//         }

//         const data = await response.json();

//         if (data.success) {
//           setChannels(data.channels);
//         } else {
//           throw new Error(data.message || "Failed to load channels.");
//         }
//       } catch (err) {
//         console.error("Error fetching channels:", err);
//         setError(true);
//         toast.error(err.message || "Failed to load channels.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChannels();
//   }, []);

//   if (loading) return <p className="text-gray-600">Loading channels...</p>;
//   if (error) return <p className="text-red-500">Error loading channels.</p>;

//   return (
//     <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
//       <h2 className="text-xl font-semibold mb-4">Channels</h2>
//       <ul>
//         {channels.map((channel) => (
//           <li
//             key={channel.id}
//             onClick={() => onSelectChannel(channel)}
//             className="cursor-pointer hover:bg-gray-700 p-2 rounded mb-2"
//           >
//             #{channel.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChannelList;
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const ChannelList = ({ onSelectChannel }) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch channels.");
        }

        const data = await response.json();

        if (data.success) {
          setChannels(data.channels);
        } else {
          throw new Error(data.message || "Failed to load channels.");
        }
      } catch (err) {
        console.error("Error fetching channels:", err);
        setError(true);
        toast.error(err.message || "Failed to load channels.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) return <p className="text-gray-600">Loading channels...</p>;
  if (error) return <p className="text-red-500">Error loading channels.</p>;

  return (
    <div className="w-72 bg-gray-900 text-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Channels</h2>
      <ul className="space-y-2">
        {channels.map((channel) => (
          <li
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className="cursor-pointer hover:bg-gray-800 p-2 rounded-md transition"
          >
            #{channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
