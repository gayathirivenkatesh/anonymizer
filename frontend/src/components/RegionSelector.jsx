import React, { useState, useRef } from "react";

export default function RegionSelector({ image, onRegionsChange }) {
  const imgRef = useRef(null);
  const wrapperRef = useRef(null);

  const [regions, setRegions] = useState([]); // displayed coords
  const [preview, setPreview] = useState(null); // displayed coords
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState(null);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const getImgSizes = () => {
    const img = imgRef.current;
    if (!img) return null;
    return {
      displayW: img.clientWidth,
      displayH: img.clientHeight,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    };
  };

  const clientToImgCoords = (clientX, clientY) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (!imgRef.current || e.button !== 0) return;
    const p = clientToImgCoords(e.clientX, e.clientY);
    setStart(p);
    setIsDrawing(true);
    setPreview({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !start || !imgRef.current) return;
    const p = clientToImgCoords(e.clientX, e.clientY);
    setPreview({
      x: Math.min(start.x, p.x),
      y: Math.min(start.y, p.y),
      w: Math.abs(p.x - start.x),
      h: Math.abs(p.y - start.y),
    });
  };

  const commitPreview = (previewRegion) => {
    if (!previewRegion || previewRegion.w < 6 || previewRegion.h < 6) return;
    const updated = [...regions, previewRegion];
    setRegions(updated);
    const sizes = getImgSizes();
    const sx = sizes.naturalW / sizes.displayW || 1;
    const sy = sizes.naturalH / sizes.displayH || 1;
    const scaled = updated.map((r) => ({
      x: Math.round(r.x * sx),
      y: Math.round(r.y * sy),
      w: Math.round(r.w * sx),
      h: Math.round(r.h * sy),
    }));
    if (onRegionsChange) onRegionsChange(scaled);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    commitPreview(preview);
    setPreview(null);
    setStart(null);
  };

  const removeRegion = (idx) => {
    const updated = regions.filter((_, i) => i !== idx);
    setRegions(updated);
    const sizes = getImgSizes();
    const sx = sizes.naturalW / sizes.displayW || 1;
    const sy = sizes.naturalH / sizes.displayH || 1;
    const scaled = updated.map((r) => ({
      x: Math.round(r.x * sx),
      y: Math.round(r.y * sy),
      w: Math.round(r.w * sx),
      h: Math.round(r.h * sy),
    }));
    if (onRegionsChange) onRegionsChange(scaled);
  };

  // RESET all regions
  const resetRegions = () => {
    setRegions([]);
    if (onRegionsChange) onRegionsChange([]);
  };

  return (
    <div>
      <div
        ref={wrapperRef}
        style={{ position: "relative", display: "inline-block", cursor: "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          ref={imgRef}
          src={image}
          alt="to-anonymize"
          style={{ display: "block", maxWidth: "400px", width: "100%", height: "auto", userSelect: "none" }}
          draggable={false}
        />

        {regions.map((r, i) => (
          <div key={`r-${i}`}>
            <div
              style={{
                position: "absolute",
                left: `${r.x}px`,
                top: `${r.y}px`,
                width: `${r.w}px`,
                height: `${r.h}px`,
                border: "2px solid rgba(220,20,60,1)",
                background: "rgba(220,20,60,0.12)",
                pointerEvents: "none",
              }}
            />
            <button
              onClick={(ev) => {
                ev.stopPropagation();
                removeRegion(i);
              }}
              title="Remove"
              style={{
                position: "absolute",
                left: `${Math.max(r.x + r.w - 20, r.x + r.w - 30)}px`,
                top: `${Math.max(r.y - 10, r.y)}px`,
                width: 20,
                height: 20,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.25)",
                background: "white",
                padding: 0,
                cursor: "pointer",
                fontSize: 12,
                lineHeight: "18px",
                textAlign: "center",
              }}
            >
              ×
            </button>
          </div>
        ))}

        {preview && (
          <div
            style={{
              position: "absolute",
              left: `${preview.x}px`,
              top: `${preview.y}px`,
              width: `${preview.w}px`,
              height: `${preview.h}px`,
              border: "2px dashed rgba(30,144,255,1)",
              background: "rgba(30,144,255,0.08)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* RESET button below the image */}
      <button
        onClick={resetRegions}
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}

// import React, { useState, useRef } from "react";

// /**
//  * RegionSelector
//  * - image: preview URL (string)
//  * - onRegionsChange: callback(scaledRegionsArray) where scaled regions are in natural pixels {x,y,w,h}
//  *
//  * This component:
//  * - allows drawing multiple rectangles (click-drag)
//  * - shows a preview while dragging (blue)
//  * - final rectangles are red
//  * - small "x" button to remove a rectangle
//  */
// export default function RegionSelector({ image, onRegionsChange }) {
//   const imgRef = useRef(null);
//   const wrapperRef = useRef(null);

//   const [regions, setRegions] = useState([]); // displayed coords
//   const [preview, setPreview] = useState(null); // displayed coords
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [start, setStart] = useState(null);

//   // helper to clamp
//   const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

//   const onImgLoad = () => {
//     // no-op right now; we read sizes when needed
//   };

//   const getImgSizes = () => {
//     const img = imgRef.current;
//     if (!img) return null;
//     return {
//       displayW: img.clientWidth,
//       displayH: img.clientHeight,
//       naturalW: img.naturalWidth,
//       naturalH: img.naturalHeight,
//     };
//   };

//   const clientToImgCoords = (clientX, clientY) => {
//     const rect = imgRef.current.getBoundingClientRect();
//     const x = clamp(clientX - rect.left, 0, rect.width);
//     const y = clamp(clientY - rect.top, 0, rect.height);
//     return { x, y };
//   };

//   const handleMouseDown = (e) => {
//     if (!imgRef.current) return;
//     // only left button
//     if (e.button !== 0) return;
//     const p = clientToImgCoords(e.clientX, e.clientY);
//     setStart(p);
//     setIsDrawing(true);
//     setPreview({ x: p.x, y: p.y, w: 0, h: 0 });
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing || !start || !imgRef.current) return;
//     const p = clientToImgCoords(e.clientX, e.clientY);
//     const newRegion = {
//       x: Math.min(start.x, p.x),
//       y: Math.min(start.y, p.y),
//       w: Math.abs(p.x - start.x),
//       h: Math.abs(p.y - start.y),
//     };
//     setPreview(newRegion);
//   };

//   const commitPreview = (previewRegion) => {
//     if (!previewRegion) return;
//     // ignore tiny boxes
//     if (previewRegion.w < 6 || previewRegion.h < 6) return;
//     const updated = [...regions, previewRegion];
//     setRegions(updated);
//     // compute scaled (natural) coordinates and call parent
//     const sizes = getImgSizes();
//     const sx = sizes.naturalW / sizes.displayW || 1;
//     const sy = sizes.naturalH / sizes.displayH || 1;
//     const scaled = updated.map((r) => ({
//       x: Math.round(r.x * sx),
//       y: Math.round(r.y * sy),
//       w: Math.round(r.w * sx),
//       h: Math.round(r.h * sy),
//     }));
//     if (onRegionsChange) onRegionsChange(scaled);
//   };

//   const handleMouseUp = (e) => {
//     if (!isDrawing) return;
//     setIsDrawing(false);
//     commitPreview(preview);
//     setPreview(null);
//     setStart(null);
//   };

//   const removeRegion = (idx) => {
//     const updated = regions.filter((_, i) => i !== idx);
//     setRegions(updated);
//     const sizes = getImgSizes();
//     const sx = sizes.naturalW / sizes.displayW || 1;
//     const sy = sizes.naturalH / sizes.displayH || 1;
//     const scaled = updated.map((r) => ({
//       x: Math.round(r.x * sx),
//       y: Math.round(r.y * sy),
//       w: Math.round(r.w * sx),
//       h: Math.round(r.h * sy),
//     }));
//     if (onRegionsChange) onRegionsChange(scaled);
//   };

//   return (
//     <div
//       ref={wrapperRef}
//       style={{ position: "relative", display: "inline-block", cursor: "crosshair" }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <img
//         ref={imgRef}
//         src={image}
//         alt="to-anonymize"
//         onLoad={onImgLoad}
//         style={{ display: "block", maxWidth: "400px", width: "100%", height: "auto", userSelect: "none" }}
//         draggable={false}
//       />

//       {/* Final regions (red) - pointerEvents none so they don't block drawing */}
//       {regions.map((r, i) => (
//         <div key={`r-${i}`}>
//           <div
//             style={{
//               position: "absolute",
//               left: `${r.x}px`,
//               top: `${r.y}px`,
//               width: `${r.w}px`,
//               height: `${r.h}px`,
//               border: "2px solid rgba(220,20,60,1)",
//               background: "rgba(220,20,60,0.12)",
//               pointerEvents: "none", // don't block drawing
//             }}
//           />
//           {/* remove button: clickable, pointerEvents auto */}
//           <button
//             onClick={(ev) => {
//               ev.stopPropagation();
//               removeRegion(i);
//             }}
//             title="Remove"
//             style={{
//               position: "absolute",
//               left: `${Math.max(r.x + r.w - 20, r.x + r.w - 30)}px`,
//               top: `${Math.max(r.y - 10, r.y)}px`,
//               width: 20,
//               height: 20,
//               borderRadius: 2,
//               border: "1px solid rgba(0,0,0,0.25)",
//               background: "white",
//               padding: 0,
//               cursor: "pointer",
//               fontSize: 12,
//               lineHeight: "18px",
//               textAlign: "center",
//             }}
//           >
//             ×
//           </button>
//         </div>
//       ))}

//       {/* Preview region while drawing (blue) */}
//       {preview && (
//         <div
//           style={{
//             position: "absolute",
//             left: `${preview.x}px`,
//             top: `${preview.y}px`,
//             width: `${preview.w}px`,
//             height: `${preview.h}px`,
//             border: "2px dashed rgba(30,144,255,1)",
//             background: "rgba(30,144,255,0.08)",
//             pointerEvents: "none",
//           }}
//         />
//       )}
//     </div>
//   );
// }
