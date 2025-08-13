from flask import Flask, jsonify, request
from flasgger import Swagger
import uuid

app = Flask(__name__)
swagger = Swagger(app)

# In-memory storage
users = {}
assessments = {}
roadmaps = {}
feedbacks = {}

# ------------------ Authentication ------------------

@app.route("/api/register", methods=["POST"])
def register():
    """
    Register a new user
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - password
            - role
          properties:
            name:
              type: string
              example: Alice Johnson
            email:
              type: string
              example: alice@example.com
            password:
              type: string
              example: StrongPass123
            role:
              type: string
              enum: ["student", "mentor"]
              example: student
    responses:
      200:
        description: Registration successful
        schema:
          type: object
          properties:
            message:
              type: string
              example: Registration successful
            user_id:
              type: string
              example: uuid-example-1234
    """
    data = request.json
    user_id = str(uuid.uuid4())
    users[user_id] = {
        "user_id": user_id,
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "role": data["role"],
        "skills": [],
        "education": []
    }
    return jsonify({"message": "Registration successful", "user_id": user_id})

@app.route("/api/login", methods=["POST"])
def login():
    """
    Login user
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              example: alice@example.com
            password:
              type: string
              example: StrongPass123
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            token:
              type: string
              example: uuid-token-1234
            user_id:
              type: string
              example: uuid-example-1234
      401:
        description: Invalid credentials
    """
    data = request.json
    for user_id, user in users.items():
        if user["email"] == data["email"] and user["password"] == data["password"]:
            token = str(uuid.uuid4())
            user["token"] = token
            return jsonify({"token": token, "user_id": user_id})
    return jsonify({"error": "Invalid credentials"}), 401

# ------------------ Profile Management ------------------

@app.route("/api/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    """
    Get user profile
    ---
    tags:
      - Profile Management
    parameters:
      - name: user_id
        in: path
        required: true
        type: string
        example: uuid-example-1234
      - name: Authorization
        in: header
        required: true
        type: string
        example: Bearer uuid-token-1234
    responses:
      200:
        description: User profile
        schema:
          type: object
          properties:
            user_id: {type: string}
            name: {type: string}
            email: {type: string}
            role: {type: string, enum: ["student","mentor"]}
            skills: 
              type: array
              items: {type: string}
            education: 
              type: array
              items: {type: string}
      401:
        description: Unauthorized
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = users.get(user_id)
    if not user or user.get("token") != token:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(user)

# ------------------ Assessment ------------------

@app.route("/api/assessment", methods=["POST"])
def submit_assessment():
    """
    Submit assessment
    ---
    tags:
      - Assessment
    parameters:
      - name: Authorization
        in: header
        required: true
        type: string
        example: Bearer uuid-token-1234
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            answers:
              type: array
              items:
                type: object
                example: {"question_id":"q1","answer":"A"}
    responses:
      200:
        description: Assessment submitted
        schema:
          type: object
          properties:
            assessment_id: {type: string, example: uuid-assessment-1234}
            message: {type: string, example: Assessment submitted successfully}
      401:
        description: Unauthorized
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = None
    for uid, user in users.items():
        if user.get("token") == token:
            user_id = uid
            break
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    assessment_id = str(uuid.uuid4())
    assessments[assessment_id] = {"user_id": user_id, "answers": data["answers"]}
    return jsonify({"assessment_id": assessment_id, "message": "Assessment submitted successfully"})

# ------------------ Roadmap ------------------

@app.route("/api/roadmap/<assessment_id>", methods=["GET"])
def get_roadmap(assessment_id):
    """
    Get roadmap
    ---
    tags:
      - Roadmap
    parameters:
      - name: assessment_id
        in: path
        required: true
        type: string
        example: uuid-assessment-1234
      - name: Authorization
        in: header
        required: true
        type: string
        example: Bearer uuid-token-1234
    responses:
      200:
        description: Roadmap generated
        schema:
          type: object
          properties:
            roadmap_id: {type: string, example: uuid-roadmap-1234}
            courses:
              type: array
              items:
                type: object
                properties:
                  title: {type: string, example: Python Basics}
                  platform: {type: string, example: Coursera}
                  link: {type: string, example: https://coursera.org/python}
                  price_type: {type: string, example: free}
            skills:
              type: array
              items: {type: string}
            internships:
              type: array
              items: {type: string}
            mentors:
              type: array
              items: {type: string}
      401:
        description: Unauthorized
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = None
    for uid, user in users.items():
        if user.get("token") == token:
            user_id = uid
            break
    if not user_id or assessment_id not in assessments:
        return jsonify({"error": "Unauthorized or assessment not found"}), 401

    roadmap_id = str(uuid.uuid4())
    roadmap = {
        "roadmap_id": roadmap_id,
        "courses": [
            {"title": "Python Basics", "platform": "Coursera", "link": "https://coursera.org/python", "price_type": "free"},
            {"title": "Data Science Intro", "platform": "Coursera", "link": "https://coursera.org/ds", "price_type": "free+certification"}
        ],
        "skills": ["Python", "Data Analysis"],
        "internships": ["Data Intern at XYZ"],
        "mentors": ["mentor_id_example"]
    }
    roadmaps[roadmap_id] = roadmap
    return jsonify(roadmap)

# ------------------ Mentor Matching ------------------

@app.route("/api/mentor-match/<user_id>", methods=["GET"])
def mentor_match(user_id):
    """
    Get matched mentor
    ---
    tags:
      - Mentor
    parameters:
      - name: user_id
        in: path
        required: true
        type: string
        example: uuid-example-1234
      - name: Authorization
        in: header
        required: true
        type: string
        example: Bearer uuid-token-1234
    responses:
      200:
        description: Mentor matched
        schema:
          type: object
          properties:
            mentor_id: {type: string, example: uuid-mentor-1234}
            name: {type: string, example: Bob Mentor}
            expertise:
              type: array
              items: {type: string}
            contact: {type: string, example: mentor@example.com}
      401:
        description: Unauthorized
      404:
        description: No mentor available
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user = users.get(user_id)
    if not user or user.get("token") != token:
        return jsonify({"error": "Unauthorized"}), 401

    mentor = next((u for u in users.values() if u["role"] == "mentor"), None)
    if not mentor:
        return jsonify({"error": "No mentor available"}), 404

    return jsonify({
        "mentor_id": mentor["user_id"],
        "name": mentor["name"],
        "expertise": mentor["skills"],
        "contact": mentor["email"]
    })

# ------------------ Feedback ------------------

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():
    """
    Submit feedback
    ---
    tags:
      - Feedback
    parameters:
      - name: Authorization
        in: header
        required: true
        type: string
        example: Bearer uuid-token-1234
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - roadmap_id
            - rating
            - comments
          properties:
            roadmap_id: {type: string, example: uuid-roadmap-1234}
            rating: {type: integer, example: 5}
            comments: {type: string, example: Excellent roadmap!}
    responses:
      200:
        description: Feedback submitted successfully
        schema:
          type: object
          properties:
            message: {type: string, example: Feedback submitted successfully}
      401:
        description: Unauthorized
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = None
    for uid, user in users.items():
        if user.get("token") == token:
            user_id = uid
            break
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    feedback_id = str(uuid.uuid4())
    feedbacks[feedback_id] = {
        "user_id": user_id,
        "roadmap_id": data["roadmap_id"],
        "rating": data["rating"],
        "comments": data["comments"]
    }
    return jsonify({"message": "Feedback submitted successfully"})

# ------------------ Run Server ------------------

if __name__ == "__main__":
    app.run(debug=True)