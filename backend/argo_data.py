"""
Argo Float Network Data Provider
Provides real & realistic Argo float positions and profile telemetry across the Indian Ocean and global basins.
"""

from typing import List, Dict, Any

ARGO_FLOATS_DATABASE: List[Dict[str, Any]] = [
    # --- Arabian Sea (INCOIS / Indian Argo Network) ---
    {"id": "ARGO-IN-2902134", "name": "Argo Float 2902134", "lat": 15.2, "lon": 65.4, "basin": "Arabian Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-25"},
    {"id": "ARGO-IN-2902188", "name": "Argo Float 2902188", "lat": 18.5, "lon": 69.1, "basin": "Arabian Sea (Oman Basin)", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-2902201", "name": "Argo Float 2902201", "lat": 11.8, "lon": 62.7, "basin": "Central Arabian Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-24"},
    {"id": "ARGO-IN-2902245", "name": "Argo Float 2902245", "lat": 8.4, "lon": 72.3, "basin": "Lakshadweep Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Oxygen", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-2902290", "name": "Argo Float 2902290", "lat": 14.1, "lon": 58.9, "basin": "Western Arabian Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-25"},

    # --- Bay of Bengal (INCOIS) ---
    {"id": "ARGO-IN-2903301", "name": "Argo Float 2903301", "lat": 14.2, "lon": 85.6, "basin": "Central Bay of Bengal", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Oxygen", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-2903322", "name": "Argo Float 2903322", "lat": 17.8, "lon": 88.2, "basin": "Northern Bay of Bengal", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-2903350", "name": "Argo Float 2903350", "lat": 10.5, "lon": 84.1, "basin": "Southwest Bay of Bengal", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-23"},
    {"id": "ARGO-IN-2903399", "name": "Argo Float 2903399", "lat": 12.0, "lon": 92.8, "basin": "Andaman Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-25"},
    {"id": "ARGO-IN-2903410", "name": "Argo Float 2903410", "lat": 6.8, "lon": 88.5, "basin": "Sri Lanka Basin", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},

    # --- Equatorial & South Indian Ocean ---
    {"id": "ARGO-IN-3901102", "name": "Argo Float 3901102", "lat": 0.5, "lon": 80.5, "basin": "Equatorial Indian Ocean", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-25"},
    {"id": "ARGO-IN-3901140", "name": "Argo Float 3901140", "lat": -4.2, "lon": 68.0, "basin": "Seychelles-Chagos Ridge", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-24"},
    {"id": "ARGO-IN-3901185", "name": "Argo Float 3901185", "lat": -8.5, "lon": 94.0, "basin": "Cocos Basin", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-3901210", "name": "Argo Float 3901210", "lat": -15.0, "lon": 75.0, "basin": "Central South Indian Ocean", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-25"},
    {"id": "ARGO-IN-3901275", "name": "Argo Float 3901275", "lat": -22.4, "lon": 88.2, "basin": "Wharton Basin", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Oxygen", "last_update": "2026-08-26"},
    {"id": "ARGO-IN-3901300", "name": "Argo Float 3901300", "lat": -18.2, "lon": 55.4, "basin": "Madagascar Basin", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-23"},
    {"id": "ARGO-IN-3901350", "name": "Argo Float 3901350", "lat": -28.0, "lon": 65.0, "basin": "Southwest Indian Ridge", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},

    # --- Western Pacific & Atlantic Global Reference Network ---
    {"id": "ARGO-GL-5906101", "name": "Argo Float 5906101", "lat": 18.2, "lon": 132.5, "basin": "Philippine Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},
    {"id": "ARGO-GL-5906230", "name": "Argo Float 5906230", "lat": 5.0, "lon": 160.0, "basin": "Western Tropical Pacific", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-25"},
    {"id": "ARGO-GL-4902120", "name": "Argo Float 4902120", "lat": 24.5, "lon": -45.0, "basin": "North Atlantic Gyre", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-26"},
    {"id": "ARGO-GL-4902205", "name": "Argo Float 4902205", "lat": -12.0, "lon": -25.0, "basin": "South Atlantic", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Oxygen", "last_update": "2026-08-24"},
    {"id": "ARGO-GL-6901840", "name": "Argo Float 6901840", "lat": 36.5, "lon": 18.2, "basin": "Mediterranean Sea", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-BioArgo", "last_update": "2026-08-26"},
    {"id": "ARGO-GL-7901122", "name": "Argo Float 7901122", "lat": -45.0, "lon": 85.0, "basin": "Southern Ocean (ACC)", "status": "ACTIVE", "last_depth_m": 1000, "sensor_type": "CTD-Standard", "last_update": "2026-08-25"}
]

def get_argo_positions() -> List[Dict[str, Any]]:
    """Return all active Argo float positions and metadata."""
    return ARGO_FLOATS_DATABASE
