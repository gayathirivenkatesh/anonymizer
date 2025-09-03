# AI-Based Image & Video Anonymizer

An AI-powered tool for anonymizing images and videos by detecting faces, sensitive text, and metadata, and applying privacy-preserving techniques such as blurring, masking, and metadata removal. Ideal for personal, academic, and professional use.

---

## Features

* **Face Anonymization**: Detects and blurs/masks faces in images and videos.
* **Text Anonymization**: Identifies and obscures sensitive text using OCR.
* **Metadata Removal**: Strips out sensitive metadata including location, device info, and timestamps.
* **Customizable Privacy Levels**: Choose between light, moderate, or strong anonymization.
* **Supports Multiple Formats**: Works with JPEG, PNG, MP4, and AVI files.
* **User-Friendly Interface**: Upload, preview, and download anonymized files easily.

---

## Project Structure

```
AI-Based-Anonymizer/
│
├── backend/                 # FastAPI backend
│   ├── main.py              # Entry point for backend server
│   ├── services/            # Image/video processing services
│   ├── routes/              # API route handlers
│   ├── models/              # Data models (if any)
│   └── synthetic_faces/     # Optional folder for face replacement images
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Image & Video Anonymizer pages
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## Requirements

* **Backend**: Python 3.9+, FastAPI, OpenCV, Pillow, pytesseract, numpy, uvicorn
* **Frontend**: Node.js 18+, React 18+, Axios

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/AI-Based-Anonymizer.git
cd AI-Based-Anonymizer
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

---

## Running the Project

### 1. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

The backend will start at `http://127.0.0.1:8000`.

### 2. Start the Frontend

```bash
cd frontend
npm start
```

The frontend will open in your browser at `http://localhost:3000`.

---

## Usage

1. Open the frontend in your browser.
2. Upload an image or video.
3. Select the anonymization level (light, moderate, strong).
4. Click **Anonymize**.
5. Preview and download the anonymized media.

---

## Notes

* Ensure `synthetic_faces/` folder exists if using face replacement functionality.
* OCR may require Tesseract installed and added to system PATH.
* For large videos, GPU acceleration is recommended to speed up processing.

---

## Outcome

* Faces and sensitive text are anonymized effectively.
* Metadata is removed, making files safe for sharing.
* Media quality is preserved for non-sensitive areas.

---

## References

1. Hukkelås, H., Mester, R., & Lindseth, F. (2019). *DeepPrivacy: A generative adversarial network for face anonymization*.
2. Piano, L., Basci, P., Lamberti, F., & Morra, L. (2024). *Latent diffusion models for attribute-preserving image anonymization*.
3. Wen, Y., Song, L., Liu, B., Ding, M., & Xie, R. (2021). *IdentityDP: Differential private identification protection for face images*.
4. Anonymous. (2024). *Privacy-proof live surgery streaming: Development of an anonymization algorithm for real-time surgical videos*. Annals of Surgery.
5. Anonymous. (2023). *Real-time video anonymization in smart city intersections*. NSF Public Access Repository.
6. Anonymous. (2024). *Low-latency video anonymization for crowd anomaly detection*.
7. Anonymous. (2022). *Removing metadata from your photos, videos, and other files*. PrivacyGuides.
8. Watkins, D. (2022). *Keep your EXIF metadata private with this open source tool*. OpenSource.com.
9. Anonymous. (2021). *An open-source metadata removal tool for privacy-conscious people*. PrivMeta.
10. Yang, L., Tian, M., Xin, D., & Zheng, J. (2024). *AI-driven anonymization: Protecting personal data privacy while leveraging machine learning*.

---
