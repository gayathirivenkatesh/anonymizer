import React, { useState } from "react";
import PreviewPanel from "../components/PreviewPanel";

export default function TextAnonymizer() {
  const [originalText, setOriginalText] = useState("");
  const [anonymizedText, setAnonymizedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnonymize = async (text) => {
    if (!text) {
      setAnonymizedText("");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://anonymizer-rgr5.onrender.com/api/text/anonymize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAnonymizedText(data.anonymized);
    } catch (err) {
      console.error("Anonymization error:", err);
      setAnonymizedText("Error anonymizing text.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setOriginalText(val);
    handleAnonymize(val);
  };

  return (
    <div
      className="min-h-screen p-10 font-sans"
      style={{
        background: "linear-gradient(135deg, #1a1a1a, #0d0d0d)",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0%, transparent 40%)," +
          "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 40%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-3xl mx-auto p-10 rounded-2xl shadow-2xl backdrop-blur-md bg-gray-900/85 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 text-teal-400 drop-shadow-md">
          Text Anonymizer
        </h2>

        <textarea
          rows={6}
          placeholder="Type or paste your text here..."
          value={originalText}
          onChange={handleChange}
          className="w-full p-6 mb-8 rounded-xl border border-teal-400 bg-gray-800/70 shadow-inner text-white text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />

        <div className="text-center mb-10">
          <button
            onClick={() => handleAnonymize(originalText)}
            disabled={loading}
            className={`px-10 py-3 rounded-2xl font-semibold shadow-lg transition-transform duration-200 ${
              loading
                ? "bg-teal-400/50 text-gray-900 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:scale-105"
            }`}
          >
            {loading ? "Anonymizing..." : "Anonymize Text"}
          </button>
        </div>

        <PreviewPanel
          type="text"
          before={originalText}
          after={anonymizedText}
        />
      </div>
    </div>
  );
}
