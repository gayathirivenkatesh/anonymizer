import cv2
import os
import subprocess

# Suppress OpenCV/FFmpeg warnings
try:
    cv2.utils.logging.setLogLevel(cv2.utils.logging.LOG_LEVEL_ERROR)
except AttributeError:
    cv2.setLogLevel(3)

# Haar Cascade for face detection
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

    # ✅ Safer codec order (start with mp4v instead of avc1)
    codecs = ["mp4v", "XVID", "MJPG"]
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
        # ❌ OpenCV failed → fallback to ffmpeg encoding
        print("⚠️ OpenCV VideoWriter failed, using ffmpeg fallback...")
        temp_raw = output_path.replace(".mp4", "_raw.avi")
        raw_codec = cv2.VideoWriter_fourcc(*"MJPG")
        out = cv2.VideoWriter(temp_raw, raw_codec, fps, (width, height))
        if not out.isOpened():
            raise RuntimeError("❌ Could not initialize any video writer")
        output_path = temp_raw

    # Process frames
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        for (x, y, w, h) in faces:
            face_roi = frame[y:y+h, x:x+w]
            face_roi = cv2.GaussianBlur(face_roi, (99, 99), 30)
            frame[y:y+h, x:x+w] = face_roi

        out.write(frame)

    cap.release()
    out.release()

    # ✅ Convert raw avi → mp4 with ffmpeg if fallback was used
    if output_path.endswith("_raw.avi"):
        final_path = output_path.replace("_raw.avi", ".mp4")
        cmd = [
            "ffmpeg", "-y", "-i", output_path,
            "-vcodec", "libx264", "-crf", "23", "-preset", "veryfast", final_path
        ]
        subprocess.run(cmd, check=True)
        os.remove(output_path)  # cleanup raw file
        output_path = final_path

    return output_path
