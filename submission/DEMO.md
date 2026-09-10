# SIH 2026 Live Demo Guide: OceanEmbed

## 1. Live Deployment & Demo Links

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Demo Video Link:** *(Add your YouTube/Drive demo video link here)*

---

## 2. Key Demo Features & Walkthrough Steps

### Step 1: 3D Global Ocean Visualization & Navigation
1. Open the application. Notice the photorealistic 3D Earth globe with cloud layers, atmosphere glow, and active satellite constellation orbits.
2. Drag with the mouse to rotate the globe, scroll to zoom, and right-click to pan.
3. Observe the glowing MoES Indian Ocean perimeter (30°N to -40°S, 30°E to 120°E).

### Step 2: 0m to 1000m Continuous Depth Sweeping
1. On the **Right Sidebar**, locate the **Subsurface Depth Level Slider**.
2. Drag the slider from `0m` to `1000m` to witness real-time thermal layer transformations across:
   - **Epipelagic Mixed Layer (0–100m)**: Warm surface water coupled with atmosphere.
   - **Main Thermocline (100–450m)**: Rapid temperature decline zone.
   - **Deep Ocean (450–1000m)**: Cold isothermal abyssal layer (~4–6°C).
3. Click the **Auto-Sweep** button to watch automated vertical continuous scanning.

### Step 3: In-Situ Argo Float & Coordinate Profile Inspection
1. Hover over any pulsing **Argo Float pin** on the globe to view real-time floating telemetry.
2. Click the float or click **Full Profile** on the Left Sidebar to open the **Full CTD Depth Profile Modal**.
3. Inspect the vertical temperature curve, Mixed Layer Depth (MLD) annotation, and export the profile data via CSV/JSON.

### Step 4: 3D Subsurface Ocean Block Slice View
1. Click the **3D Ocean Block** button in the Top Navbar or Left Sidebar.
2. Interact with the standalone 3D volumetric water cube:
   - Switch camera views: **Isometric**, **Front Slice**, **Side Profile**, **Surface View**.
   - Sweep the depth scrubber plane and inspect the HUD telemetry card.

### Step 5: Modals for Scientific Governance
1. Click **Constellation** (`Satellite` icon) in the Top Navbar to inspect the 6 active satellites (Sentinel-6, Jason-3, INSAT-3DR, Oceansat-3, SWOT, SARAL).
2. Click **Analytics** (`BarChart3` icon) to view AI validation metrics ($R^2 = 0.945$, $\text{RMSE} = 0.28^\circ\text{C}$).
3. Click **Mission Info** (`Info` icon) to view the MoES architecture pipeline.

---

## 3. Recommended Test Coordinates for Jury Evaluation

| Region | Latitude | Longitude | Characteristics |
| :--- | :--- | :--- | :--- |
| **Arabian Sea** | `15.5° N` | `65.0° E` | High Salinity, Strong Seasonal Upwelling |
| **Bay of Bengal** | `14.0° N` | `88.5° E` | Freshwater Stratification, Intense Tropical Cyclogenesis |
| **Equatorial Indian Ocean** | `0.0°` | `80.5° E` | Wyrtki Jets, Deep Thermocline Dynamics |
| **Southern Indian Ocean** | `-32.0° S` | `77.5° E` | Sub-polar Fronts, Cold Deep Water Mass |
