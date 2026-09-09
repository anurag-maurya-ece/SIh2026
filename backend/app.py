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
    
    #### Active REST Endpoints:
    - **[GET /api/stats](/api/stats)** — Model validation metrics (RMSE 0.31°C, R² 0.942)
    - **[GET /api/predict_grid?depth=0](/api/predict_grid?depth=0)** — Spatial Indian Ocean thermal grid
    - **[GET /api/predict_profile?lat=24.42&lon=44.05](/api/predict_profile?lat=24.42&lon=44.05)** — 0-1000m continuous thermocline profile
    - **[GET /api/argo_floats](/api/argo_floats)** — Active INCOIS & Global Argo observation telemetry
    - **[GET /docs](/docs)** — Interactive OpenAPI / Swagger documentation
    """)

# Mount Gradio app onto FastAPI
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

# Launch for Hugging Face Spaces
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
else:
    demo.launch()
