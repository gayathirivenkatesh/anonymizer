import React, { useState, useEffect } from "react";
import PreviewPanel from "../components/PreviewPanel";
import { Film } from "lucide-react";

const MAX_SIZE_MB = 20;

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
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > MAX_SIZE_MB) {
      alert(
        `Video size must be under ${MAX_SIZE_MB}MB`
      );
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (anonymizedUrl) URL.revokeObjectURL(anonymizedUrl);

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
      const res = await fetch(
        "https://anonymizer-rgr5.onrender.com/api/video/anonymize",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        let errorMessage = "Upload failed";

        try {
          const err = await res.json();
          errorMessage =
            err.detail || errorMessage;
        } catch {}

        throw new Error(errorMessage);
      }

      const codecHeader =
        res.headers.get("X-Video-Codec");

      if (codecHeader) {
        setCodec(codecHeader);
      }

      const blob = await res.blob();

      if (anonymizedUrl) {
        URL.revokeObjectURL(anonymizedUrl);
      }

      setAnonymizedUrl(
        URL.createObjectURL(blob)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Video processing failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-gradient-to-br from-indigo-900 via-blue-950 to-black text-white">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-300 flex items-center justify-center gap-3">
        <Film className="w-10 h-10 text-blue-400" />
        Video Anonymizer
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-10">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="px-6 py-3 rounded-xl border border-blue-400 bg-blue-900/40"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !videoFile}
          className={`px-8 py-3 rounded-2xl font-semibold ${
            loading || !videoFile
              ? "bg-blue-400/50 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-cyan-400 text-black"
          }`}
        >
          {loading
            ? "Processing..."
            : "Anonymize Video"}
        </button>
      </div>

      {videoFile && (
        <div className="space-y-6">
          <PreviewPanel
            type="video"
            before={originalUrl}
            after={anonymizedUrl}
          />

          {codec && (
            <div className="text-center text-sm">
              Codec Used: {codec}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
