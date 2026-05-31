# GobID - Biometric Digital Identity Platform

GobID is a full-stack proof of concept for digital identity verification. It combines OCR, computer vision, facial biometrics, session-based authentication, Supabase persistence, and PDF document generation in a single user flow.

The application is designed around a Mexican identity onboarding scenario: a user uploads an INE image, the backend extracts structured identity fields, the browser guides a live face capture, the backend generates a 128-dimensional facial embedding, and the user can later sign in with facial recognition.

> This project is intended for portfolio, research, and educational purposes. It is not production-ready for real identity verification without additional security, privacy, compliance, and anti-spoofing work.

## Features

- INE OCR extraction with PaddleOCR and OpenCV.
- Structured parsing for name, CURP, sex, date of birth, voter key, address, and electoral section.
- Browser-based assisted face capture using `@vladmandic/face-api`.
- Facial embedding extraction with `face_recognition` / dlib.
- Biometric login through Euclidean distance comparison against stored embeddings.
- Session cookies for authenticated user flows.
- Supabase persistence for users, facial embeddings, and fiscal data.
- Authenticated dashboard with a small catalog of document services.
- Client-side PDF generation with jsPDF.
- Biometric evaluation scripts using the LFW dataset, ROC curve, confusion matrix, FAR, FRR, accuracy, and threshold analysis.
- Docker setup for the FastAPI backend.

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- `@vladmandic/face-api`
- jsPDF
- Lucide React

### Backend

- Python
- FastAPI
- Pydantic
- OpenCV
- NumPy
- PaddleOCR
- dlib / `face_recognition`
- Supabase Python client

### Testing and Analysis

- scikit-learn
- matplotlib
- seaborn
- LFW dataset

## Repository Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── api/routes/        # FastAPI route modules
│   │   ├── config/            # Supabase configuration
│   │   ├── db/                # Data access layer
│   │   ├── models/            # Pydantic schemas
│   │   ├── services/          # OCR and facial recognition services
│   │   └── utils/             # Image helpers
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/
│   ├── app/                   # Next.js routes
│   ├── components/            # UI and workflow components
│   ├── public/models/         # Face-api model files
│   ├── utils/                 # API and PDF helpers
│   └── package.json
└── PORTFOLIO_CV.md            # Portfolio/CV summary material
```

## Main Flow

1. The user uploads an identity document image.
2. FastAPI receives the image and processes it with OpenCV.
3. PaddleOCR extracts raw text from the document.
4. The backend parses identity fields into a structured response.
5. The frontend displays the extracted data for validation.
6. The user completes an assisted face capture in the browser.
7. The backend extracts a 128-dimensional facial vector.
8. The user is enrolled in Supabase with metadata and facial embedding.
9. During login, a new vector is compared against stored embeddings.
10. If the best match is under the acceptance threshold, the session is created.
11. The dashboard allows generating PDF documents from the stored profile.

## Environment Variables

The repository includes safe example files:

- `backend/.env.example`
- `frontend/.env.example`

Create local environment files from them:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Backend variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-key
```

Frontend variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Do not commit real `.env` files or production credentials.

## Running Locally

### Backend

From `backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Or with Docker:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:8000
```

### Frontend

From `frontend/`:

```bash
pnpm install
pnpm dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## API Overview

- `GET /health` - service health check.
- `POST /api/v1/scan-ine` - extract raw OCR text from an INE image.
- `POST /api/v1/scan-ine-parsed` - extract and parse structured INE fields.
- `POST /api/v1/extract-vector` - extract a facial embedding from an uploaded image.
- `POST /enroll` - create a user with identity metadata and biometrics.
- `POST /login/verify` - authenticate a user with a facial vector.
- `GET /me` - return the current authenticated profile.
- `POST /logout` - clear session cookies.
- `POST /fiscal/guardar` - save fiscal profile data.

## Biometric Evaluation

The backend includes experimental scripts under `backend/app/tests/` to evaluate the facial recognition engine with the LFW dataset.

The robust test computes:

- Genuine and impostor pair comparisons.
- Average extraction and comparison latency.
- ROC curve and AUC.
- Optimal recognition threshold.
- Confusion matrix.
- Accuracy, FAR, and FRR.

The generated ROC/confusion-matrix artifact is useful as portfolio evidence, but results depend on hardware, dataset sampling, image quality, and the selected threshold.

## Security and Privacy Notes

Before making this repository public, keep these points in mind:

- Real Supabase credentials must stay only in local `.env` files.
- Facial embeddings are biometric data and should be encrypted or otherwise protected at rest in a production system.
- The current liveness flow is a guided capture, not a complete anti-spoofing solution.
- The login threshold is a research/demo value and should be validated before real use.
- Production deployments should use HTTPS, secure cookies, stricter CORS, server-side audit logs, rate limiting, and stronger session management.
- Do not upload real identity documents, real CURPs/RFCs, or real biometric samples to a public repository.

## Current Limitations

- This is a proof of concept, not a certified identity verification product.
- OCR parsing is tailored to the expected INE text format and may need stronger normalization.
- Frontend and backend are configured primarily for local development.
- Supabase schema setup is not yet automated through migrations.
- The PDF documents are generated as demonstration artifacts and are not official government documents.

## Portfolio Angle

This project demonstrates practical integration of:

- Full-stack application development.
- Applied computer vision.
- OCR-based document processing.
- Biometric authentication.
- API design with FastAPI.
- Persistent user profiles with Supabase.
- Document generation workflows.
- Model/threshold evaluation with statistical metrics.

