# SIH 2026 Presentation: OceanEmbed (Team REGALIA)

**Problem Statement ID:** SIH26066  
**Problem Statement Title:** Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations  
**Theme:** Disaster Management  
**PS Category:** Software  
**Team Name:** REGALIA  

---

## Final Presentation File

The official presentation file is included in this repository:
- **PDF Document:** [`Team_REGALIA_SIH2026_Presentation.pdf`](./Team_REGALIA_SIH2026_Presentation.pdf)

---

## Slide Breakdown & Content

### Slide 1: Title & Team Information
- **Project Title:** OceanEmbed — Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations
- **PS ID:** SIH26066
- **Theme:** Disaster Management
- **Category:** Software
- **Team Name:** REGALIA

---

### Slide 2: The Problem & The Gap
- **What Exists Today:** Accurate surface satellite measurements, wide surface coverage, and numerical model-based 3D data.
- **The Critical Gap:** Continuous real-time subsurface information is still missing. Sparse in-situ ARGO sensors cannot provide continuous spatial-temporal coverage.
- **The Solution:** A deep learning framework fusing surface satellite embeddings to reconstruct continuous 0–1000m 3D subsurface thermal fields in real-time.

---

### Slide 3: Technical Approach & Data Pipeline
1. **Data Sources:** Multi-satellite inputs (SST, SSS, SLA/ADT, Wind Stress, Chlorophyll).
2. **Data Processing:** Standardizing heterogeneous datasets to a unified $0.25^\circ \times 0.25^\circ$ daily grid.
3. **Model Architecture:** Deep learning fusion network mapping multi-modal surface observations to depth-wise thermal profiles.
4. **Prediction Output:** Daily 3D subsurface temperature fields ($0\text{m}$ to $1000\text{m}$) at $0.25^\circ$ resolution.
5. **Validation:** Statistical error metrics ($R^2$, RMSE, MAE) against independent quality-controlled in-situ ARGO float profiles.

---

### Slide 4: Feasibility, Risks & Mitigations
1. **Satellite Data Gaps (Clouds, Noise):** Fusing multiple complementary sources with quality control, spatial alignment, and missing-data handling.
2. **Surface Data $\neq$ Subsurface Temp:** Fusing SST + SSS + SLA/ADT + Wind + Chlorophyll + Spatio-temporal embeddings.
3. **Different Dataset Resolutions:** Standardizing all sources to a $0.25^\circ \times 0.25^\circ$ daily grid.
4. **Reanalysis Model Bias (GLORYS):** GLORYS provides dense training reference, while independent ARGO observations strictly validate predictions.
5. **Sparse ARGO Observations:** Maintaining ARGO independent for unbiased statistical validation.

---

### Slide 5: Key Impacts & Benefits (6 Core Pillars)
1. **3D Ocean Visibility:** Estimates temperature beneath the surface down to 1000m.
2. **Cyclone Monitoring:** Reveals subsurface ocean heat content (OHC) that fuels tropical cyclone intensity.
3. **Marine Heatwave Detection:** Identifies thermal anomalies hidden below the surface.
4. **Fisheries & Ecosystems:** Provides depth-wise thermal information for marine habitats.
5. **Better Ocean Forecasting:** Adds continuous 3D temperature fields into operational numerical forecast models.
6. **High-Resolution Monitoring:** Daily temperature estimates at $0.25^\circ$ resolution across the North Indian Ocean.

---

### Slide 6: Research & References
- Satellite Altimetry & Microwave Radiometry (Sentinel-6, Jason-3, INSAT-3DR, Oceansat-3).
- Copernicus Marine Environment Monitoring Service (CMEMS / GLORYS12V1).
- INCOIS Indian Ocean Argo Float Program & Global Ocean Data Assimilation System (GODAS).
