"""
OceanEmbed Hugging Face Space Entrypoint (FastAPI + Gradio Mount)
SIH 2026 - Problem Statement 26066
"""

import gradio as gr
from main import app as fastapi_app

# Gradio visual preview interface
with gr.Blocks(title="OceanEmbed — Real-Time Subsurface AI") as demo:
    gr.Markdown("""
    # 🌊 OceanEmbed: Satellite Embedding Subsurface Ocean Reconstruction
    ### Smart India Hackathon 2026 — MoES / INCOIS (Problem Statement 26066)
    
    This Space hosts the **FastAPI REST API** and **AI Model Inference Engine** powering the 3D Ocean Visualizer.
    
    #### Active Endpoints:
    - `GET /api/stats` — Model validation metrics (RMSE 0.31°C, R² 0.942)
    - `GET /api/predict_grid?depth={0-1000}` — Spatial Indian Ocean thermal grid
    - `GET /api/predict_profile?lat={lat}&lon={lon}` — 0-1000m continuous thermocline profile
    - `GET /api/argo_floats` — Active INCOIS & Global Argo observation telemetry
    - `GET /docs` — Interactive OpenAPI / Swagger documentation
    """)

# Mount FastAPI app into Gradio on root
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
