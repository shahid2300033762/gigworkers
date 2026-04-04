import os

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


def normalize_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a dictionary")

    city = payload.get("city", "Unknown") or "Unknown"
    platform = payload.get("platform", "Unknown") or "Unknown"

    if not isinstance(city, str) or not isinstance(platform, str):
        raise ValueError("city and platform must be strings")

    return city.strip() or "Unknown", platform.strip() or "Unknown"


@app.route("/api/score", methods=["POST"])
def calculate_score():
    payload = request.get_json(silent=True) or {}

    try:
        city, platform = normalize_payload(payload)
    except ValueError as error:
        return jsonify({"success": False, "error": str(error)}), 400

    city_lower = city.lower()
    platform_lower = platform.lower()

    base_score = 0.5
    if "mumbai" in city_lower or "delhi" in city_lower:
        base_score += 0.2

    if platform_lower in {"swiggy", "zomato"}:
        base_score += 0.1

    final_score = min(max(base_score, 0.1), 0.99)
    weekly_premium = round(15 + (final_score * 135), 2)

    return jsonify(
        {
            "success": True,
            "risk_score": round(final_score, 2),
            "weekly_premium": weekly_premium,
        }
    )


@app.route("/api/deactivation-risk", methods=["POST"])
def analyze_deactivation_risk():
    payload = request.get_json(silent=True) or {}
    
    rating = float(payload.get("rating", 4.5))
    cancellation_rate = float(payload.get("cancellation_rate", 0.05))
    late_deliveries = int(payload.get("late_deliveries", 0))
    platform = payload.get("platform", "Unknown")

    # Algorithm Logic (The "Opinionated" Thinking)
    # Low rating = high risk
    # High cancellation = high risk
    # Platform volatility factor (e.g., Zomato is more sensitive)
    
    risk_factor = 0.0
    if rating < 4.2: risk_factor += 0.4
    elif rating < 4.5: risk_factor += 0.2
    
    if cancellation_rate > 0.15: risk_factor += 0.3
    elif cancellation_rate > 0.08: risk_factor += 0.15
    
    if late_deliveries > 10: risk_factor += 0.2
    
    # Vertex Score (100 - (risk * 100))
    vertex_score = max(0, min(100, int(100 - (risk_factor * 100))))
    
    risk_level = "Low"
    if vertex_score < 40: risk_level = "Critical"
    elif vertex_score < 70: risk_level = "Medium"

    return jsonify({
        "success": True,
        "vertex_score": vertex_score,
        "risk_level": risk_level,
        "platform_volatility": "High" if platform.lower() == "zomato" else "Medium",
        "recommendations": [
            "Maintain rating above 4.5",
            "Keep cancellation rate below 5%"
        ] if risk_level != "Low" else ["Account is in excellent standing"]
    })


if __name__ == "__main__":
    app.run(port=8000, debug=False)
