from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from models.heart_model import assess_lifestyle_risk

router = APIRouter()

class LifestyleData(BaseModel):
    smoking: bool = False
    alcohol: str = "none"      # none | moderate | heavy
    exercise: str = "moderate" # none | low | moderate | high
    stress: str = "low"        # low | moderate | high
    diet: str = "good"         # good | moderate | poor
    sleep: str = "good"        # good | poor
    obesity: bool = False

@router.post("/")
async def lifestyle_risk(data: LifestyleData):
    try:
        result = assess_lifestyle_risk(data.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
