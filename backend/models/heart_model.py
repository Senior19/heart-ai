import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.datasets import make_classification
import joblib
import os

# ─── Generate synthetic training data (replace with real Cleveland Heart Dataset) ───
def generate_training_data():
    np.random.seed(42)
    n = 1000

    age = np.random.randint(29, 77, n)
    gender = np.random.randint(0, 2, n)
    cp = np.random.randint(0, 4, n)           # chest pain type
    trestbps = np.random.randint(94, 200, n)  # resting blood pressure
    chol = np.random.randint(126, 564, n)     # cholesterol
    fbs = np.random.randint(0, 2, n)          # fasting blood sugar
    restecg = np.random.randint(0, 3, n)      # resting ECG
    thalach = np.random.randint(71, 202, n)   # max heart rate
    exang = np.random.randint(0, 2, n)        # exercise induced angina
    oldpeak = np.round(np.random.uniform(0, 6.2, n), 1)  # ST depression
    slope = np.random.randint(0, 3, n)
    ca = np.random.randint(0, 4, n)
    thal = np.random.randint(0, 4, n)

    # Create realistic risk based on features
    risk_score = (
        0.03 * age +
        0.5 * gender +
        0.4 * cp +
        0.02 * trestbps +
        0.005 * chol +
        0.3 * fbs +
        0.2 * restecg +
        -0.01 * thalach +
        0.5 * exang +
        0.3 * oldpeak +
        0.2 * slope +
        0.4 * ca +
        0.3 * thal
        + np.random.normal(0, 0.5, n)
    )
    target = (risk_score > np.percentile(risk_score, 50)).astype(int)

    X = np.column_stack([age, gender, cp, trestbps, chol, fbs, restecg,
                          thalach, exang, oldpeak, slope, ca, thal])
    return X, target

FEATURE_NAMES = [
    "age", "gender", "chest_pain_type", "resting_bp", "cholesterol",
    "fasting_blood_sugar", "resting_ecg", "max_heart_rate",
    "exercise_angina", "st_depression", "slope", "vessels_colored", "thal"
]

FEATURE_LABELS = [
    "Age", "Gender", "Chest Pain Type", "Resting BP", "Cholesterol",
    "Fasting Blood Sugar", "Resting ECG", "Max Heart Rate",
    "Exercise Angina", "ST Depression", "Slope", "Vessels Colored", "Thal"
]

scaler = StandardScaler()
models = {}
accuracies = {}

def train_models():
    global scaler, models, accuracies
    X, y = generate_training_data()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    model_configs = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost (GBM)": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
    }

    for name, model in model_configs.items():
        model.fit(X_train_sc, y_train)
        preds = model.predict(X_test_sc)
        acc = round(accuracy_score(y_test, preds) * 100, 2)
        models[name] = model
        accuracies[name] = acc

    print("✅ Models trained successfully")
    print("Accuracies:", accuracies)

# Train on startup
train_models()

def predict_heart_disease(features: dict) -> dict:
    """Main prediction function using Random Forest (best model)"""
    input_array = np.array([[
        features["age"],
        features["gender"],
        features["chest_pain_type"],
        features["resting_bp"],
        features["cholesterol"],
        features["fasting_blood_sugar"],
        features["resting_ecg"],
        features["max_heart_rate"],
        features["exercise_angina"],
        features["st_depression"],
        features["slope"],
        features["vessels_colored"],
        features["thal"]
    ]])

    input_scaled = scaler.transform(input_array)
    model = models["Random Forest"]

    prob = model.predict_proba(input_scaled)[0][1]
    risk_score = round(prob * 100, 1)

    if risk_score < 30:
        risk_level = "Low Risk"
        risk_color = "green"
    elif risk_score < 60:
        risk_level = "Medium Risk"
        risk_color = "orange"
    else:
        risk_level = "High Risk"
        risk_color = "red"

    # --- SHAP-like feature importance explanation (using RF feature importances) ---
    rf = models["Random Forest"]
    importances = rf.feature_importances_
    input_vals = input_array[0]

    # Normalize contributions
    contributions = []
    for i, (fname, flabel, imp, val) in enumerate(zip(FEATURE_NAMES, FEATURE_LABELS, importances, input_vals)):
        # Direction: above average increases risk
        contributions.append({
            "feature": flabel,
            "key": fname,
            "value": float(val),
            "importance": round(float(imp) * 100, 2),
        })

    contributions.sort(key=lambda x: x["importance"], reverse=True)
    top_factors = contributions[:5]

    # --- Generate health recommendations ---
    recommendations = generate_recommendations(features, risk_level)

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "probability": round(float(prob), 4),
        "top_factors": top_factors,
        "all_factors": contributions,
        "recommendations": recommendations,
        "model_used": "Random Forest"
    }

def get_model_comparison(features: dict) -> dict:
    """Compare all models on the same input"""
    input_array = np.array([[
        features["age"], features["gender"], features["chest_pain_type"],
        features["resting_bp"], features["cholesterol"], features["fasting_blood_sugar"],
        features["resting_ecg"], features["max_heart_rate"], features["exercise_angina"],
        features["st_depression"], features["slope"], features["vessels_colored"], features["thal"]
    ]])
    input_scaled = scaler.transform(input_array)

    results = []
    for name, model in models.items():
        prob = model.predict_proba(input_scaled)[0][1]
        results.append({
            "model": name,
            "accuracy": accuracies[name],
            "risk_score": round(prob * 100, 1),
            "prediction": "High Risk" if prob >= 0.5 else "Low Risk"
        })

    return {"comparisons": results}

def generate_recommendations(features: dict, risk_level: str) -> list:
    recs = []

    if features["resting_bp"] > 140:
        recs.append({
            "icon": "❤️",
            "title": "High Blood Pressure Detected",
            "detail": "Reduce sodium intake, exercise regularly (30 min/day), and consult a cardiologist.",
            "severity": "high"
        })
    elif features["resting_bp"] > 120:
        recs.append({
            "icon": "⚠️",
            "title": "Elevated Blood Pressure",
            "detail": "Monitor BP daily and reduce stress levels through meditation or yoga.",
            "severity": "medium"
        })

    if features["cholesterol"] > 240:
        recs.append({
            "icon": "🩸",
            "title": "High Cholesterol",
            "detail": "Consult physician for lipid profile management. Avoid trans fats and fried foods.",
            "severity": "high"
        })
    elif features["cholesterol"] > 200:
        recs.append({
            "icon": "🥗",
            "title": "Borderline Cholesterol",
            "detail": "Increase fiber intake, reduce saturated fats, and add omega-3 rich foods.",
            "severity": "medium"
        })

    if features["fasting_blood_sugar"] == 1:
        recs.append({
            "icon": "🍬",
            "title": "Elevated Blood Sugar",
            "detail": "Monitor blood glucose regularly and consult an endocrinologist.",
            "severity": "high"
        })

    if features["max_heart_rate"] < 100:
        recs.append({
            "icon": "🏃",
            "title": "Low Maximum Heart Rate",
            "detail": "Gradual cardiovascular exercise can improve heart rate response.",
            "severity": "medium"
        })

    if features["exercise_angina"] == 1:
        recs.append({
            "icon": "🏥",
            "title": "Exercise-Induced Chest Pain",
            "detail": "Seek immediate cardiology consultation. Avoid strenuous exercise until cleared.",
            "severity": "critical"
        })

    if risk_level == "Low Risk" and not recs:
        recs.append({
            "icon": "✅",
            "title": "Healthy Heart Indicators",
            "detail": "Maintain current lifestyle. Regular annual check-ups recommended.",
            "severity": "low"
        })

    return recs

def assess_lifestyle_risk(data: dict) -> dict:
    base_risk = 10
    factors = []

    if data.get("smoking"):
        base_risk += 25
        factors.append({"factor": "Smoking", "impact": 25, "icon": "🚬"})
    if data.get("alcohol") == "heavy":
        base_risk += 15
        factors.append({"factor": "Heavy Alcohol Use", "impact": 15, "icon": "🍺"})
    elif data.get("alcohol") == "moderate":
        base_risk += 5
        factors.append({"factor": "Moderate Alcohol", "impact": 5, "icon": "🍷"})
    if data.get("exercise") == "none":
        base_risk += 20
        factors.append({"factor": "Sedentary Lifestyle", "impact": 20, "icon": "🛋️"})
    elif data.get("exercise") == "low":
        base_risk += 10
        factors.append({"factor": "Low Activity", "impact": 10, "icon": "🚶"})
    if data.get("stress") == "high":
        base_risk += 15
        factors.append({"factor": "High Stress", "impact": 15, "icon": "😰"})
    elif data.get("stress") == "moderate":
        base_risk += 7
        factors.append({"factor": "Moderate Stress", "impact": 7, "icon": "😟"})
    if data.get("diet") == "poor":
        base_risk += 12
        factors.append({"factor": "Poor Diet", "impact": 12, "icon": "🍔"})
    if data.get("sleep") == "poor":
        base_risk += 8
        factors.append({"factor": "Poor Sleep", "impact": 8, "icon": "😴"})
    if data.get("obesity"):
        base_risk += 18
        factors.append({"factor": "Obesity", "impact": 18, "icon": "⚖️"})

    risk_score = min(base_risk, 100)
    projected_5yr = min(risk_score * 1.3, 100)
    projected_10yr = min(risk_score * 1.6, 100)

    return {
        "current_risk": round(risk_score, 1),
        "projected_5yr": round(projected_5yr, 1),
        "projected_10yr": round(projected_10yr, 1),
        "risk_factors": factors,
        "risk_level": "High Risk" if risk_score >= 60 else "Medium Risk" if risk_score >= 30 else "Low Risk"
    }
