import React from "react";
import { ShieldCheck, Image, FileText, Video } from "lucide-react"; // ✅ Added Video icon
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex flex-col items-center p-12 overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-teal-200 mb-6 drop-shadow-md tracking-tight"
      >
        👑 Anonymizer Suite
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-gray-400 text-lg mb-16 max-w-2xl text-center leading-relaxed"
      >
        The <span className="text-indigo-200 font-semibold">next generation</span> of privacy tools.  
        Protect your <span className="text-sky-200 font-semibold">Text</span>,{" "}
        <span className="text-sky-200 font-semibold">Images</span>,{" "}
        <span className="text-sky-200 font-semibold">Metadata</span>, and{" "}
        <span className="text-sky-200 font-semibold">Videos</span> with confidence.
      </motion.p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl w-full">
        {[
          {
            title: "Text Anonymizer",
            desc: "Effortlessly strip away sensitive data from your documents with AI precision.",
            icon: <FileText className="mx-auto text-indigo-300 w-14 h-14 mb-6" />,
            gradient: "from-indigo-400/20 to-purple-400/10",
          },
          {
            title: "Image Anonymizer",
            desc: "Blur, mask, or hide private regions in photos with elegant accuracy.",
            icon: <Image className="mx-auto text-sky-300 w-14 h-14 mb-6" />,
            gradient: "from-sky-400/20 to-cyan-400/10",
          },
          {
            title: "Metadata Anonymizer",
            desc: "Wipe hidden metadata — EXIF, geotags, author details — leaving no trace.",
            icon: <ShieldCheck className="mx-auto text-emerald-300 w-14 h-14 mb-6" />,
            gradient: "from-emerald-400/20 to-teal-400/10",
          },
          {
            title: "Video Anonymizer",
            desc: "Automatically blur faces, license plates, or sensitive areas in videos with precision.",
            icon: <Video className="mx-auto text-pink-300 w-14 h-14 mb-6" />,
            gradient: "from-pink-400/20 to-rose-400/10",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.2, duration: 0.7 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className={`relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition-all duration-500`}
          >
            {/* Animated Gradient Border */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-30 animate-pulse`}
            ></div>
            <div className="relative">
              {card.icon}
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
