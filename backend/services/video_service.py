import cv2
import os

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def anonymize_video(input_path: str, output_path: str) -> str:
    cap = cv2.VideoCapture(input_path)

    if not cap.isOpened():
        raise ValueError("Cannot open video")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Memory-friendly settings
    SCALE = 0.25
    FRAME_SKIP = 10
    BLUR_KERNEL = (15, 15)

    frame_count = 0

    try:
        while True:
            ret, frame = cap.read()

            if not ret:
                break

            frame_count += 1

            if frame_count % FRAME_SKIP != 0:
                out.write(frame)
                continue

            small = cv2.resize(
                frame,
                None,
                fx=SCALE,
                fy=SCALE,
                interpolation=cv2.INTER_LINEAR,
            )

            gray = cv2.cvtColor(
                small,
                cv2.COLOR_BGR2GRAY,
            )

            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=4,
            )

            for (x, y, w, h) in faces:
                x = int(x / SCALE)
                y = int(y / SCALE)
                w = int(w / SCALE)
                h = int(h / SCALE)

                roi = frame[y:y+h, x:x+w]

                if roi.size > 0:
                    roi = cv2.GaussianBlur(
                        roi,
                        BLUR_KERNEL,
                        0
                    )
                    frame[y:y+h, x:x+w] = roi

            out.write(frame)

    finally:
        cap.release()
        out.release()
        cv2.destroyAllWindows()

    return output_path
