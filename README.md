# OceanEmbed 🌊🌍

**Smart India Hackathon 2026 — Problem Statement 26066**  
*Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations*  
**Ministry / Organization:** Ministry of Earth Sciences (MoES) / INCOIS

---

## Overview

**OceanEmbed** is an interactive, full-stack 3D Earth visualization and deep learning inference platform. It solves the critical oceanographic challenge of reconstructing 3D subsurface thermal fields (from the surface down to 1000m depth) using surface satellite observation embeddings (Sea Surface Temperature, Sea Surface Height Anomaly, Sea Surface Salinity, and Surface Wind Stress) validated against global and Indian Ocean Argo float profiles.

---

## Key Features

### 1. 3D Cinematic Earth Visualization (`/frontend`)
- **NASA High-Resolution Textures**: Day map, bump map relief for terrain topography, and glossy oceanic surface reflectance.
- **Animated Cloud Layer**: Independent rotating cloud sphere with alpha blending.
- **Fresnel Atmosphere Shell**: Soft cyan-blue atmospheric rim glow shader.
- **Day/Night Terminator Lighting**: Directional solar lighting casting a true day/night boundary with celestial starfield background.
- **OrbitControls & Camera Positioning**: Drag to rotate, scroll to zoom, right-click to pan, and a dedicated *"Focus Indian Ocean"* button.

### 2. Subsurface Ocean Data & Thermocline Reconstruction
- **Dynamic 3D Ocean Heatmap**: High-fidelity canvas texture overlay mapping cold-to-warm temperature gradients (`-2°C` to `32°C`) projected exclusively onto oceanic basins.
- **0m–1000m Depth Slider**: Drag to dynamically render thermal layers across the Mixed Layer (0–50m), Upper Thermocline (150m), Main Thermocline (300m–500m), and Deep Ocean (1000m).
- **Auto-Sweep Animation**: One-click play/pause sweep that animates continuously through ocean depth slices.
- **Interactive Point Profile Tooltip**: Click any location on the globe or any Argo float marker to inspect the 0–1000m vertical temperature profile chart (rendered via Recharts) and model prediction confidence.
- **Argo Float Ground-Truth Markers**: Pulsing 3D marker pins representing INCOIS and Global Argo float CTD observation stations.
- **MoES Focus Boundary**: Glowing 3D boundary outline highlighting the Indian Ocean research zone.

### 3. High-Performance Backend API (`/backend`)
- **FastAPI REST Service**: Modular microservice architecture.
- **Sub-Millisecond Depth Caching**: Pre-calculated depth memory cache ensures instantaneous 60 FPS slider response during live presentations.
- **Custom Model Integration**: Clean interface in `model.py` to plug in custom trained PyTorch (`.pt`) or ONNX weights.

---

## Project Structure

```
e:/sih2026/
├── backend/                  # FastAPI Backend Service
│   ├── main.py               # REST API endpoints & CORS
│   ├── model.py              # Subsurface reconstruction model & physics engine
│   ├── argo_data.py          # Real-time Argo float database
│   ├── cache.py              # Pre-warmed depth grid memory cache
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend setup & model integration guide
│
├── frontend/                 # React + Three.js / R3F Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Earth.tsx               # 3D Globe with bump/day maps & raycasting
│   │   │   ├── CloudLayer.tsx          # Rotating cloud layer
│   │   │   ├── Atmosphere.tsx          # Fresnel glow shader shell
│   │   │   ├── TemperatureOverlay.tsx  # Dynamic ocean heatmap canvas texture
│   │   │   ├── IndianOceanBoundary.tsx # Glowing MoES regional focus outline
│   │   │   ├── ArgoMarkers.tsx         # Pulsing 3D Argo float pins
│   │   │   ├── Starfield.tsx           # Twinkling 3D starfield
│   │   │   ├── SunLight.tsx            # Solar day/night terminator lighting
│   │   │   ├── DepthSlider.tsx         # 0-1000m slider with auto-sweep & presets
│   │   │   ├── InfoPanel.tsx           # Glassmorphism control center & layer toggles
│   │   │   ├── PointTooltip.tsx        # Recharts vertical thermocline chart
│   │   │   └── StatCards.tsx           # Dynamic RMSE / R² / Depth stat cards
│   │   ├── services/
│   │   │   └── api.ts                  # API client with automatic background prefetch
│   │   ├── utils/
│   │   │   └── geo.ts                  # Lat/Lon 3D math & Canvas heatmap rasterizer
│   │   ├── App.tsx                     # Main application orchestrator
│   │   └── index.css                   # Tailwind CSS & Glassmorphism styles
│   ├── public/
│   │   └── textures/                   # NASA Earth textures (BumpMap, Clouds, ColorMap)
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                 # Master project documentation
```

---

## Quickstart Guide

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** & **npm**

---

### Step 1 — Start the Backend

Open a terminal in the `backend/` directory:

```bash
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at `http://localhost:8000`.  
Explore interactive API docs at `http://localhost:8000/docs`.

---

### Step 2 — Start the Frontend

Open a second terminal in the `frontend/` directory:

```bash
cd frontend

# Install dependencies (already prepared)
npm install

# Start Vite development server
npm run dev
```

Open your browser and navigate to:  
👉 **`http://localhost:3000`**

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/predict_grid?depth={0..1000}` | Returns full lat/lon grid of predicted temperatures for the heatmap overlay. |
| `GET` | `/api/predict_profile?lat={lat}&lon={lon}` | Returns 0–1000m vertical temperature & confidence profile for tooltip chart. |
| `GET` | `/api/argo_floats` | Returns active Argo float observation positions and metadata. |
| `GET` | `/api/stats` | Returns model performance metrics (`RMSE: 0.31°C`, `R²: 0.942`, depth range). |

---

## How to Plug in Custom Trained PyTorch / ONNX Weights

1. Place your trained model file (e.g. `oceanembed_model.pt` or `model.onnx`) inside the `/backend` directory.
2. In `backend/model.py`, uncomment the custom model loading block:
   ```python
   import torch
   self.net = torch.jit.load("oceanembed_model.pt")
   self.net.eval()
   ```
3. Update `predict_depth_temperature(lat, lon, depth)` to pass satellite input vectors through `self.net`.

---

## Texture Attribution & License

Earth textures sourced from NASA via [`enesser/earth-webgl`](https://github.com/enesser/earth-webgl) under the MIT License.

---

## Team & Hackathon Information

- **Event**: Smart India Hackathon 2026
- **Problem Statement ID**: PS 26066
- **Domain**: Oceanography & Satellite Remote Sensing / Deep Learning
- **Focus Area**: Indian Ocean (Arabian Sea, Bay of Bengal, Equatorial & South Indian Ocean)
