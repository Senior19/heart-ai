from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from models.heart_model import get_model_comparison

router = APIRouter()

class PatientData(BaseModel):
    age: int
    gender: int
    chest_pain_type: int
    resting_bp: int
    cholesterol: int
    fasting_blood_sugar: int
    resting_ecg: int
    max_heart_rate: int
    exercise_angina: int
    st_depression: float
    slope: int
    vessels_colored: int
    thal: int

@router.post("/")
async def compare_models(data: PatientData):
    try:
        result = get_model_comparison(data.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
