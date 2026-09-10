# OceanEmbed Architecture & Technical Specification

## 1. System Overview

**OceanEmbed** is an end-to-end AI-driven digital twin engineered for **Ministry of Earth Sciences (MoES) Problem Statement 26066**. It reconstructs continuous 3D subsurface ocean temperature and salinity profiles (0 to 1000m depth) across the Indian Ocean basin (30°N to -40°S, 30°E to 120°E) by fusing multi-satellite surface observations with deep neural representation learning.

```text
+-----------------------------------------------------------------------------------+
|                        SATELLITE SURFACE OBSERVATION LAYER                        |
|   Sentinel-6 / Jason-3       INSAT-3DR (Thermal IR)      Oceansat-3 / SWOT        |
|  [Altimetry / SSHA (m)]     [Sea Surface Temp (SST)]   [Wind Stress (tau_x,y)]    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     DATA INGESTION & GEOSPATIAL NORMALIZATION                     |
|  - Spatial Binning (0.25 deg x 0.25 deg Indian Ocean Grid: -40 to 30 Lat, 30 to 120 Lon)
|  - Real-Time In-Situ Argo Float Downlink & Quality Control Filtering             |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                PHYSICS-INFORMED NEURAL INVERSION ENGINE (PyTorch/ONNX)            |
|  - Feature Ingestion: [Lat, Lon, Depth (z), SST, SSHA, Wind_U, Wind_V, DayOfYear] |
|  - Multi-Head Stratification Encoder + Thermocline Inversion Network             |
|  - Physical Constraints: Monotonicity (\partial T / \partial z <= 0), Density      |
|  - Output: T(z), S(z) for z in [0m, 1000m] with Prediction Confidence Interval    |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       FASTAPI REST MICROSERVICE LAYER (<12ms)                     |
|  - GET /api/predict_grid (Pre-cached multi-depth 2D slice matrices)               |
|  - GET /api/predict_profile (0-1000m vertical CTD profile at exact coordinate)   |
|  - GET /api/argo_floats (Active in-situ telemetry stations)                       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                    INTERACTIVE 3D WEBGL CLIENT (Three.js / React)                 |
|  - Photorealistic 3D Earth Globe with Rayleigh Atmosphere & Bump Relief           |
|  - 3D Satellite Constellation Orbits & Real-time Overpass Tracking               |
|  - Continuous 0-1000m Depth Plane Scrubber & Auto-Sweep Animation                 |
|  - Standalone 3D Volumetric Water Column Slice (OceanBlockView)                   |
|  - Recharts Vertical CTD Thermocline Profile with Mixed Layer Depth (MLD) Marker  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Deep Learning Subsurface Inversion Model

### 2.1 Input Feature Space
For any given target coordinate $(lat, lon, z)$ at time $t$:
$$\mathbf{X} = [\phi, \lambda, z, \text{SST}, \eta, \tau_x, \tau_y, \sin(2\pi d/365), \cos(2\pi d/365)]$$
where:
- $\phi, \lambda$: Latitude and Longitude coordinates
- $z$: Target depth ($0 \le z \le 1000\text{ m}$)
- $\text{SST}$: Sea Surface Temperature from thermal infrared radiometers (°C)
- $\eta$: Sea Surface Height Anomaly from radar altimeters (m)
- $\tau_x, \tau_y$: Zonal and meridional surface wind stress vectors ($\text{N/m}^2$)
- $d$: Day of year (seasonal phase embedding)

### 2.2 Physics Constraints in Loss Formulation
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{MSE}} + \lambda_{\text{mono}} \mathcal{L}_{\text{monotonicity}} + \lambda_{\text{strat}} \mathcal{L}_{\text{thermocline}}$$

- **Observation Fit**: $\mathcal{L}_{\text{MSE}} = \frac{1}{N} \sum (T_{\text{pred}}(z) - T_{\text{Argo}}(z))^2$
- **Thermal Monotonicity**: Penalizes unphysical temperature inversions in the deep bathypelagic layer:
$$\mathcal{L}_{\text{mono}} = \text{ReLU}\left(\frac{\partial T_{\text{pred}}}{\partial z}\right)$$
- **Thermocline Gradient**: Accurately reproduces the high-gradient inflection point ($|\frac{\partial^2 T}{\partial z^2}|_{\max}$) defining the Mixed Layer Base.

---

## 3. Frontend 3D Graphics Architecture

1. **Fiber & Drei Viewport Orchestration**: Renders 60 FPS hardware-accelerated WebGL scenes via `@react-three/fiber` and custom GLSL vertex/fragment shaders.
2. **Dynamic Canvas Heatmap Rasterization**: Maps 2D predicted depth matrices onto high-density 3D sphere uv-coordinates via customized `HTMLCanvasElement` textures without frame drops.
3. **Subsurface Cutaway Pillar**: Renders physical depth cylinders displaying glowing strata rings at $0\text{m}$, $150\text{m}$, $300\text{m}$, and $1000\text{m}$ along with laser cursor trackers.
