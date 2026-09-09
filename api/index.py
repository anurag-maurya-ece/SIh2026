import sys
import os
from pathlib import Path

# Add backend directory to python path
backend_path = str(Path(__file__).parent.parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import the FastAPI instance
from main import app
