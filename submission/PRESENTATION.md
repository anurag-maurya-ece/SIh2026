# SIH 2026 Presentation Pitch Deck: OceanEmbed

**Problem Statement ID:** 26066  
**Problem Statement Title:** Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations  
**Ministry:** Ministry of Earth Sciences (MoES) / INCOIS  
**Team Name / Track:** Software / Clean & Green Ocean  

---

## Slide 1: Title & Vision
- **Project Name:** OceanEmbed
- **Tagline:** AI-Powered 3D Subsurface Ocean Digital Twin
- **Objective:** Transforming multi-mission surface satellite feeds into 0–1000m 3D subsurface thermal fields in real-time.

---

## Slide 2: The Core Problem
- 71% of Earth is ocean, yet subsurface thermal structures are notoriously sparse.
- In-situ sensors (Argo Floats) cover only 1 float per $300\text{ km} \times 300\text{ km}$ box.
- Deep ocean temperature down to 1000m drives **Cyclone Intensification**, **Monsoon Predictability**, and **Naval Acoustic Propagation**, but cannot be directly observed from satellites.

---

## Slide 3: Our Proposed Solution
- **Physics-Informed Deep Neural Inversion**: Fusing Altimetry (SSHA), Sea Surface Temperature (SST), and Wind Stress to reconstruct 0–1000m vertical profiles.
- **Ultra-Fast REST API Engine**: Pre-cached and on-the-fly inference yielding `<12ms` response latency.
- **Interactive 3D WebGL Digital Twin**: Real-time depth slicing, Argo float verification, satellite tracking, and standalone 3D volumetric ocean block slicing.

---

## Slide 4: Architecture & Technical Pipeline
- Ingestion of INSAT-3DR, Sentinel-6, Oceansat-3, and SWOT observations.
- Physics constraints: Monotonic temperature descent with depth and Mixed Layer Depth gradient preservation.
- WebGL 3D rendering with custom GLSL shaders and dynamic Canvas raster textures.

---

## Slide 5: Model Validation & Key Metrics
- **Global RMSE:** $0.28^\circ\text{C}$ (against in-situ CTD profiles)
- **$R^2$ Score:** $0.945$ across the Indian Ocean basin
- **Mean Absolute Error (MAE):** $0.21^\circ\text{C}$
- **Inference Latency:** $<12\text{ms}$

---

## Slide 6: Live Demonstration Highlights
- 3D Globe with interactive depth sweeping from $0\text{m}$ to $1000\text{m}$.
- Real-time Satellite Constellation orbits with overpass telemetry.
- 3D Ocean Block Slice view with camera angle controls and thermal spectrum mapping.
- Recharts vertical CTD temperature and salinity distribution graphs.

---

## Slide 7: Operational Impact & Future Scope
- **Disaster Preparedness:** 48-hour advance cyclone heat potential (TCHP) warnings.
- **Monsoon Forecasting:** Precise heat content tracking for Indian Summer Monsoon onset.
- **Naval Defense:** Acoustic shadow zone and sound velocity profile (SVP) modeling.
- **Future Integration:** Direct coupling with INCOIS live ERDDAP servers and automated daily NetCDF reanalysis assimilation.
