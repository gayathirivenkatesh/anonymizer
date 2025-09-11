import React, { useState } from "react";
import RegionSelector from "../components/RegionSelector";
import PreviewPanel from "../components/PreviewPanel";

export default function ImageAnonymizer() {
  const [file, setFile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [mode, setMode] = useState("blur");
  const [afterImage, setAfterImage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAfterImage(null);
  };

  const handleAnonymize = async () => {
    if (!file) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("regions", JSON.stringify(regions));
    formData.append("mode", mode);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/image/anonymize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to anonymize image");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAfterImage(url);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while anonymizing.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white p-10">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-400 drop-shadow mb-6 text-center">
        🖼️ Image Anonymizer
      </h2>
      <p className="text-gray-400 text-center mb-10">
        Upload an image, select regions, and choose your anonymization style.
      </p>

      {/* Upload Input */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <label className="cursor-pointer flex flex-col items-center gap-3 border-2 border-dashed border-indigo-500 bg-white/5 px-8 py-10 rounded-2xl shadow hover:border-sky-400 hover:bg-indigo-500/10 transition w-full max-w-lg">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <span className="text-5xl">📂</span>
          <span className="text-sm text-gray-300">
            {file ? (
              <span className="font-semibold text-sky-300">{file.name}</span>
            ) : (
              "Click to upload or drag & drop an image"
            )}
          </span>
        </label>

        {file && (
          <RegionSelector
            image={URL.createObjectURL(file)}
            onRegionsChange={setRegions}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-12">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-800 border border-indigo-400 text-indigo-200 shadow hover:border-sky-400 transition"
        >
          <option value="blur">🔮 Blur</option>
          <option value="pixelate">🟦 Pixelate</option>
        </select>

        <button
          onClick={handleAnonymize}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition transform"
        >
          🚀 Anonymize
        </button>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Before */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">Before</h3>
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="before"
              className="rounded-lg max-h-[400px] mx-auto shadow-md"
            />
          ) : (
            <p className="text-gray-500 italic">Upload an image first</p>
          )}
        </div>

        {/* After */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-emerald-300">After</h3>
          {afterImage ? (
            <>
              <img
                src={afterImage}
                alt="after"
                className="rounded-lg max-h-[400px] mx-auto shadow-md"
              />
              <a
                href={afterImage}
                download="anonymized.png"
                className="mt-4 inline-block px-4 py-2 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
              >
                ⬇ Download Result
              </a>
            </>
          ) : (
            <p className="text-gray-500 italic">Click anonymize to see results</p>
          )}
        </div>
      </div>
    </div>
  );
}
