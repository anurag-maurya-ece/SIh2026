# OceanEmbed – AI Subsurface Ocean Digital Twin

This repository contains the complete implementation for **Smart India Hackathon (SIH 2026)** Problem Statement **26066**.

## 1. Project Information

- **Project Title:** OceanEmbed – AI-Driven 3D Subsurface Ocean Digital Twin
- **PS ID:** 26066
- **PS Title:** Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations
- **Category:** Software
- **Theme:** Clean & Green Ocean / Disaster Management & Climate Modeling

## 2. Problem Statement

In-situ oceanographic sensors like **Argo Floats** are sparse across the Indian Ocean (typically only one float per $300\text{ km} \times 300\text{ km}$ area). Satellite sensors measure surface parameters (Sea Surface Temperature, Sea Surface Height Anomaly, Surface Wind Stress) with high resolution but cannot directly penetrate the ocean interior down to 1000m depth, which is critical for cyclone heat potential forecasting, monsoon dynamics, and naval operations.

## 3. Proposed Solution

OceanEmbed uses a **Physics-Informed Deep Neural Representation Network** to reconstruct continuous 0–1000m 3D subsurface temperature and salinity profiles from multi-satellite surface observations in real-time (<12ms), visualized through an interactive 3D WebGL Digital Twin globe.

## 4. Key Features

- **3D Interactive Digital Twin Globe:** High-resolution photorealistic Earth with real-time satellite constellation orbits (Sentinel-6, Jason-3, INSAT-3DR, Oceansat-3, SWOT, SARAL).
- **Continuous 0m to 1000m Depth Scrubbing:** Live dynamic sweeping across Epipelagic, Thermocline, and Bathypelagic ocean layers with auto-sweep animation.
- **Standalone 3D Volumetric Water Column Slice:** Localized 3D ocean block (`OceanBlockView`) with multi-angle cameras (Isometric, Front, Side, Top).
- **Interactive Argo Float Array Pins:** In-situ CTD observation stations with live depth profile charts and Mixed Layer Depth (MLD) markers.
- **Scientific Governance Modals:** Satellite Constellation explorer, AI Telemetry Analytics ($R^2 = 0.945$, $\text{RMSE} = 0.28^\circ\text{C}$), and MoES Mission Architecture.
- **Sub-Millisecond In-Memory Caching & REST API:** FastAPI backend serving gridded predictions and profiles in $<12\text{ms}$.

## 5. Technology Stack

- **Frontend:** React, TypeScript, Three.js, React Three Fiber, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Python, FastAPI, Uvicorn, Pydantic
- **Machine Learning:** PyTorch, NumPy, SciPy
- **Database & Caching:** In-Memory Multi-Dimensional Tensor Cache, Structured JSON, NetCDF4 / ERDDAP Integration
- **Deployment:** Docker / Cloud / Vercel

## 6. Architecture

See [docs/architecture.md](docs/architecture.md).

```text
User
  |
  v
Frontend (3D WebGL / React)
  |
  v
Backend API (FastAPI)
  |
  +----> In-Memory Cache / Argo Database
  |
  v
ML Subsurface Inversion Model
  |
  v
3D Volumetric Prediction (0-1000m)
```

## 7. Repository Structure

```text
SIH2026-OceanEmbed/
├── README.md
├── SUBMISSION_GUIDE.md
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── argo_data.py
│   ├── cache.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── docs/
│   └── architecture.md
├── assets/
│   └── screenshots/
│       └── README.md
├── requirements.txt
├── vercel.json
├── .gitignore
└── LICENSE
```

### What goes where?

| Item | Location |
|---|---|
| Source code | `backend/` and `frontend/` |
| Architecture / technical documentation | `docs/` |
| Project screenshots / hardware photos | `assets/screenshots/` |
| Final PPT / presentation | `submission/` |
| Demo video link | `submission/DEMO.md` |
| Project overview | `README.md` |

## 8. Final Presentation

Keep your final SIH presentation in the repository whenever the file size allows it.

See [submission/PRESENTATION.md](submission/PRESENTATION.md) for the required format.

If the PPT is too large for GitHub, use Google Drive/OneDrive and put the accessible viewer link in `submission/PRESENTATION.md`.

## 9. Demo Video

A demo video is **optional**, but recommended.

Add the YouTube/Google Drive link in [submission/DEMO.md](submission/DEMO.md).

## 10. Screenshots / Prototype Photos

Add important screenshots or hardware/prototype photos to:

`assets/screenshots/`

See [assets/screenshots/README.md](assets/screenshots/README.md) for examples and naming conventions.

## 11. Installation

```bash
git clone https://github.com/anurag-maurya-ece/SIh2026.git
cd SIh2026

# 1. Install Backend Dependencies
pip install -r requirements.txt

# 2. Install Frontend Dependencies
cd frontend
npm install
```

## 12. Run

```bash
# Terminal 1 - Start Backend Server (FastAPI)
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 - Start Frontend Client (Vite + React)
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000`. Backend Swagger API documentation is accessible at `http://127.0.0.1:8000/docs`.

## 13. Future Scope

1. **Direct Coupling with INCOIS ERDDAP:** Real-time ingestion of live NetCDF operational data feeds.
2. **Automated Tropical Cyclone Heat Potential (TCHP) Alerts:** Automated early warning triggers for coastal state disaster management authorities.
3. **High-Resolution Acoustic Ray Tracing:** Defense module for submarine sound velocity profile (SVP) modeling.
4. **Edge Deployment on Research Vessels:** Offline containerized deployment for Sagar Kanya / Samudra Ratnakar research cruises.

## Important

Before submission, make sure the repository is accessible to reviewers. Do **not** upload passwords, API keys, access tokens, `.env` files containing secrets, or other confidential credentials.
