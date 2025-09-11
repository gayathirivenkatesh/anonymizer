import React from "react";

export default function PreviewPanel({
  type,
  before,
  after,
  metadataDetails = {},
}) {
  const wrap = { display: "flex", gap: "20px", marginTop: "20px" };
  const col = {
    flex: 1,
    textAlign: "center",
    padding: "12px",
    borderRadius: "10px",
    maxHeight: "480px",
    overflow: "auto",
  };

  // 🎨 Type-specific styles
  const typeStyles = {
    text: {
      background: "#fdf6e3",
      border: "1px solid #eee",
      fontFamily: "monospace",
      textAlign: "left",
      whiteSpace: "pre-wrap",
    },
    image: {
      background: "#111",
      border: "2px solid #333",
    },
    metadata: {
      background: "#f9fafb",
      border: "1px solid #ddd",
      textAlign: "left",
    },
  };

  const renderMedia = (media, placeholder, label) => {
    if (!media) return <div style={{ color: "#888" }}>{placeholder}</div>;

    switch (type) {
      case "text":
  return (
    <div>
      <div
        style={{
          ...typeStyles.text,
          borderRadius: "6px",
          padding: "12px",
          fontSize: "14px",
          lineHeight: "1.5",
          backgroundColor: label === "Before" ? "#1e293b" : "#0f172a", // ✅ dark bg for both
          color: "#f1f5f9", // ✅ light text for contrast
          whiteSpace: "pre-wrap", // keep line breaks
          wordWrap: "break-word", // wrap long text
        }}
      >
        {media}
      </div>

      {/* ✅ Download Button (AFTER only) */}
      {label === "After" && (
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(media)}`}
          download="anonymized-text.txt"
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#16a34a",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "13px",
          }}
        >
          ⬇ Download Anonymized Text
        </a>
      )}
    </div>
  );


      case "image":
        return (
          <div style={{ ...typeStyles.image, borderRadius: "8px", padding: "8px" }}>
            <img
              src={media}
              alt={type}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                transition: "transform 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* ✅ Download Button (AFTER only) */}
            {label === "After" && (
              <a
                href={media}
                download="anonymized-image.png"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                ⬇ Download Anonymized Image
              </a>
            )}
          </div>
        );

      case "metadata":
  const isImage =
    media &&
    (media.startsWith("data:image") ||
      media.startsWith("blob:") ||
      media.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i));

  return (
    <div
      style={{
        ...typeStyles.metadata,
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Show file/image preview */}
      {isImage ? (
        <img
          src={media}
          alt={label}
          style={{
            maxWidth: "100%",
            maxHeight: "250px",
            borderRadius: "6px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        />
      ) : (
        <div
          style={{
            padding: "16px",
            border: "1px dashed #ccc",
            borderRadius: "6px",
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          📄 {label === "After" ? "Anonymized File Ready" : "Original File"}
        </div>
      )}

      {/* ✅ Download + Metadata only for AFTER */}
      {label === "After" && (
        <div style={{ width: "100%", marginTop: "12px" }}>
          {media && (
            <a
              href={media}
              download="anonymized-file"
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px 14px",
                backgroundColor: "#16a34a",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ⬇ Download Anonymized File
            </a>
          )}

          {metadataDetails && metadataDetails.length > 0 && (
            <div
              style={{
                marginTop: "12px",
                background: "#fff",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#333",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h5 style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
                🗑 Removed Metadata:
              </h5>
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                {metadataDetails.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  case "video":
  return (
    <div style={{ textAlign: "center" }}>
      {media ? (
        <>
          <video
            key={media} // 🔑 ensures video reloads if new blob URL
            src={media}
            controls
            autoPlay // ▶ start playback automatically
            loop     // 🔁 replay continuously
            muted    // 🔇 avoid autoplay being blocked by browser
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          ></video>

          {/* ✅ Download Button (AFTER only) */}
          {label === "After" && (
            <a
              href={media}
              download="anonymized-video.mp4"
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "8px 12px",
                backgroundColor: "#16a34a",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              ⬇ Download Anonymized Video
            </a>
          )}
        </>
      ) : (
        <div style={{ color: "#888" }}>
          {placeholder || "Upload a video first"}
        </div>
      )}
    </div>
  );


      default:
        return null;
    }
  };

  return (
    <div style={wrap}>
      <div style={col}>
        <h4>Before</h4>
        {renderMedia(before, `Upload a ${type} first`, "Before")}
      </div>
      <div style={col}>
        <h4>After</h4>
        {renderMedia(after, `Click Anonymize to see result`, "After")}
      </div>
    </div>
  );
}
