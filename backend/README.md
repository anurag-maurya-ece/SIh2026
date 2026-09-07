# OceanEmbed — Backend (FastAPI)

FastAPI service delivering predicted subsurface ocean temperatures from surface satellite embeddings, along with Argo float ground truth telemetry.

## Setup & Running

1. Create and activate a Python virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be live at `http://localhost:8000`.
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

## Endpoints

- `GET /api/predict_grid?depth={depth}`: Returns the full lat/lon grid of reconstructed temperatures at the specified depth (0m to 1000m).
- `GET /api/predict_profile?lat={lat}&lon={lon}`: Returns a 16-point vertical temperature & confidence profile (0m to 1000m) at any coordinate.
- `GET /api/argo_floats`: Returns active Argo float observation positions.
- `GET /api/stats`: Returns model metrics (RMSE: 0.31°C, R² score, depth range, satellite input features).

---

## How to Plug in Your Trained PyTorch / ONNX Model

To replace the built-in emulator with your actual trained model:
1. Open `model.py`.
2. In `OceanEmbedModel._load_custom_model(path)`, uncomment the PyTorch / ONNX loading logic:
   ```python
   import torch
   self.net = torch.jit.load("my_oceanembed_weights.pt")
   self.net.eval()
   ```
3. Update `predict_depth_temperature(lat, lon, depth)` to feed the satellite input tensors (`[sst, ssh, sss, wind_u, wind_v, lat, lon, depth]`) into your neural network:
   ```python
   tensor_input = torch.tensor([[lat, lon, depth, ...]], dtype=torch.float32)
   with torch.no_grad():
       predicted_temp = self.net(tensor_input).item()
   return predicted_temp
   ```
