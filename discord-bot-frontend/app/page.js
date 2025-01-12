// // frontend/app/page.js

// 'use client';

// import { useState } from 'react';
// import ChannelList from '../components/ChannelList';
// import ChannelMessages from '../components/ChannelMessages';
// import { SocketProvider } from '../contexts/SocketContext';
// import { Toaster } from 'sonner'; // Assuming you're using sonner for toast notifications

// const HomePage = () => {
//   const [selectedChannel, setSelectedChannel] = useState(null);

//   const handleSelectChannel = (channel) => {
//     setSelectedChannel(channel);
//   };

//   return (
//     <SocketProvider>
//       <Toaster />
//       <div className="flex h-screen">
//         <ChannelList onSelectChannel={handleSelectChannel} />
//         {selectedChannel ? (
//           <ChannelMessages selectedChannel={selectedChannel} />
//         ) : (
//           <div className="flex-1 flex items-center justify-center">
//             <p className="text-gray-600">Select a channel to view messages.</p>
//           </div>
//         )}
//       </div>
//     </SocketProvider>
//   );
// };

// export default HomePage;
// app/page.js

'use client';

import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">GitHub Projects Management</h1>
      <CreateProject />
      <ProjectList />
    </div>
  );
};

export default HomePage;
