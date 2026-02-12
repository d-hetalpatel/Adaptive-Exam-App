from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import secrets
import csv
import io

app = Flask(__name__)
CORS(app)

DATA_FILE = "questions.json"
ADMIN_FILE = "admin_credentials.json"

# Simple in-memory session storage (use Redis/database in production)
active_sessions = {}

# Initialize admin credentials file if it doesn't exist
def init_admin_credentials():
    if not os.path.exists(ADMIN_FILE):
        default_admin = {
            "username": "admin",
            "password": "admin123"  # In production, use hashed passwords!
        }
        with open(ADMIN_FILE, "w", encoding="utf-8") as f:
            json.dump(default_admin, f, indent=2)

# Initialize questions file if it doesn't exist
def init_questions_file():
    if not os.path.exists(DATA_FILE):
        sample_questions = {
            "questions": [
                {
                    "id": 1,
                    "subject": "Quantitative Aptitude",
                    "difficulty": "Easy",
                    "question": "What is 15% of 200?",
                    "option_a": "20",
                    "option_b": "30",
                    "option_c": "40",
                    "option_d": "50",
                    "correct_answer": "B",
                    "explanation": "15% of 200 = (15/100) × 200 = 30"
                }
            ]
        }
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(sample_questions, f, indent=2)

init_admin_credentials()
init_questions_file()

# Helper function to check authentication
def check_auth(token):
    if token in active_sessions:
        expiry = active_sessions[token]
        if datetime.now() < expiry:
            # Extend session
            active_sessions[token] = datetime.now() + timedelta(hours=2)
            return True
        else:
            del active_sessions[token]
    return False

# Authentication endpoints
@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    with open(ADMIN_FILE, "r", encoding="utf-8") as f:
        admin_creds = json.load(f)
    
    if username == admin_creds["username"] and password == admin_creds["password"]:
        token = secrets.token_urlsafe(32)
        active_sessions[token] = datetime.now() + timedelta(hours=2)
        return jsonify({"success": True, "token": token, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if token in active_sessions:
        del active_sessions[token]
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route("/api/admin/verify", methods=["GET"])
def verify_token():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if check_auth(token):
        return jsonify({"success": True, "message": "Token valid"})
    else:
        return jsonify({"success": False, "message": "Invalid or expired token"}), 401

# Public endpoint - Get all questions
@app.route("/api/questions", methods=["GET"])
def get_questions():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

# Admin endpoints - CRUD operations
@app.route("/api/admin/questions", methods=["GET"])
def get_admin_questions():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

@app.route("/api/admin/questions", methods=["POST"])
def create_question():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    new_question = request.get_json()
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Generate new ID
    max_id = max([q["id"] for q in data["questions"]], default=0)
    new_question["id"] = max_id + 1
    
    data["questions"].append(new_question)
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return jsonify({"success": True, "message": "Question created", "question": new_question})

@app.route("/api/admin/questions/<int:question_id>", methods=["PUT"])
def update_question(question_id):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    updated_data = request.get_json()
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Find and update question
    for i, q in enumerate(data["questions"]):
        if q["id"] == question_id:
            # Keep the ID
            updated_data["id"] = question_id
            data["questions"][i] = updated_data
            
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return jsonify({"success": True, "message": "Question updated", "question": updated_data})
    
    return jsonify({"success": False, "message": "Question not found"}), 404

@app.route("/api/admin/questions/<int:question_id>", methods=["DELETE"])
def delete_question(question_id):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Find and delete question
    original_length = len(data["questions"])
    data["questions"] = [q for q in data["questions"] if q["id"] != question_id]
    
    if len(data["questions"]) < original_length:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return jsonify({"success": True, "message": "Question deleted"})
    
    return jsonify({"success": False, "message": "Question not found"}), 404

@app.route("/api/admin/questions/bulk-delete", methods=["POST"])
def bulk_delete_questions():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    question_ids = request.get_json().get("ids", [])
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    original_length = len(data["questions"])
    data["questions"] = [q for q in data["questions"] if q["id"] not in question_ids]
    deleted_count = original_length - len(data["questions"])
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return jsonify({"success": True, "message": f"Deleted {deleted_count} questions"})

@app.route("/api/admin/questions/upload-csv", methods=["POST"])
def upload_csv():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "message": "No file selected"}), 400
    
    try:
        # Read CSV file
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_reader = csv.DictReader(stream)
        
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        max_id = max([q["id"] for q in data["questions"]], default=0)
        new_questions = []
        
        for row in csv_reader:
            max_id += 1
            question = {
                "id": max_id,
                "subject": row.get("subject", ""),
                "difficulty": row.get("difficulty", ""),
                "question": row.get("question", ""),
                "option_a": row.get("option_a", ""),
                "option_b": row.get("option_b", ""),
                "option_c": row.get("option_c", ""),
                "option_d": row.get("option_d", ""),
                "correct_answer": row.get("correct_answer", ""),
                "explanation": row.get("explanation", "")
            }
            new_questions.append(question)
            data["questions"].append(question)
        
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            "success": True,
            "message": f"Uploaded {len(new_questions)} questions",
            "count": len(new_questions)
        })
    
    except Exception as e:
        return jsonify({"success": False, "message": f"Error processing CSV: {str(e)}"}), 400

@app.route("/api/admin/questions/export-csv", methods=["GET"])
def export_csv():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not check_auth(token):
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Create CSV
    output = io.StringIO()
    fieldnames = ["id", "subject", "difficulty", "question", "option_a", "option_b", 
                  "option_c", "option_d", "correct_answer", "explanation"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    
    writer.writeheader()
    for q in data["questions"]:
        writer.writerow(q)
    
    return output.getvalue(), 200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=questions.csv'
    }

# if __name__ == "__main__":
#     app.run(port=5000, debug=True)

  if __name__ == "__main__":
        app.run(host="0.0.0.0", port=10000)

