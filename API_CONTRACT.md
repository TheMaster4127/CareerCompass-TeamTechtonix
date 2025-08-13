
# CareerCompass API Contract

## Authentication
### Register
**POST** `/api/register`  
Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student|mentor"
}
```
Response:
```json
{
  "message": "Registration successful",
  "user_id": "string"
}
```

### Login
**POST** `/api/login`  
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "string",
  "user_id": "string"
}
```

## Profile Management
### Get Profile
**GET** `/api/profile/{user_id}`  
Headers:
```
Authorization: Bearer <token>
```
Response:
```json
{
  "user_id": "string",
  "name": "string",
  "email": "string",
  "role": "student|mentor",
  "skills": ["string"],
  "education": ["string"]
}
```

## Assessment
### Submit Assessment
**POST** `/api/assessment`  
Headers:
```
Authorization: Bearer <token>
```
Request body:
```json
{
  "answers": [
    {"question_id": "string", "answer": "string"}
  ]
}
```
Response:
```json
{
  "assessment_id": "string",
  "message": "Assessment submitted successfully"
}
```

## Roadmap Generation
### Get Roadmap
**GET** `/api/roadmap/{assessment_id}`  
Headers:
```
Authorization: Bearer <token>
```
Response:
```json
{
  "roadmap_id": "string",
  "courses": [
    {
      "title": "string",
      "platform": "Coursera",
      "link": "string",
      "price_type": "free | free+certification | paid"
    }
  ],
  "skills": ["string"],
  "internships": ["string"],
  "mentors": ["string"]
}
```

## Mentor Matching
### Get Matched Mentor
**GET** `/api/mentor-match/{user_id}`  
Headers:
```
Authorization: Bearer <token>
```
Response:
```json
{
  "mentor_id": "string",
  "name": "string",
  "expertise": ["string"],
  "contact": "string"
}
```

## Feedback
### Submit Feedback
**POST** `/api/feedback`  
Headers:
```
Authorization: Bearer <token>
```
Request body:
```json
{
  "roadmap_id": "string",
  "rating": 1-5,
  "comments": "string"
}
```
Response:
```json
{
  "message": "Feedback submitted successfully"
}
```
