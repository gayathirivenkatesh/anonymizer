import React, { useState, useEffect } from "react";
import PreviewPanel from "../components/PreviewPanel";
import { Film } from "lucide-react";

export default function VideoAnonymizer() {
  const [videoFile, setVideoFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [anonymizedUrl, setAnonymizedUrl] = useState("");
  const [codec, setCodec] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (anonymizedUrl) URL.revokeObjectURL(anonymizedUrl);
    };
  }, [originalUrl, anonymizedUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setAnonymizedUrl("");
    setCodec("");
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const res = await fetch("http://anonymizer-rgr5.onrender.com/api/video/anonymize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errMsg = "Upload failed";
        try {
          const err = await res.json();
          if (err?.detail) errMsg = err.detail;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const codecHeader = res.headers.get("X-Video-Codec");
      if (codecHeader) setCodec(codecHeader);

      const blob = await res.blob();
      setAnonymizedUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error uploading video:", error);
      alert(`Video upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-gradient-to-br from-indigo-900 via-blue-950 to-black text-white font-sans">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-300 drop-shadow-lg flex items-center justify-center gap-3">
        <Film className="w-10 h-10 text-blue-400" />
        Video Anonymizer
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-10">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="px-6 py-3 rounded-xl border border-blue-400 bg-blue-900/40 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-white placeholder-gray-300 w-full md:w-auto"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !videoFile}
          className={`px-8 py-3 rounded-2xl font-semibold shadow-lg transition-transform duration-200 w-full md:w-auto ${
            loading || !videoFile
              ? "bg-blue-400/50 text-gray-900 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-cyan-400 text-gray-900 hover:scale-105"
          }`}
        >
          {loading ? "Processing..." : "Anonymize Video"}
        </button>
      </div>

      {/* Preview Panel */}
      {videoFile && (
        <div className="mt-6 space-y-6">
          <PreviewPanel type="video" before={originalUrl} after={anonymizedUrl} />

          {codec && (
            <div className="text-center text-sm text-blue-200 font-medium">
              Codec used: <span className="text-blue-100">{codec}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
