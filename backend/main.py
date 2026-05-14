from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router
from routes.compare import router as compare_router
from routes.lifestyle import router as lifestyle_router
from routes.history import router as history_router
from routes.report import router as report_router
from routes.bmi import router as bmi_router

app = FastAPI(
    title="HeartAI Prediction API",
    description="Explainable AI-Based Heart Disease Prediction System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://heart-ai-api-kq6f.onrender.com",  
    "https://*.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router,   prefix="/api/predict",   tags=["Prediction"])
app.include_router(compare_router,   prefix="/api/compare",   tags=["Model Comparison"])
app.include_router(lifestyle_router, prefix="/api/lifestyle", tags=["Lifestyle Risk"])
app.include_router(history_router,   prefix="/api/history",   tags=["Patient History"])
app.include_router(report_router,    prefix="/api/report",    tags=["Report Export"])
app.include_router(bmi_router,       prefix="/api/bmi",       tags=["BMI Calculator"])

@app.get("/")
def root():
    return {"message": "HeartAI API v2.0 running"}

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "2.0.0"}
