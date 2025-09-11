import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import TextAnonymizer from "./pages/TextAnonymizer";
import ImageAnonymizer from "./pages/ImageAnonymizer";
import MetadataAnonymizer from "./pages/MetadataAnonymizer";
import VideoAnonymizer from "./pages/VideoAnonymizer";  

export default function App() {
  const [page, setPage] = useState("dashboard");

  const navItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Text", key: "text" },
    { label: "Image", key: "image" },
    { label: "Metadata", key: "metadata" },
    { label: "Video", key: "video" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f2b] to-[#101632] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-md border-b border-gray-300 shadow-md sticky top-0 z-50">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
              ${
                page === item.key
                  ? "bg-blue-600 text-white border border-blue-600 shadow-lg"
                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 hover:shadow-md"
              }`}
            onClick={() => setPage(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {page === "dashboard" && <Dashboard />}
        {page === "text" && <TextAnonymizer />}
        {page === "image" && <ImageAnonymizer />}
        {page === "metadata" && <MetadataAnonymizer />}
        {page === "video" && <VideoAnonymizer />}
      </div>
    </div>
  );
}
