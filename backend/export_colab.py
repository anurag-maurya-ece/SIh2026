"""
OceanEmbed Colab Export Script (SIH 2026 PS 26066)
Run this block at the end of your Google Colab Notebook to export your trained
deep learning model predictions directly into the OceanEmbed web app data format.
Notebook: https://colab.research.google.com/drive/1p0HmYI5-CpbVG0shVe4q9Q4sEBSOzULD?usp=sharing
"""

import json

def export_colab_predictions(trained_model, get_argo_fn=None):
    """
    Exports:
    1. ocean_grid_predictions.json (0m to 1000m depth slices)
    2. ocean_profiles.json (Vertical depth profiles for interactive tooltips)
    3. argo_floats.json (Ground-truth observation stations)
    """
    print("Exporting OceanEmbed Subsurface Predictions from Colab...")
    
    depths = [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]
    export_grid = {}

    for d in depths:
        # Calls your model's predict_full_grid or custom inference
        # expected format: [{"lat": float, "lon": float, "temp": float}, ...]
        grid = trained_model.predict_full_grid(d)
        export_grid[str(d)] = grid

    with open("ocean_grid_predictions.json", "w") as f:
        json.dump(export_grid, f)

    # Export sample vertical profiles for Indian Ocean & Global basins
    sample_points = [
        (15.2, 65.4), (18.5, 69.1), (11.8, 62.7), (8.4, 72.3), (14.1, 58.9),
        (14.2, 85.6), (17.8, 88.2), (10.5, 84.1), (12.0, 92.8), (6.8, 88.5),
        (0.5, 80.5), (-4.2, 68.0), (-8.5, 94.0), (-15.0, 75.0), (-22.4, 88.2),
        (10.5, 75.2), (-5.0, 80.0), (15.0, 68.0), (24.5, -45.0), (18.2, 132.5)
    ]
    profiles = {}
    for lat, lon in sample_points:
        profiles[f"{lat},{lon}"] = trained_model.predict_depth_profile(lat, lon)

    with open("ocean_profiles.json", "w") as f:
        json.dump(profiles, f)

    # Export Argo float positions
    if get_argo_fn:
        argo_positions = get_argo_fn()
    else:
        # Default INCOIS & Global Argo locations
        argo_positions = [
            {"id": "ARGO-IN-2902134", "name": "Argo Float 2902134", "lat": 15.2, "lon": 65.4, "basin": "Arabian Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-09-06"},
            {"id": "ARGO-IN-2902188", "name": "Argo Float 2902188", "lat": 18.5, "lon": 69.1, "basin": "Arabian Sea (Oman Basin)", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-09-06"},
            {"id": "ARGO-IN-2903301", "name": "Argo Float 2903301", "lat": 14.2, "lon": 85.6, "basin": "Central Bay of Bengal", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Oxygen", "last_update": "2026-09-06"},
            {"id": "ARGO-IN-3901102", "name": "Argo Float 3901102", "lat": 0.5, "lon": 80.5, "basin": "Equatorial Indian Ocean", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-09-06"}
        ]
        
    with open("argo_floats.json", "w") as f:
        json.dump(argo_positions, f)

    print("Files created! Triggering Colab file downloads...")
    try:
        from google.colab import files
        files.download("ocean_grid_predictions.json")
        files.download("ocean_profiles.json")
        files.download("argo_floats.json")
        print("Done! Move the downloaded files into your backend/data/ folder.")
    except Exception as e:
        print(f"Colab download skipped or not in Colab: {e}")

if __name__ == "__main__":
    from model import model
    from argo_data import get_argo_positions
    export_colab_predictions(model, get_argo_positions)
