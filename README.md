# OceanEmbed — AI-Driven 3D Subsurface Ocean Digital Twin 🌊🌍

[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/PS_ID-26066-orange.svg)](https://sih.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-MoES_%2F_INCOIS-emerald.svg)](https://moes.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/Frontend-React_%2B_Three.js-black.svg)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An institutional, interactive 3D digital twin and physics-informed deep learning platform that reconstructs continuous **0 to 1000m subsurface ocean temperature and salinity profiles** from surface satellite observations across the Indian Ocean basin.

---

## 1. Project Information

- **Project Title:** OceanEmbed — AI-Driven 3D Subsurface Ocean Digital Twin
- **PS ID:** 26066
- **PS Title:** Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations
- **Category:** Software
- **Theme:** Clean & Green Ocean / Disaster Management & Climate Modeling
- **Target Organization / Ministry:** Ministry of Earth Sciences (MoES) / Indian National Centre for Ocean Information Services (INCOIS)
- **Spatial Coverage:** Indian Ocean Boundary ($30^\circ\text{N}$ to $-40^\circ\text{S}$, $30^\circ\text{E}$ to $120^\circ\text{E}$)
- **Vertical Domain:** $0\text{m}$ (Surface) to $1000\text{m}$ (Bathypelagic Floor)

---

## 2. Problem Statement

In-situ oceanographic sensors like **Argo Floats** are sparse—typically only one float exists per $300\text{ km} \times 300\text{ km}$ spatial block. While Earth Observation satellites provide high-resolution continuous measurements of the ocean surface (Sea Surface Temperature, Sea Surface Height Anomaly, Wind Stress), they cannot penetrate into the deep ocean.

Subsurface thermal and salinity structures down to **1000m** govern critical Earth systems:
1. **Tropical Cyclone Intensification:** Driven by Ocean Heat Content (OHC) and Tropical Cyclone Heat Potential (TCHP).
2. **Monsoon Dynamics:** Coupled ocean-atmosphere heat exchange that controls the Indian Summer Monsoon.
3. **Marine Fisheries:** Thermocline depth and upwelling zones dictating nutrient-rich fishing grounds.
4. **Naval Defense & Acoustics:** Deep sound channels (SOFAR) and acoustic shadow zone propagation.

There is an urgent need for an AI-powered system that accurately bridges the gap between surface satellite data and full 3D subsurface thermal fields in real-time.

---

## 3. Proposed Solution

**OceanEmbed** addresses this challenge through a 3-tier deep neural representation architecture:

1. **Multi-Satellite Ingestion:** Integrates live surface boundary feeds from Sentinel-6, Jason-3 (SSHA), INSAT-3DR (SST), and Oceansat-3 (Wind Stress).
2. **Physics-Informed Deep Neural Inversion:** Employs a deep neural network with physical loss constraints (monotonic thermal descent and thermocline gradient preservation) to predict vertical profiles $T(z)$ and $S(z)$ for $z \in [0, 1000\text{m}]$ in $<12\text{ms}$.
3. **Interactive 3D WebGL Digital Twin:** Visualizes continuous 3D planetary heatmaps, real-time satellite constellation orbits, 0–1000m depth planes, and standalone 3D volumetric water column slices.

---

## 4. Key Features

### 🌐 1. Interactive 3D Geospatial Digital Twin
- **Photorealistic Earth Mesh:** NASA bathymetry, atmospheric Rayleigh scattering, and dynamic cloud layers.
- **Satellite Constellation Orbits:** Real-time 3D tracking of 6 Earth Observation satellites (Sentinel-6, Jason-3, INSAT-3DR, Oceansat-3, SWOT, SARAL).
- **MoES Focus Boundary:** Glowing 3D polygon outlining the exact Indian Ocean research perimeter.
- **In-Situ Argo Float Array:** Interactive pulsing 3D pins displaying real-time floating CTD telemetry.

### 🌊 2. Continuous 0–1000m Depth Exploration
- **Continuous Depth Slider:** Sweeps smoothly from surface ($0\text{m}$) to abyssal floor ($1000\text{m}$) across Epipelagic, Thermocline, and Bathypelagic zones.
- **Auto-Sweep Animation:** Automated continuous vertical scanning at 60 FPS.
- **Subsurface Cutaway Pillar:** Physical volumetric depth pillar rendering internal strata rings at the active coordinate.

### 🧊 3. Standalone 3D Ocean Block Slice (`OceanBlockView`)
- Localized 3D volumetric water cube with multi-angle camera presets (**Isometric**, **Front**, **Side**, **Top**).
- Compact Subsurface Telemetry HUD and continuous thermal gradient laser plane.

### 📊 4. Full CTD Vertical Profile & Export
- Interactive vertical temperature chart highlighting the Mixed Layer Depth (MLD) and thermocline drop curve.
- Export profile data in CSV and JSON formats for research reporting.

### 🏛️ 5. Scientific Governance Modals
- **Constellation Modal:** Satellite payload packages, orbital health, and pass tracking.
- **Telemetry Analytics Modal:** Global model verification metrics ($R^2 = 0.945$, $\text{RMSE} = 0.28^\circ\text{C}$, $\text{MAE} = 0.21^\circ\text{C}$).
- **Mission Info Modal:** 3-tier deep neural architecture and operational impact matrix.

---

## 5. Technology Stack

- **Frontend:** React 18, TypeScript, Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.9+, FastAPI, Uvicorn, Pydantic, NumPy, SciPy
- **Machine Learning:** PyTorch / ONNX Physics-Informed Neural Network (PINN)
- **Data & Caching:** In-Memory Multi-Dimensional Tensor Cache, Structured JSON, NetCDF4 / ERDDAP Integration
- **Documentation & Reporting:** ReportLab PDF Engine, KaTeX / Markdown
- **Deployment:** Docker, Vercel, Hugging Face Spaces, Railway

---

## 6. System Architecture

See detailed technical architecture in [docs/architecture.md](docs/architecture.md).

```text
+-------------------------------------------------------------------------+
|                  SATELLITE OBSERVATION LAYER (Surface)                  |
|   Sentinel-6 / Jason-3       INSAT-3DR (SST)       Oceansat-3 / SWOT    |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|               PHYSICS-INFORMED NEURAL NETWORK (Inference)               |
|      [Lat, Lon, Depth, SST, SSHA, Wind_U, Wind_V] -> T(z), S(z)         |
|               (RMSE: 0.28°C | R²: 0.945 | Latency: <12ms)               |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    FASTAPI REST MICROSERVICE LAYER                      |
|          /api/predict_grid  |  /api/predict_profile  |  /api/stats      |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                 INTERACTIVE 3D WEBGL CLIENT (Frontend)                 |
|    - 3D Digital Twin Globe        - 0-1000m Depth Plane Scrubber        |
|    - 3D Satellite Constellation   - 3D Ocean Block Volumetric Slice     |
|    - In-Situ Argo Float Markers   - Full CTD Depth Profile Chart        |
+-------------------------------------------------------------------------+
```

---

## 7. Repository Structure

```text
SIH2026-OceanEmbed/
├── README.md                           # Master SIH 2026 Documentation
├── SUBMISSION_GUIDE.md                 # Hackathon submission checklist
├── OceanEmbed_Platform_Feature_Guide.pdf # Official Technical Feature Manual
├── requirements.txt                    # Root Python dependencies
├── package.json                        # Root monorepo build script
├── vercel.json                         # Cloud deployment configuration
├── .gitignore                          # Git ignore rules
│
├── docs/                               # Technical Documentation
│   └── architecture.md                 # Deep neural & WebGL architecture
│
├── submission/                         # SIH Presentation & Evaluation
│   ├── PRESENTATION.md                 # Slide deck presentation outline
│   └── DEMO.md                         # Demo instructions & test coordinates
│
├── assets/                             # Visual Assets
│   └── screenshots/                    # Application UI screenshots
│       └── README.md
│
├── backend/                            # FastAPI Microservice
│   ├── main.py                         # REST API endpoints & CORS
│   ├── model.py                        # Deep neural inference & physics engine
│   ├── argo_data.py                    # Argo CTD database & live ingestion
│   ├── cache.py                        # Pre-warmed depth memory cache
│   ├── data/                           # In-situ Argo float profiles (JSON)
│   └── requirements.txt
│
├── frontend/                           # React + Three.js Web Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopNavbar.tsx           # Institutional header & search
│   │   │   ├── LeftSidebar.tsx         # Telemetry & profile controls
│   │   │   ├── RightSidebar.tsx        # Layers & 0-1000m depth scrubber
│   │   │   ├── Earth.tsx               # 3D Photorealistic globe
│   │   │   ├── SatellitesOrbit.tsx     # 3D satellite constellation
│   │   │   ├── ArgoMarkers.tsx         # In-situ Argo float pins
│   │   │   ├── SubsurfaceCutaway.tsx   # Volumetric strata pillar
│   │   │   ├── OceanBlock/             # Standalone 3D water block
│   │   │   │   ├── OceanBlockView.tsx
│   │   │   │   └── OceanBlock3D.tsx
│   │   │   ├── ConstellationModal.tsx  # Satellite fleet explorer
│   │   │   ├── TelemetryAnalyticsModal.tsx # AI validation metrics
│   │   │   ├── MissionInfoModal.tsx    # MoES mission architecture
│   │   │   └── FullProfileModal.tsx    # Vertical CTD chart
│   │   ├── services/api.ts             # API client & prefetcher
│   │   ├── utils/geo.ts                # Geospatial math & color scales
│   │   ├── App.tsx                     # Main application orchestrator
│   │   └── index.css                   # Institutional UI styling
│   ├── public/textures/                # High-res NASA planetary textures
│   └── package.json
│
└── api/                                # Serverless API entrypoint
    └── index.py
```

---

## 8. Quickstart & Installation Guide

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** & **npm**

### Local Development Setup

#### 1. Start the Backend API
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend API will run at: `http://127.0.0.1:8000` (Swagger docs: `http://127.0.0.1:8000/docs`).

#### 2. Start the Frontend Application
```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```
Frontend Web Client will run at: `http://localhost:3000`.

---

## 9. REST API Reference

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/predict_grid` | `depth` (0 to 1000) | Returns 2D geospatial matrix of predicted temperatures at specified depth. |
| `GET` | `/api/predict_profile` | `lat`, `lon` | Returns continuous 0–1000m vertical temperature and salinity CTD profile. |
| `GET` | `/api/argo_floats` | — | Returns active Argo float observation positions and telemetry. |
| `GET` | `/api/stats` | — | Returns global model verification KPIs ($R^2$, RMSE, MAE, inference latency). |

---

## 10. Submission & Presentation Deliverables

- **Pitch Deck Outline:** [submission/PRESENTATION.md](submission/PRESENTATION.md)
- **Live Demo Guide & Coordinates:** [submission/DEMO.md](submission/DEMO.md)
- **Technical Feature PDF:** [OceanEmbed_Platform_Feature_Guide.pdf](OceanEmbed_Platform_Feature_Guide.pdf)
- **Architecture Documentation:** [docs/architecture.md](docs/architecture.md)

---

## 11. License & Attribution

This project is submitted under the **Smart India Hackathon 2026** for the **Ministry of Earth Sciences (MoES) / INCOIS**.  
Licensed under the [MIT License](LICENSE).
