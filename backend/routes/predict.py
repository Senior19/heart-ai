from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from models.heart_model import predict_heart_disease

router = APIRouter()

class PatientData(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Patient age")
    gender: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    chest_pain_type: int = Field(..., ge=0, le=3, description="0=Typical Angina, 1=Atypical, 2=Non-anginal, 3=Asymptomatic")
    resting_bp: int = Field(..., ge=50, le=250, description="Resting blood pressure (mmHg)")
    cholesterol: int = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    fasting_blood_sugar: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1=True)")
    resting_ecg: int = Field(..., ge=0, le=2, description="0=Normal, 1=ST-T abnormality, 2=LV hypertrophy")
    max_heart_rate: int = Field(..., ge=50, le=250, description="Maximum heart rate achieved")
    exercise_angina: int = Field(..., ge=0, le=1, description="Exercise induced angina (1=Yes)")
    st_depression: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak exercise ST segment")
    vessels_colored: int = Field(..., ge=0, le=3, description="Number of major vessels colored by fluoroscopy")
    thal: int = Field(..., ge=0, le=3, description="0=Normal, 1=Fixed defect, 2=Reversible defect, 3=Unknown")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 55, "gender": 1, "chest_pain_type": 2,
                "resting_bp": 130, "cholesterol": 250, "fasting_blood_sugar": 0,
                "resting_ecg": 1, "max_heart_rate": 150, "exercise_angina": 0,
                "st_depression": 1.5, "slope": 1, "vessels_colored": 1, "thal": 2
            }
        }

@router.post("/")
async def predict(data: PatientData):
    try:
        result = predict_heart_disease(data.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
