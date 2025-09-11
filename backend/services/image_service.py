import cv2
import numpy as np
from PIL import Image
from io import BytesIO
import json

def anonymize_image(file, regions_json: str, mode: str = "blur"):
    # Open uploaded image as numpy array
    image = Image.open(file).convert("RGB")
    img = np.array(image)

    # Parse regions JSON
    regions = json.loads(regions_json)

    for r in regions:
        # Safely get coordinates and sizes
        x = r.get("x", 0)
        y = r.get("y", 0)
        w = r.get("width", r.get("w", 0))
        h = r.get("height", r.get("h", 0))

        if w <= 0 or h <= 0:
            continue  # skip invalid regions

        roi = img[y:y+h, x:x+w]

        if roi.size == 0:
            continue  # skip invalid or out-of-bounds regions

        if mode == "blur":
            roi = cv2.GaussianBlur(roi, (51, 51), 30)
        elif mode == "pixelate":
            roi = cv2.resize(roi, (10, 10), interpolation=cv2.INTER_LINEAR)
            roi = cv2.resize(roi, (w, h), interpolation=cv2.INTER_NEAREST)

        img[y:y+h, x:x+w] = roi

    # Save result to BytesIO
    output = Image.fromarray(img)
    buf = BytesIO()
    output.save(buf, format="PNG")
    buf.seek(0)

    return buf
