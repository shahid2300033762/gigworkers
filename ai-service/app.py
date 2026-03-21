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


if __name__ == "__main__":
    app.run(port=8000, debug=False)
