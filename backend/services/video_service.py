# backend/services/video_service.py
import cv2
from tempfile import NamedTemporaryFile
import os

# ✅ Suppress OpenCV/FFmpeg warnings (like OpenH264 load failures)
try:
    cv2.utils.logging.setLogLevel(cv2.utils.logging.LOG_LEVEL_ERROR)
except AttributeError:
    # fallback for older versions
    cv2.setLogLevel(3)
# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def anonymize_video(input_path: str, output_path: str) -> str:
    cap = cv2.VideoCapture(input_path)

    if not cap.isOpened():
        raise ValueError(f"❌ Cannot open video file {input_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Try codecs in order until one works
    codecs = ["avc1", "mp4v", "XVID"]
    out = None
    chosen_codec = None

    for codec in codecs:
        fourcc = cv2.VideoWriter_fourcc(*codec)
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        if out.isOpened():
            chosen_codec = codec
            print(f"✅ Using codec: {codec}")
            break

    if not out or not out.isOpened():
        raise RuntimeError("❌ Failed to initialize VideoWriter with any codec")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Detect faces and blur them
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]
            face_roi = cv2.GaussianBlur(face_roi, (99, 99), 30)
            frame[y:y+h, x:x+w] = face_roi

        out.write(frame)

    cap.release()
    out.release()

    if not os.path.exists(output_path):
        raise RuntimeError("❌ Output file was not created")

    return output_path


def save_upload_temp(file, filename: str) -> str:
    """Save uploaded file with the same extension (not always .mp4)."""
    ext = os.path.splitext(filename)[1] or ".mp4"
    tmp_file = NamedTemporaryFile(delete=False, suffix=ext)
    tmp_file.write(file)
    tmp_file.flush()
    tmp_file.close()
    return tmp_file.name
