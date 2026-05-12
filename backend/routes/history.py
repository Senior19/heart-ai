from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json, os

router = APIRouter()
HISTORY_FILE = "patient_history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE) as f:
            return json.load(f)
    return []

def save_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

class HistoryEntry(BaseModel):
    patient_name: Optional[str] = "Anonymous"
    age: int
    gender: int
    risk_score: float
    risk_level: str
    cholesterol: int
    resting_bp: int
    max_heart_rate: int
    timestamp: Optional[str] = None

@router.post("/save")
async def save_record(entry: HistoryEntry):
    try:
        history = load_history()
        record = entry.dict()
        record["id"] = len(history) + 1
        record["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        history.append(record)
        save_history(history)
        return {"success": True, "message": "Record saved", "id": record["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all")
async def get_all():
    try:
        history = load_history()
        return {"success": True, "data": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{record_id}")
async def delete_record(record_id: int):
    try:
        history = load_history()
        history = [h for h in history if h.get("id") != record_id]
        save_history(history)
        return {"success": True, "message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear/all")
async def clear_all():
    save_history([])
    return {"success": True, "message": "History cleared"}
