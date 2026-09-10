# OceanEmbed – Satellite Embedding-Based Deep Learning Framework

This repository contains the complete implementation for **Smart India Hackathon (SIH 2026)** by **Team REGALIA**.

## 1. Project Information

- **Project Title:** OceanEmbed — Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations
- **PS ID:** SIH26066
- **PS Title:** Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations
- **Category:** Software
- **Theme:** Disaster Management
- **Team Name:** REGALIA

## 2. Problem Statement

What exists today? We have accurate surface satellite measurements, wide spatial coverage, and model-based 3D data—**but continuous real-time subsurface ocean temperature information is still missing**.

In-situ oceanographic sensors like **ARGO Floats** are spatially sparse across the Indian Ocean (~1 float per $300\text{ km} \times 300\text{ km}$ area). Satellite sensors measure surface parameters with high resolution but cannot directly measure the ocean interior down to 1000m depth, which is vital for tropical cyclone intensity, monsoon dynamics, marine heatwaves, and naval operations.

## 3. Proposed Solution

**OceanEmbed (by Team REGALIA)** bridges this gap by fusing multiple surface satellite observations using a **Physics-Informed Deep Learning Fusion Network**. The model learns complex non-linear relationships between multi-modal surface conditions and subsurface structures to generate daily 3D temperature profiles across multiple depths at a standardized **$0.25^\circ \times 0.25^\circ$ spatial grid**.

## 4. Key Features

- **Multi-Surface Satellite Fusion:** Ingests and standardizes 5 complementary surface variables:
  - **SST:** Sea Surface Temperature (Thermal IR / Microwave)
  - **SSS:** Sea Surface Salinity
  - **SLA / ADT:** Sea Level Anomaly & Absolute Dynamic Topography (Radar Altimetry)
  - **WIND:** Surface Wind Stress Vectors ($\tau_x, \tau_y$)
  - **CHLOROPHYLL:** Ocean Color / Phytoplankton concentration
- **3D Ocean Visibility & Reconstruction:** Daily 3D subsurface thermal fields from $0\text{m}$ down to $1000\text{m}$ at $0.25^\circ$ resolution.
- **Interactive 3D WebGL Digital Twin:** High-resolution 3D Earth globe with real-time satellite constellation orbits (Sentinel-6, Jason-3, INSAT-3DR, Oceansat-3, SWOT, SARAL).
- **Continuous 0–1000m Depth Scrubbing:** Live dynamic sweeping across Epipelagic, Thermocline, and Bathypelagic ocean layers with automated scanning.
- **Standalone 3D Ocean Block Slice (`OceanBlockView`):** Isolated 3D volumetric water cube with multi-angle perspective cameras (Isometric, Front, Side, Top).
- **Independent ARGO Float Validation:** Real-time CTD observation station pins with interactive vertical depth charts and Mixed Layer Depth (MLD) tracking.
- **Scientific Governance Modals:** Satellite Constellation explorer, AI Telemetry Analytics ($R^2 = 0.945$, $\text{RMSE} = 0.28^\circ\text{C}$), and MoES Architecture.

## 5. Technology Stack

- **Frontend:** React 18, TypeScript, Three.js, React Three Fiber, Tailwind CSS, Recharts, Lucide Icons
- **Backend:** Python 3.9+, FastAPI, Uvicorn, Pydantic
- **Machine Learning & Modeling:** PyTorch, NumPy, SciPy (Deep Neural Fusion Architecture)
- **Reference Datasets:** GLORYS Ocean Reanalysis (dense reference training) + Independent Quality-Controlled ARGO Profiles (validation)
- **Deployment:** Docker / Cloud / Vercel

## 6. Architecture

See [docs/architecture.md](docs/architecture.md).

```text
+-------------------------------------------------------------------------+
|                  MULTIPLE SURFACE SATELLITE INPUTS                      |
|      SST   +   SSS   +   SLA/ADT   +   WIND   +   CHLOROPHYLL           |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    UNIFIED PREPROCESSING PIPELINE                       |
|         Standardized to 0.25° × 0.25° Daily Indian Ocean Grid           |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        DEEP LEARNING FUSION                             |
|          Learns complex relationships between surface conditions         |
|                       and subsurface thermal structure                  |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                     3D TEMPERATURE RECONSTRUCTION                       |
|          Daily 3D Profiles (0–1000m) at 0.25° Spatial Resolution        |
|            Validated against Independent Quality-Controlled ARGO        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                 INTERACTIVE 3D WEBGL CLIENT (Frontend)                 |
|    - 3D Digital Twin Globe        - 0-1000m Depth Plane Scrubber        |
|    - 3D Satellite Constellation   - 3D Ocean Block Volumetric Slice     |
|    - In-Situ ARGO Float Markers   - Full CTD Depth Profile Chart        |
+-------------------------------------------------------------------------+
```

## 7. Repository Structure

```text
SIH2026-OceanEmbed/
├── README.md                           # Project documentation (Team REGALIA)
├── SUBMISSION_GUIDE.md                 # SIH submission checklist
├── OceanEmbed_Platform_Feature_Guide.pdf # Publication-grade technical manual
├── requirements.txt                    # Root Python dependencies
├── vercel.json                         # Cloud deployment configuration
├── package.json                        # Root build scripts
├── .gitignore                          # Clean repository rules
│
├── submission/                         # SIH Presentation & Jury Deliverables
│   ├── Team_REGALIA_SIH2026_Presentation.pdf # Official SIH Presentation PPT
│   ├── PRESENTATION.md                 # Pitch deck outline & slide breakdown
│   └── DEMO.md                         # Live demo guide & evaluation test coordinates
│
├── docs/                               # Technical Documentation
│   └── architecture.md                 # Deep neural fusion & 3D WebGL architecture
│
├── assets/                             # Visual Assets
│   └── screenshots/                    # Screenshot repository
│       └── README.md
│
├── backend/                            # FastAPI Microservice
│   ├── main.py                         # REST API endpoints & CORS
│   ├── model.py                        # Deep neural inference engine
│   ├── argo_data.py                    # ARGO CTD database & live ingestion
│   ├── cache.py                        # Pre-warmed depth memory cache
│   ├── data/                           # In-situ ARGO float profiles (JSON)
│   └── requirements.txt
│
└── frontend/                           # React + Three.js 3D Web Application
    ├── src/                            # Components, HUDs, shaders & state
    ├── public/                         # NASA planetary textures
    └── package.json
```

### What goes where?

| Item | Location |
|---|---|
| Source code | `backend/` and `frontend/` |
| Architecture / technical documentation | `docs/` |
| Project screenshots / photos | `assets/screenshots/` |
| Final PPT / presentation | `submission/Team_REGALIA_SIH2026_Presentation.pdf` |
| Presentation details | `submission/PRESENTATION.md` |
| Demo video link & test guide | `submission/DEMO.md` |
| Project overview | `README.md` |

## 8. Final Presentation

Keep your final SIH presentation in the repository whenever the file size allows it.

- **Presentation PDF:** [`submission/Team_REGALIA_SIH2026_Presentation.pdf`](submission/Team_REGALIA_SIH2026_Presentation.pdf)
- See [submission/PRESENTATION.md](submission/PRESENTATION.md) for the slide-by-slide pitch deck structure.

## 9. Demo Video

A demo video is **optional**, but recommended.

Add the YouTube/Google Drive link in [submission/DEMO.md](submission/DEMO.md).

## 10. Screenshots / Prototype Photos

Add important screenshots or prototype photos to:

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

## 13. Feasibility, Risks & Mitigations

| # | Identified Risk | Impact | Team REGALIA Mitigation Strategy |
|---|---|---|---|
| **1** | **Satellite Data Gaps** | Clouds, sensor limitations, and retrieval errors cause missing or noisy surface observations. | Fuse multiple complementary sources with quality control, spatial alignment, and missing-data imputation. |
| **2** | **Surface Data $\neq$ Subsurface Temp** | Surface temperature alone cannot uniquely predict subsurface thermal structures. | Fuse **SST + SSS + SLA/ADT + Wind + Chlorophyll + Spatio-temporal embeddings** to capture deep variability. |
| **3** | **Different Dataset Resolutions** | Varying grids, time scales, units, and missing-data patterns across satellite sources. | Standardize all input sources to a **$0.25^\circ \times 0.25^\circ$ daily grid** via unified preprocessing. |
| **4** | **Reanalysis / Model Bias** | GLORYS may contain numerical model biases that could transfer during training. | Use GLORYS for dense training reference while holding independent **ARGO observations for strict validation**. |
| **5** | **Sparse ARGO Observations** | In-situ ARGO measurements are spatially sparse and contain localized sensor noise. | Maintain ARGO strictly independent for validation using quality-controlled profiles and statistical error metrics ($R^2$, RMSE, MAE). |

## 14. Key Impacts & Benefits (6 Core Pillars)

1. **3D Ocean Visibility:** Accurately estimates thermal structures beneath the surface from 0m to 1000m.
2. **Cyclone Monitoring:** Reveals subsurface Ocean Heat Content (OHC) that directly fuels tropical cyclone intensity.
3. **Marine Heatwave Detection:** Identifies deep thermal anomalies hidden below the sea surface.
4. **Fisheries & Ecosystems:** Provides depth-wise thermal habitat information for marine productivity and sustainable fishing.
5. **Better Ocean Forecasting:** Adds continuous 3D temperature fields to operational numerical weather and ocean forecasting systems.
6. **High-Resolution Monitoring:** Delivers daily temperature estimates at **$0.25^\circ$ resolution** across the North Indian Ocean.

## Important

Before submission, make sure the repository is accessible to reviewers. Do **not** upload passwords, API keys, access tokens, `.env` files containing secrets, or other confidential credentials.
