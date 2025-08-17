# CareerCompass Backend - Running API with Swagger

This guide explains how to run the CareerCompass Flask backend and test all API endpoints using Swagger UI.

## 1. Activate Virtual Environment

Navigate to your backend folder and activate the virtual environment:

```bash
HEAD
cd C:\Users\shoun\OneDrive\Desktop\internship projext\backend #path of folder
cd C:\Users\shoun\OneDrive\Desktop\internship projext\backend
>>>>>>> e250e1d (final commit)
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux
```

## 2. Install Required Packages

Ensure Flask and Flasgger are installed:

```bash
pip install flask flasgger
```

## 3. Run the Flask App

```bash
python api_files.py
```

You should see output like:

```
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

## 4. Access Swagger UI

Open a web browser and go to:

```
http://127.0.0.1:5000/apidocs/
```

From here, you can test all API endpoints interactively.

## 5. Using Authorization

* After logging in via `/api/login`, you will receive a token.
* Include this token in the Swagger Authorization header for protected endpoints:

```
Authorization: Bearer <token>
```

## 6. Example Requests

### Register

**POST** `/api/register`

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "StrongPass123",
  "role": "student"
}
```

### Login

**POST** `/api/login`

```json
{
  "email": "alice@example.com",
  "password": "StrongPass123"
}
```

### Get Profile

**GET** `/api/profile/{user_id}`

Header:

```
Authorization: Bearer <token>
```

### Submit Assessment

**POST** `/api/assessment`

Header:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "answers": [
    {"question_id": "q1", "answer": "A"},
    {"question_id": "q2", "answer": "B"}
  ]
}
```

### Get Roadmap

**GET** `/api/roadmap/{assessment_id}`

Header:

```
Authorization: Bearer <token>
```

### Get Matched Mentor

**GET** `/api/mentor-match/{user_id}`

Header:

```
Authorization: Bearer <token>
```

### Submit Feedback

**POST** `/api/feedback`

Header:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "roadmap_id": "uuid-roadmap-1234",
  "rating": 5,
  "comments": "Excellent roadmap!"
}
```

## 7. Notes

* Ensure `api_files.py` is saved before running the server.
* Restart the server to apply any changes.
* Data is stored in-memory; restarting the server will reset users, assessments, and roadmaps.
