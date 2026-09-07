"""
Depth Grid In-Memory Cache
Pre-computes and caches grid responses for instant sub-millisecond serving during demo presentations.
"""

from typing import Dict, List, Any
from model import model

CACHED_DEPTHS = [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]
_GRID_CACHE: Dict[int, List[Dict[str, float]]] = {}

def initialize_grid_cache(resolution: float = 3.5):
    """
    Generate and pre-warm memory cache for all standard depth slices.
    """
    print("[OceanEmbed Cache] Pre-warming depth grid cache (0m to 1000m)...")
    for depth in CACHED_DEPTHS:
        _GRID_CACHE[depth] = model.predict_full_grid(depth=depth, resolution=resolution)
    print(f"[OceanEmbed Cache] Successfully pre-cached {len(_GRID_CACHE)} depth slices.")

def get_cached_or_compute_grid(depth: int, resolution: float = 3.5) -> List[Dict[str, float]]:
    """
    Return grid from memory cache if available, or compute on-the-fly and cache.
    """
    # Snap to nearest 50m if close
    snapped_depth = min(CACHED_DEPTHS, key=lambda d: abs(d - depth))
    if abs(snapped_depth - depth) <= 25 and snapped_depth in _GRID_CACHE:
        return _GRID_CACHE[snapped_depth]
        
    if depth in _GRID_CACHE:
        return _GRID_CACHE[depth]
        
    grid = model.predict_full_grid(depth=depth, resolution=resolution)
    _GRID_CACHE[depth] = grid
    return grid
