def anonymize_video(input_path: str, output_path: str) -> str:
    cap = cv2.VideoCapture(input_path)

    if not cap.isOpened():
        raise ValueError("Cannot open video")

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    SCALE = 0.5
    FRAME_SKIP = 3
    BLUR_KERNEL = (31, 31)

    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # Skip heavy processing
        if frame_count % FRAME_SKIP != 0:
            out.write(frame)
            continue

        small = cv2.resize(frame, None, fx=SCALE, fy=SCALE)
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        for (x, y, w, h) in faces:
            x, y, w, h = int(x/SCALE), int(y/SCALE), int(w/SCALE), int(h/SCALE)
            roi = frame[y:y+h, x:x+w]
            roi = cv2.GaussianBlur(roi, BLUR_KERNEL, 0)
            frame[y:y+h, x:x+w] = roi

        out.write(frame)

    cap.release()
    out.release()

    return output_path
