from flask import Flask, request, jsonify
from flask_cors import CORS

from chatbot_logic import find_disease
from hospital_logic import recommend_hospital

app = Flask(__name__)
CORS(app)


@app.route("/api/emergency/chat", methods=["POST"])
def chat():

    data = request.json or {}
    user_msg = data.get("message", "")

    print("\n===== NEW CHAT REQUEST =====")
    print("User message:", user_msg)

    disease = find_disease(user_msg)
    print("Disease result:", disease)

    if disease:
        hospital = recommend_hospital(disease)

        reply = f"""
Possible Disease: {disease.get('disease')}

Suggested Cure:
{disease.get('cure')}

Recommendation:
{hospital}

⚠️ Please consult doctor for confirmation.
"""
    else:
        reply = "Could not match symptoms"

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
