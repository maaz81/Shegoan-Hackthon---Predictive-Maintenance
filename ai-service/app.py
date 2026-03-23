from fastapi import FastAPI
from pydantic import BaseModel
from rule_engine import rule_analysis
from ml_model import predict_failure
from nlp_engine import generate_explanation

app = FastAPI()

class InputData(BaseModel):
    log: str
    temp: float
    vibration: float
    rpm: float

@app.post("/analyze")
def analyze(data: InputData):
    # Rule-based
    rule_risk, rule_reason = rule_analysis(data.log)

    # ML prediction
    ml_risk = predict_failure(data.temp, data.vibration, data.rpm)

    # Final decision
    final_risk = "High" if "High" in [rule_risk, ml_risk] else "Low"

    # NLP explanation
    explanation = generate_explanation(data.log, final_risk)

    return {
        "rule_based": rule_risk,
        "ml_prediction": ml_risk,
        "final_risk": final_risk,
        "explanation": explanation
    }