# Linking your Colab model to the OceanEmbed backend

Your `backend/main.py` already reads 3 files from `backend/data/`:
`ocean_grid_predictions.json`, `ocean_profiles.json`, `argo_floats.json`.
If these files exist, the API serves YOUR real model's output automatically —
no other code change needed. The minimal UI (Earth + depth-controlled 
subsurface overlay + click profile) will then show real results.

`backend/export_colab.py` already exists to generate these files, but it 
expects your trained model to expose two methods:
- `predict_full_grid(depth)` -> list of {"lat", "lon", "temp"}
- `predict_depth_profile(lat, lon)` -> list of {"depth", "temp", ...}

Your actual Colab model almost certainly does NOT expose exactly this shape. 
Below are 3 adapter templates — pick whichever matches how your model works, 
paste the matching one as the LAST cell in your Colab notebook, run it, then 
download the 3 resulting JSON files and drop them into `backend/data/`.

---

## Template A — your model is a Keras/TensorFlow model
```python
import numpy as np, json

class ColabModelAdapter:
    def __init__(self, keras_model, scaler_X=None, scaler_y=None):
        self.model = keras_model
        self.scaler_X = scaler_X   # optional: if you normalized inputs during training
        self.scaler_y = scaler_y   # optional: if you normalized the target

    def _predict_one(self, lat, lon, depth):
        x = np.array([[lat, lon, depth]])  # <-- match your model's actual input feature order
        if self.scaler_X: x = self.scaler_X.transform(x)
        y = self.model.predict(x, verbose=0)
        if self.scaler_y: y = self.scaler_y.inverse_transform(y)
        return float(y[0][0])

    def predict_full_grid(self, depth, resolution=3.0):
        grid = []
        for lat in np.arange(-75, 76, resolution):
            for lon in np.arange(-180, 181, resolution):
                grid.append({"lat": float(lat), "lon": float(lon),
                             "temp": round(self._predict_one(lat, lon, depth), 2)})
        return grid

    def predict_depth_profile(self, lat, lon):
        depths = [0,10,25,50,75,100,150,200,300,400,500,600,700,800,900,1000]
        return [{"depth": d, "temp": round(self._predict_one(lat, lon, d), 2)} for d in depths]

adapter = ColabModelAdapter(your_trained_keras_model)  # <-- your variable name here
import sys; sys.path.append('.')
from export_colab import export_colab_predictions
export_colab_predictions(adapter)
```

## Template B — your model is scikit-learn / XGBoost / a simple `.predict(X)` object
```python
import numpy as np

class ColabModelAdapter:
    def __init__(self, sk_model):
        self.model = sk_model

    def _predict_one(self, lat, lon, depth):
        x = np.array([[lat, lon, depth]])  # match your training feature order exactly
        return float(self.model.predict(x)[0])

    def predict_full_grid(self, depth, resolution=3.0):
        grid = []
        for lat in np.arange(-75, 76, resolution):
            for lon in np.arange(-180, 181, resolution):
                grid.append({"lat": float(lat), "lon": float(lon),
                             "temp": round(self._predict_one(lat, lon, depth), 2)})
        return grid

    def predict_depth_profile(self, lat, lon):
        depths = [0,10,25,50,75,100,150,200,300,400,500,600,700,800,900,1000]
        return [{"depth": d, "temp": round(self._predict_one(lat, lon, d), 2)} for d in depths]

adapter = ColabModelAdapter(your_trained_sklearn_model)
from export_colab import export_colab_predictions
export_colab_predictions(adapter)
```

## Template C — your model outputs a full profile per (lat,lon) in ONE forward pass
(e.g. it predicts all 16 depth levels at once, rather than one depth at a time)
```python
import numpy as np

class ColabModelAdapter:
    def __init__(self, model):
        self.model = model
        self.depths = [0,10,25,50,75,100,150,200,300,400,500,600,700,800,900,1000]

    def _predict_profile_raw(self, lat, lon):
        x = np.array([[lat, lon]])  # match your model's actual input
        y = self.model.predict(x)   # expected shape: (1, 16) matching self.depths
        return y[0]

    def predict_full_grid(self, depth, resolution=3.0):
        depth_idx = self.depths.index(depth) if depth in self.depths else 0
        grid = []
        for lat in np.arange(-75, 76, resolution):
            for lon in np.arange(-180, 181, resolution):
                temps = self._predict_profile_raw(lat, lon)
                grid.append({"lat": float(lat), "lon": float(lon), "temp": round(float(temps[depth_idx]), 2)})
        return grid

    def predict_depth_profile(self, lat, lon):
        temps = self._predict_profile_raw(lat, lon)
        return [{"depth": d, "temp": round(float(t), 2)} for d, t in zip(self.depths, temps)]

adapter = ColabModelAdapter(your_trained_model)
from export_colab import export_colab_predictions
export_colab_predictions(adapter)
```

---

## After running the export cell in Colab
1. Three files download: `ocean_grid_predictions.json`, `ocean_profiles.json`, `argo_floats.json`
2. Move all three into `backend/data/` in your project (overwrite if placeholders exist)
3. Restart the backend: `uvicorn main:app --reload`
4. Refresh the frontend — the globe now renders YOUR real model's subsurface predictions, 
   not the physics-emulator placeholder in `model.py`

No frontend change is needed for this step — `main.py` already prefers the exported JSON 
files over the built-in emulator automatically.

---

## If none of these 3 templates match your model
Share the exact code cell where you call `.predict(...)` (or equivalent) in your notebook, 
or make the Colab link viewable ("Anyone with the link"), and the adapter can be written 
to match your model's exact input/output shape precisely instead of guessing.
