import React, { useState } from "react";
import PreviewPanel from "../components/PreviewPanel";
import { Upload, ShieldCheck, Loader2 } from "lucide-react";

export default function MetadataAnonymizer() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [anonymizedUrl, setAnonymizedUrl] = useState(null);
  const [metadataDetails, setMetadataDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://anonymizer-rgr5.onrender.com/api/metadata/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to anonymize metadata");

      const data = await res.json();
      setMetadataDetails(data.removed_metadata || []);

      let previewUrl = data.file;
      if (!data.file.startsWith("data:")) {
        const fileType = file.type || "image/png";
        previewUrl = `data:${fileType};base64,${data.file}`;
      }

      setAnonymizedUrl(previewUrl);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 rounded-3xl shadow-2xl backdrop-blur-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-center mb-10 text-green-300 drop-shadow-lg flex items-center justify-center gap-3">
        <ShieldCheck className="w-9 h-9 text-green-400" />
        Metadata Anonymizer
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-10">
        <label className="flex items-center gap-3 cursor-pointer bg-white/10 border border-white/20 hover:bg-white/20 transition p-4 rounded-xl text-white w-full md:w-auto">
          <Upload className="w-5 h-5 text-blue-400" />
          <span className="truncate max-w-[200px]">
            {file ? file.name : "Choose a file"}
          </span>
          <input
            type="file"
            onChange={(e) => {
              const selected = e.target.files[0];
              setFile(selected);
              setFileUrl(URL.createObjectURL(selected));
              setAnonymizedUrl(null);
              setMetadataDetails(null);
            }}
            hidden
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold shadow-lg transition-transform duration-200 w-full md:w-auto ${
            loading || !file
              ? "bg-green-400/50 text-gray-900 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-400 text-gray-900 hover:scale-105"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Anonymize Metadata
            </>
          )}
        </button>
      </div>

      {/* Preview Panel */}
      {file && (
        <div className="mt-6 space-y-6">
          <PreviewPanel
            type="metadata"
            before={fileUrl}
            after={anonymizedUrl}
            metadataDetails={metadataDetails}
          />
        </div>
      )}
    </div>
  );
}
