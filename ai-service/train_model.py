import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("dataset.csv")

df.dropna(subset=["temperature_motor", "vibration_rms", "rpm", "failure_within_24h"], inplace=True)

X = df[["temperature_motor", "vibration_rms", "rpm"]]
y = df["failure_within_24h"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained!")