// // frontend/app/layout.js

// import './globals.css';
// import ClientProvider from '../components/ClientProvider'; // We'll create this component

// export const metadata = {
//   title: 'Next.js Discord Integration',
//   description: 'Integrate Next.js with Discord using WebSockets',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <ClientProvider>
//           {children}
//         </ClientProvider>
//       </body>
//     </html>
//   );
// }
// app/layout.js

// import './globals.css';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'GitHub Projects Management',
//   description: 'Manage your GitHub Projects from your Next.js app.',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Additional head elements can be added here */}
//       </head>
//       <body className={inter.className}>
//         {/* Global Header */}
//         <header className="bg-gray-800 text-white p-4">
//           <h1 className="text-xl">GitHub Projects Manager</h1>
//         </header>

//         {/* Main Content */}
//         <main className="p-8">
//           {children}
//         </main>

//         {/* Global Footer */}
//         <footer className="bg-gray-800 text-white p-4 mt-auto">
//           <p>&copy; {new Date().getFullYear()} Your Company</p>
//         </footer>

//       </body>
//     </html>
//   );
// }

// frontend/app/layout.js

// "use client";

// import { SocketProvider } from "../contexts/SocketContext";

// import { Toaster } from "sonner";

// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <head>
//         <title>Discord Integration App</title>
//       </head>
//       <body>
//         <SocketProvider>
//           {children}
//           <Toaster position="top-right" />
//         </SocketProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import { SocketProvider } from "../contexts/SocketContext";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Discord Integration App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@latest/dist/tailwind.min.css"
        />
      </head>
      <body className="h-full bg-gray-100">
        <SocketProvider>
          <div className="flex flex-col h-full">
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
