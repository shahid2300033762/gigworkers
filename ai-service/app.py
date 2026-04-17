"""
Vertex AI Service — ML-Powered Risk Engine
Provides:
  /api/score           — ML risk scoring (Gradient Boosting)
  /api/anomaly-check   — Fraud anomaly detection (Isolation Forest)
  /api/trigger-classify — Multi-trigger classification (Random Forest)
  /api/deactivation-risk — Platform deactivation risk predictor
"""

import os
import traceback
from datetime import datetime

import joblib
import numpy as np
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# ---------------------------------------------------------------------------
# Model Loading (lazy singleton)
# ---------------------------------------------------------------------------

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

_risk_bundle = None
_anomaly_bundle = None
_trigger_bundle = None

CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
]
PLATFORMS = ["Swiggy", "Zomato", "Uber", "Ola", "Dunzo", "Rapido", "BigBasket"]


def _load_risk_model():
    global _risk_bundle
    if _risk_bundle is None:
        path = os.path.join(MODELS_DIR, "risk_model.pkl")
        if os.path.exists(path):
            _risk_bundle = joblib.load(path)
            print("[AI] Risk model loaded successfully")
        else:
            print(f"[AI] Warning: risk_model.pkl not found at {path}")
    return _risk_bundle


def _load_anomaly_model():
    global _anomaly_bundle
    if _anomaly_bundle is None:
        path = os.path.join(MODELS_DIR, "anomaly_model.pkl")
        if os.path.exists(path):
            _anomaly_bundle = joblib.load(path)
            print("[AI] Anomaly model loaded successfully")
        else:
            print(f"[AI] Warning: anomaly_model.pkl not found at {path}")
    return _anomaly_bundle


def _load_trigger_model():
    global _trigger_bundle
    if _trigger_bundle is None:
        path = os.path.join(MODELS_DIR, "trigger_classifier.pkl")
        if os.path.exists(path):
            _trigger_bundle = joblib.load(path)
            print("[AI] Trigger classifier loaded successfully")
        else:
            print(f"[AI] Warning: trigger_classifier.pkl not found at {path}")
    return _trigger_bundle


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _safe_encode(encoder, value, known_list):
    """Safely encode a categorical value, falling back to 'Unknown'."""
    val = value.strip() if isinstance(value, str) else "Unknown"
    if val not in known_list:
        val = "Unknown"
    return encoder.transform([val])[0]


def _fallback_risk_score(city, platform):
    """Rule-based fallback when ML model is unavailable."""
    base = 0.5
    if city.lower() in ("mumbai", "delhi", "kolkata", "chennai"):
        base += 0.2
    if platform.lower() in ("swiggy", "zomato", "rapido"):
        base += 0.1
    return min(max(base, 0.1), 0.95)


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    risk_loaded = _load_risk_model() is not None
    anomaly_loaded = _load_anomaly_model() is not None
    trigger_loaded = _load_trigger_model() is not None
    return jsonify({
        "status": "ok",
        "service": "vertex-ai",
        "models": {
            "risk_scoring": "loaded" if risk_loaded else "not_found",
            "anomaly_detection": "loaded" if anomaly_loaded else "not_found",
            "trigger_classifier": "loaded" if trigger_loaded else "not_found",
        },
    })


@app.route("/api/score", methods=["POST"])
def calculate_score():
    """
    ML-powered risk scoring.
    Input: { city, platform, rain_mm?, temperature?, humidity?, wind_speed?,
             hour?, month?, historical_claims?, worker_rating? }
    Output: { risk_score, weekly_premium, risk_level, model_used, feature_importance }
    """
    payload = request.get_json(silent=True) or {}

    city = str(payload.get("city", "Unknown")).strip() or "Unknown"
    platform = str(payload.get("platform", "Unknown")).strip() or "Unknown"

    bundle = _load_risk_model()

    if bundle is None:
        # Fallback to rule-based
        score = _fallback_risk_score(city, platform)
        premium = round(15 + score * 135, 2)
        return jsonify({
            "success": True,
            "risk_score": round(score, 4),
            "weekly_premium": premium,
            "risk_level": _score_to_level(score),
            "model_used": "rule_based_fallback",
            "confidence": 0.60,
        })

    try:
        model = bundle["model"]
        city_enc = bundle["city_encoder"]
        plat_enc = bundle["platform_encoder"]

        now = datetime.now()
        features = np.array([[
            _safe_encode(city_enc, city, CITIES),
            _safe_encode(plat_enc, platform, PLATFORMS),
            int(payload.get("hour", now.hour)),
            int(payload.get("month", now.month)),
            float(payload.get("rain_mm", 0)),
            float(payload.get("temperature", 30)),
            float(payload.get("humidity", 65)),
            float(payload.get("wind_speed", 10)),
            int(payload.get("historical_claims", 1)),
            float(payload.get("worker_rating", 4.3)),
        ]])

        raw_score = float(model.predict(features)[0])
        risk_score = round(min(max(raw_score, 0.05), 0.98), 4)
        weekly_premium = round(15 + risk_score * 135, 2)

        # Feature importance for transparency
        importance = dict(zip(
            bundle["features"],
            [round(float(x), 4) for x in model.feature_importances_],
        ))

        return jsonify({
            "success": True,
            "risk_score": risk_score,
            "weekly_premium": weekly_premium,
            "risk_level": _score_to_level(risk_score),
            "model_used": "gradient_boosting",
            "confidence": round(0.85 + min(risk_score * 0.1, 0.12), 2),
            "feature_importance": importance,
        })
    except Exception as exc:
        traceback.print_exc()
        score = _fallback_risk_score(city, platform)
        return jsonify({
            "success": True,
            "risk_score": round(score, 4),
            "weekly_premium": round(15 + score * 135, 2),
            "risk_level": _score_to_level(score),
            "model_used": "rule_based_fallback",
            "error_detail": str(exc),
        })


@app.route("/api/anomaly-check", methods=["POST"])
def anomaly_check():
    """
    Isolation Forest anomaly detection for fraud signals.
    Input: { payout_amount, rain_mm, claims_last_7d, hour, gps_match }
    Output: { is_anomaly, anomaly_score, fraud_probability, signals }
    """
    payload = request.get_json(silent=True) or {}

    bundle = _load_anomaly_model()
    if bundle is None:
        return jsonify({
            "success": True,
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "fraud_probability": 0.05,
            "model_used": "unavailable",
            "signals": [],
        })

    try:
        model = bundle["model"]
        features = np.array([[
            float(payload.get("payout_amount", 500)),
            float(payload.get("rain_mm", 5)),
            int(payload.get("claims_last_7d", 0)),
            int(payload.get("hour", 12)),
            int(payload.get("gps_match", 1)),
        ]])

        prediction = int(model.predict(features)[0])  # 1 = normal, -1 = anomaly
        raw_score = float(model.decision_function(features)[0])

        # Convert to probability-like score (decision_function is distance from boundary)
        # More negative = more anomalous
        fraud_prob = round(min(max(1.0 / (1.0 + np.exp(raw_score * 5)), 0.01), 0.99), 4)

        # Generate human-readable fraud signals
        signals = []
        if int(payload.get("claims_last_7d", 0)) >= 3:
            signals.append({
                "type": "velocity",
                "severity": "high",
                "message": f"User filed {payload.get('claims_last_7d')} claims in 7 days (threshold: 3)",
            })
        if float(payload.get("payout_amount", 0)) > 2500:
            signals.append({
                "type": "amount_anomaly",
                "severity": "medium",
                "message": f"Payout ₹{payload.get('payout_amount')} exceeds normal range",
            })
        if int(payload.get("gps_match", 1)) == 0:
            signals.append({
                "type": "gps_mismatch",
                "severity": "high",
                "message": "GPS location does not match registered city",
            })
        if float(payload.get("rain_mm", 10)) < 2 and float(payload.get("payout_amount", 0)) > 1500:
            signals.append({
                "type": "weather_mismatch",
                "severity": "critical",
                "message": "High payout claim during low rainfall conditions",
            })

        return jsonify({
            "success": True,
            "is_anomaly": prediction == -1,
            "anomaly_score": round(abs(raw_score), 4),
            "fraud_probability": fraud_prob,
            "fraud_score": int(fraud_prob * 100),
            "model_used": "isolation_forest",
            "signals": signals,
        })
    except Exception as exc:
        traceback.print_exc()
        return jsonify({
            "success": True,
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "fraud_probability": 0.05,
            "model_used": "error_fallback",
            "error_detail": str(exc),
            "signals": [],
        })


@app.route("/api/trigger-classify", methods=["POST"])
def trigger_classify():
    """
    Multi-trigger classification. Evaluates probability of each trigger type.
    Input: { city, rain_mm, hour, payout_amount }
    Output: { predicted_trigger, probabilities: { weather, demand_surge, ... } }
    """
    payload = request.get_json(silent=True) or {}

    bundle = _load_trigger_model()
    if bundle is None:
        return jsonify({
            "success": True,
            "predicted_trigger": "weather",
            "probabilities": {t: 0.2 for t in ["weather", "demand_surge", "platform_outage", "traffic_disruption", "heatwave"]},
            "model_used": "unavailable",
        })

    try:
        model = bundle["model"]
        city_enc = bundle["city_encoder"]
        trigger_enc = bundle["trigger_encoder"]

        city = str(payload.get("city", "Unknown")).strip()
        features = np.array([[
            _safe_encode(city_enc, city, CITIES),
            float(payload.get("rain_mm", 0)),
            int(payload.get("hour", 12)),
            float(payload.get("payout_amount", 500)),
        ]])

        proba = model.predict_proba(features)[0]
        predicted_idx = int(np.argmax(proba))
        predicted_trigger = trigger_enc.inverse_transform([predicted_idx])[0]

        probabilities = {}
        for idx, ttype in enumerate(trigger_enc.classes_):
            probabilities[ttype] = round(float(proba[idx]), 4)

        return jsonify({
            "success": True,
            "predicted_trigger": predicted_trigger,
            "probabilities": probabilities,
            "model_used": "random_forest",
            "confidence": round(float(max(proba)), 4),
        })
    except Exception as exc:
        traceback.print_exc()
        return jsonify({
            "success": True,
            "predicted_trigger": "weather",
            "probabilities": {},
            "model_used": "error_fallback",
            "error_detail": str(exc),
        })


@app.route("/api/deactivation-risk", methods=["POST"])
def analyze_deactivation_risk():
    """
    ML-enhanced deactivation risk analysis.
    Uses a weighted scoring model with non-linear risk curves.
    """
    payload = request.get_json(silent=True) or {}

    rating = float(payload.get("rating", 4.5))
    cancellation_rate = float(payload.get("cancellation_rate", 0.05))
    late_deliveries = int(payload.get("late_deliveries", 0))
    platform = str(payload.get("platform", "Unknown"))
    total_orders = int(payload.get("total_orders", 100))
    account_age_days = int(payload.get("account_age_days", 180))

    # Non-linear risk computation (logistic-style curves)
    rating_risk = 1.0 / (1.0 + np.exp(5 * (rating - 4.0)))  # sigmoid centered at 4.0
    cancel_risk = 1.0 / (1.0 + np.exp(-20 * (cancellation_rate - 0.10)))
    late_risk = min(late_deliveries / 15.0, 1.0) ** 0.7  # sub-linear growth
    volume_factor = max(0.5, min(total_orders / 200, 1.0))  # low volume = less data
    tenure_bonus = min(account_age_days / 365.0, 0.15)  # longer tenure = safer

    # Weighted composite
    raw_risk = (
        0.35 * rating_risk
        + 0.30 * cancel_risk
        + 0.20 * late_risk
        + 0.15 * (1.0 - volume_factor)
    ) - tenure_bonus

    vertex_score = int(np.clip(100 * (1.0 - raw_risk), 5, 98))

    risk_level = "Low"
    if vertex_score < 40:
        risk_level = "Critical"
    elif vertex_score < 60:
        risk_level = "High"
    elif vertex_score < 75:
        risk_level = "Medium"

    # Dynamic recommendations based on actual risk contributors
    recommendations = []
    if rating < 4.5:
        delta = round(4.5 - rating, 1)
        recommendations.append(
            f"Increase your rating by {delta} points to reduce deactivation risk by ~{int(delta * 15)}%."
        )
    if cancellation_rate > 0.08:
        recommendations.append(
            f"Your cancellation rate ({cancellation_rate:.0%}) is above the 8% safe threshold."
        )
    if late_deliveries > 3:
        recommendations.append(
            f"Reduce late deliveries from {late_deliveries} to under 3 per period."
        )
    if total_orders < 50:
        recommendations.append(
            "Complete more orders to build a reliable track record."
        )
    if not recommendations:
        recommendations.append("Your account health is excellent. Keep it up!")

    recommendations.append("Vertex deactivation insurance is ACTIVE for your account.")

    # Platform volatility from ML-like estimation
    platform_risk = {
        "Zomato": "High", "Swiggy": "Medium-High", "Uber": "Medium",
        "Ola": "Medium", "Rapido": "High", "Dunzo": "Medium",
    }

    return jsonify({
        "success": True,
        "vertex_score": vertex_score,
        "risk_level": risk_level,
        "platform_volatility": platform_risk.get(platform, "Medium"),
        "risk_breakdown": {
            "rating_impact": round(float(rating_risk), 3),
            "cancellation_impact": round(float(cancel_risk), 3),
            "late_delivery_impact": round(float(late_risk), 3),
            "volume_factor": round(float(volume_factor), 3),
            "tenure_bonus": round(float(tenure_bonus), 3),
        },
        "recommendations": recommendations,
        "model_used": "weighted_logistic",
        "timestamp": datetime.now().isoformat(),
    })


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def _score_to_level(score: float) -> str:
    if score >= 0.75:
        return "Critical"
    if score >= 0.55:
        return "High"
    if score >= 0.35:
        return "Medium"
    return "Low"


# ---------------------------------------------------------------------------
# Entry
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Pre-load models at startup
    _load_risk_model()
    _load_anomaly_model()
    _load_trigger_model()
    app.run(port=8000, debug=False)
