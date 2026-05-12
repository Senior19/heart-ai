from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class BMIData(BaseModel):
    weight_kg: float
    height_cm: float
    age: int
    gender: int  # 0=Female, 1=Male
    waist_cm: float = 0
    hip_cm: float = 0

@router.post("/calculate")
async def calculate_bmi(data: BMIData):
    height_m = data.height_cm / 100
    bmi = round(data.weight_kg / (height_m ** 2), 1)

    if bmi < 18.5:
        category = "Underweight"
        color = "blue"
        cardiac_risk = "Moderate"
        advice = "Low BMI can indicate nutritional deficiency. Gain weight healthily."
    elif bmi < 25:
        category = "Normal Weight"
        color = "green"
        cardiac_risk = "Low"
        advice = "Excellent! Maintain this weight range with balanced diet and exercise."
    elif bmi < 30:
        category = "Overweight"
        color = "orange"
        cardiac_risk = "Moderate"
        advice = "Losing 5–10% body weight significantly reduces cardiac risk."
    elif bmi < 35:
        category = "Obese Class I"
        color = "red"
        cardiac_risk = "High"
        advice = "Obesity significantly increases risk of heart disease. Consult a dietitian."
    else:
        category = "Obese Class II+"
        color = "darkred"
        cardiac_risk = "Very High"
        advice = "Immediate lifestyle intervention recommended. Seek medical guidance."

    # Ideal weight range
    ideal_min = round(18.5 * (height_m ** 2), 1)
    ideal_max = round(24.9 * (height_m ** 2), 1)

    # Waist-to-Hip ratio (if provided)
    whr = None
    whr_risk = None
    if data.waist_cm > 0 and data.hip_cm > 0:
        whr = round(data.waist_cm / data.hip_cm, 2)
        if data.gender == 1:  # Male
            whr_risk = "High" if whr > 0.9 else "Normal"
        else:  # Female
            whr_risk = "High" if whr > 0.85 else "Normal"

    # Body Fat % estimate (Deurenberg formula)
    body_fat = round((1.20 * bmi) + (0.23 * data.age) - (10.8 * data.gender) - 5.4, 1)
    body_fat = max(0, min(body_fat, 60))

    return {
        "success": True,
        "data": {
            "bmi": bmi,
            "category": category,
            "color": color,
            "cardiac_risk": cardiac_risk,
            "advice": advice,
            "ideal_weight_min": ideal_min,
            "ideal_weight_max": ideal_max,
            "body_fat_percent": body_fat,
            "whr": whr,
            "whr_risk": whr_risk,
            "weight_to_lose": max(0, round(data.weight_kg - ideal_max, 1)),
        }
    }
