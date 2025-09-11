import React, { useState } from "react";

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="flex flex-col items-center gap-6 my-8 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg w-full max-w-md mx-auto border border-gray-200">
      
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 tracking-wide">
        Upload Your File
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Supported formats: JPG, PNG, MP4, PDF
      </p>

      {/* File Input */}
      <label className="cursor-pointer flex flex-col items-center gap-2 bg-white border-2 border-dashed border-indigo-400 text-indigo-600 font-medium px-6 py-10 rounded-2xl shadow-sm hover:bg-indigo-50 hover:border-indigo-600 transition relative w-full">
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <span className="text-4xl">📂</span>
        <span className="text-gray-700">
          {file ? (
            <span className="font-semibold text-indigo-700">{file.name}</span>
          ) : (
            "Click to browse or drag & drop"
          )}
        </span>
      </label>

      {/* Upload Button */}
      <button
        onClick={() => file && onUpload(file)}
        disabled={!file}
        className={`w-full px-6 py-3 rounded-xl font-semibold shadow-md transition-transform transform text-lg
          ${
            file
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-xl active:scale-95"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
      >
        🚀 Upload
      </button>

      {/* Small Note */}
      <p className="text-xs text-gray-400 italic mt-2">
        Your files are securely stored.
      </p>
    </div>
  );
}
