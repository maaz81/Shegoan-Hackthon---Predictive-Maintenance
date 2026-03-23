from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class LogRequest(BaseModel):
    log: str

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}

@app.post("/analyze")
def analyze(request: LogRequest):
    log = request.log.lower()

    if "vibration" in log and "temperature" in log:
        risk = "High"
        reason = "Mechanical stress detected"
    elif "vibration" in log:
        risk = "Medium"
        reason = "Abnormal vibration"
    elif "temperature" in log:
        risk = "Medium"
        reason = "Overheating risk"
    else:
        risk = "Low"
        reason = "Normal condition"

    return {
        "log": request.log,
        "risk": risk,
        "reason": reason
    }