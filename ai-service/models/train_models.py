"""
Vertex AI Model Training Script
Generates synthetic parametric insurance data and trains ML models:
1. Risk Scoring Model (Gradient Boosting)
2. Anomaly Detection Model (Isolation Forest)
3. Trigger Classifier (Random Forest)
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

MODELS_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# 1.  Synthetic Data Generation
# ---------------------------------------------------------------------------

CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
]
PLATFORMS = ["Swiggy", "Zomato", "Uber", "Ola", "Dunzo", "Rapido", "BigBasket"]
TRIGGER_TYPES = ["weather", "demand_surge", "platform_outage", "traffic_disruption", "heatwave"]

np.random.seed(42)


def _city_base_risk(city: str) -> float:
    """Metro cities have higher base risk due to density & weather exposure."""
    high = {"Mumbai": 0.35, "Delhi": 0.30, "Kolkata": 0.28, "Chennai": 0.32}
    return high.get(city, 0.18)


def _platform_factor(platform: str) -> float:
    factors = {
        "Swiggy": 0.12, "Zomato": 0.14, "Uber": 0.08,
        "Ola": 0.09, "Dunzo": 0.11, "Rapido": 0.13, "BigBasket": 0.07,
    }
    return factors.get(platform, 0.10)


def generate_risk_dataset(n: int = 5000) -> pd.DataFrame:
    rows = []
    for _ in range(n):
        city = np.random.choice(CITIES)
        platform = np.random.choice(PLATFORMS)
        hour = np.random.randint(0, 24)
        month = np.random.randint(1, 13)
        rain_mm = max(0, np.random.exponential(scale=8))
        temperature = np.random.normal(loc=30, scale=8)
        humidity = np.clip(np.random.normal(loc=65, scale=15), 20, 100)
        wind_speed = max(0, np.random.exponential(scale=12))
        historical_claims = np.random.poisson(lam=2)
        worker_rating = np.clip(np.random.normal(loc=4.3, scale=0.4), 1, 5)

        # True risk = combination of features with realistic relationships
        base = _city_base_risk(city)
        plat = _platform_factor(platform)
        weather_risk = min(rain_mm / 60, 0.5) + min(wind_speed / 80, 0.2)
        time_risk = 0.1 if (hour >= 17 and hour <= 21) else 0.0  # peak hours
        monsoon = 0.15 if month in (6, 7, 8, 9) else 0.0
        rating_penalty = max(0, (4.5 - worker_rating) * 0.1)

        risk_score = np.clip(
            base + plat + weather_risk + time_risk + monsoon + rating_penalty
            + np.random.normal(0, 0.05),
            0.05, 0.98,
        )
        rows.append({
            "city": city, "platform": platform, "hour": hour, "month": month,
            "rain_mm": round(rain_mm, 1), "temperature": round(temperature, 1),
            "humidity": round(humidity, 1), "wind_speed": round(wind_speed, 1),
            "historical_claims": historical_claims,
            "worker_rating": round(worker_rating, 2),
            "risk_score": round(risk_score, 4),
        })
    return pd.DataFrame(rows)


def generate_claim_dataset(n: int = 3000) -> pd.DataFrame:
    """Generate claim data for anomaly detection and trigger classification."""
    rows = []
    for _ in range(n):
        is_fraud = np.random.random() < 0.08  # 8% fraud rate

        city = np.random.choice(CITIES)
        platform = np.random.choice(PLATFORMS)
        trigger = np.random.choice(TRIGGER_TYPES)
        payout = np.clip(np.random.lognormal(mean=6.5, sigma=0.6), 300, 3000)
        rain_mm = max(0, np.random.exponential(scale=12))
        claims_7d = np.random.poisson(lam=1)  # normal: ~1 per week
        hour = np.random.randint(0, 24)
        gps_match = True

        if is_fraud:
            # Fraud patterns: abnormal velocity, GPS mismatch, max payouts
            payout = np.clip(payout * 1.8, 2000, 3000)
            claims_7d = np.random.randint(3, 8)
            gps_match = np.random.random() < 0.3
            rain_mm = max(0, rain_mm * 0.3)  # claiming during low rain

        rows.append({
            "city": city, "platform": platform, "trigger_type": trigger,
            "payout_amount": round(payout, 2), "rain_mm": round(rain_mm, 1),
            "claims_last_7d": claims_7d, "hour": hour,
            "gps_match": int(gps_match), "is_fraud": int(is_fraud),
        })
    return pd.DataFrame(rows)


# ---------------------------------------------------------------------------
# 2.  Model Training
# ---------------------------------------------------------------------------

def train_risk_model(df: pd.DataFrame):
    """Train Gradient Boosting risk scoring model."""
    city_enc = LabelEncoder().fit(CITIES + ["Unknown"])
    plat_enc = LabelEncoder().fit(PLATFORMS + ["Unknown"])

    df = df.copy()
    df["city_enc"] = city_enc.transform(df["city"].apply(lambda x: x if x in CITIES else "Unknown"))
    df["platform_enc"] = plat_enc.transform(df["platform"].apply(lambda x: x if x in PLATFORMS else "Unknown"))

    features = ["city_enc", "platform_enc", "hour", "month", "rain_mm",
                 "temperature", "humidity", "wind_speed", "historical_claims", "worker_rating"]
    X = df[features]
    y = df["risk_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.1,
        subsample=0.8, random_state=42,
    )
    model.fit(X_train, y_train)

    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Risk Model  — Train R²: {train_score:.4f}, Test R²: {test_score:.4f}")

    bundle = {"model": model, "city_encoder": city_enc, "platform_encoder": plat_enc, "features": features}
    joblib.dump(bundle, os.path.join(MODELS_DIR, "risk_model.pkl"))
    return bundle


def train_anomaly_model(df: pd.DataFrame):
    """Train Isolation Forest for fraud / anomaly detection."""
    features = ["payout_amount", "rain_mm", "claims_last_7d", "hour", "gps_match"]
    X = df[features]

    model = IsolationForest(
        n_estimators=150, contamination=0.08,
        max_samples="auto", random_state=42,
    )
    model.fit(X)

    scores = model.decision_function(X)
    preds = model.predict(X)
    anomaly_rate = (preds == -1).mean()
    print(f"Anomaly Model — Detected anomaly rate: {anomaly_rate:.2%}")

    bundle = {"model": model, "features": features}
    joblib.dump(bundle, os.path.join(MODELS_DIR, "anomaly_model.pkl"))
    return bundle


def train_trigger_classifier(df: pd.DataFrame):
    """Train Random Forest multi-trigger classifier."""
    trigger_enc = LabelEncoder().fit(TRIGGER_TYPES)
    city_enc = LabelEncoder().fit(CITIES + ["Unknown"])

    df = df.copy()
    df["trigger_enc"] = trigger_enc.transform(df["trigger_type"])
    df["city_enc"] = city_enc.transform(df["city"].apply(lambda x: x if x in CITIES else "Unknown"))

    features = ["city_enc", "rain_mm", "hour", "payout_amount"]
    X = df[features]
    y = df["trigger_enc"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(
        n_estimators=150, max_depth=10, random_state=42,
    )
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)
    print(f"Trigger Classifier — Test Accuracy: {accuracy:.4f}")

    bundle = {
        "model": model, "trigger_encoder": trigger_enc,
        "city_encoder": city_enc, "features": features,
        "trigger_types": TRIGGER_TYPES,
    }
    joblib.dump(bundle, os.path.join(MODELS_DIR, "trigger_classifier.pkl"))
    return bundle


# ---------------------------------------------------------------------------
# 3.  Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("  Vertex AI — Training Pipeline")
    print("=" * 60)

    print("\n[1/4] Generating synthetic risk dataset...")
    risk_df = generate_risk_dataset(5000)
    print(f"      Created {len(risk_df)} samples")

    print("\n[2/4] Training Risk Scoring Model (Gradient Boosting)...")
    train_risk_model(risk_df)

    print("\n[3/4] Generating claim dataset & training Anomaly Detector...")
    claim_df = generate_claim_dataset(3000)
    train_anomaly_model(claim_df)

    print("\n[4/4] Training Multi-Trigger Classifier (Random Forest)...")
    train_trigger_classifier(claim_df)

    print("\n" + "=" * 60)
    print("  All models trained and saved to:", MODELS_DIR)
    print("=" * 60)
