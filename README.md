# LMS-BACKEND

## Table of Contents
- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [Models: Data Structures](#models-data-structures)
- [Routes: API Endpoints](#routes-api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Example JSON Data: Request and Response Payloads](#example-json-data-request-and-response-payloads)
- [Environment Variables: Configuration](#environment-variables-configuration)
- [Installation and Setup](#installation-and-setup)
- [Usage and API Interaction](#usage-and-api-interaction)
- [Troubleshooting and Debugging](#troubleshooting-and-debugging)
- [Contributing Guidelines](#contributing-guidelines)
- [Future Enhancements and Roadmap](#future-enhancements-and-roadmap)
- [License](#license)

## Introduction
This document serves as an exhaustive guide to the backend API of our application. It encompasses all aspects, from model definitions and route specifications to authentication procedures and examples.

## Core Concepts
### API Architecture
### Data Serialization and Deserialization
### Error Handling Philosophy

## Models: Data Structures
### User Model
- Detailed Field Descriptions
- Validation Rules
- Example User Document

### InterviewExperience Model
- Nested Schema Breakdown
- Real-World Use Case Scenarios
- Example InterviewExperience Document

### Course Model
- Complex Data Relationships
- Review and Question Handling
- Example Course Document

### Article Model
- Hierarchical Content Structure
- Tagging and Metadata
- Example Article Document

## Routes: API Endpoints
### User Routes
#### Registration and Activation
- `POST /register`: Registers a new user.
- `POST /activate-user`: Activates a user account using a token.

#### Authentication and Authorization
- `POST /login`: Logs in a user.
- `GET /logout`: Logs out a user.
- `GET /refreshToken`: Generates a new access token using a refresh token.
- `GET /me`: Gets the current user's information.
- `POST /socialauth`: Social authentication.

#### Profile Management
- `PUT /updateuserinfo`: Updates user information.
- `PUT /password/update`: Updates the user's password.
- `PUT /update/profilepic`: Updates the user's profile picture.

#### Administrative Functions
- `GET /getalluser`: Gets all users (admin only).
- `PUT /updateuserrole`: Updates a user's role (admin only).
- `DELETE /deleteuser/:id`: Deletes a user (admin only).

### Interview Experience Routes
- `POST /add-interview`: Creates a new interview experience.
- `PUT /update/:id`: Updates an existing interview experience.
- `GET /interviewexper/:id`: Retrieves a specific interview experience.
- `GET /all-interviewexper`: Retrieves all interview experiences.
- `DELETE /deleteexper/:id`: Deletes an interview experience.

### Course Routes
- `POST /create-course`: Creates a new course (admin only).
- `PUT /edit-course/:id`: Edits a course (admin only).
- `GET /single-course/:id`: Retrieves a single course.
- `GET /all-courses`: Retrieves all courses.
- `GET /single-courses-content/:id`: Retrieves course content for a user.
- `PUT /add-question`: Adds a question to a course.
- `PUT /replies-answer`: Replies to a question.
- `PUT /add-review/:id`: Adds a review to a course.
- `PUT /add-replied/:id`: Replies to a review (admin only).
- `DELETE /delete/:id`: Deletes a course (admin only).
- `POST /getvideourl`: Generates a video URL.
- `POST /getcoursesAccess/:id`: Grants access to a course by ID.

### Article Routes
- `POST /artical/create-artical`: Creates a new article (requires authentication).
- `GET /artical/get-all-artical`: Retrieves all articles.
- `GET /artical/get-artical/:id`: Retrieves a specific article.
- `PUT /artical/update/:id`: Updates an article (requires authentication).
- `DELETE /artical/delete-artical/:id`: Deletes an article (requires authentication).

## Authentication and Authorization
### JWT Implementation Details
- We use JSON Web Tokens (JWT) for authentication.
- Tokens are signed using a secret key.
- Tokens include user information and expiration time.

### Access Token and Refresh Token Mechanics
- **Access Token:** Short-lived token (15 minutes) for API access.
- **Refresh Token:** Long-lived token (3 days) for generating new access tokens.

### Role-Based Access Control (RBAC)
- Users are assigned roles (e.g., "user," "admin").
- Roles determine access to specific API endpoints.
- Admin roles have elevated privileges.

### Security Best Practices
- Use HTTPS for all API requests.
- Store sensitive data (e.g., passwords) securely.
- Validate and sanitize user input.
- Implement rate limiting to prevent abuse.

## Example JSON Data: Request and Response Payloads
### User Registration and Login Examples
**Registration Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Login Request:**
```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Login Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Course Creation and Update Examples
**Course Creation Request:**
```json
{
  "name": "Advanced JavaScript",
  "description": "Master advanced JavaScript concepts.",
  "price": 149,
  "thumbnail": {
    "public_id": "public_id_123",
    "url": "https://example.com/thumbnail.jpg"
  },
  "tags": "JavaScript, Advanced",
  "level": "Advanced",
  "demoUrl": "https://example.com/demo",
  "benefits": [{ "title": "Real-world projects" }],
  "prerequisites": [{ "title": "Intermediate JavaScript" }],
  "courseData": [
    {
      "title": "Closures",
      "description": "Understanding JavaScript closures.",
      "subtitles": [
        {
          "subtitle": "What are Closures?",
          "description": "Definition of closures.",
          "videoUrl": "https://example.com/video1",
          "videoThumbnail": {},
          "videoLength": 15,
          "videoPlayer": "vimeo",
          "links": [],
          "suggestions": "Review scope concepts."
        }
      ],
      "questions": []
    }
  ]
}
```

**Course Update Request:**
```json
{
  "description": "Updated course description."
}
```

### Interview Experience Submission and Retrieval Examples
**Interview Experience Submission Request:**
```json
{
  "companyName": "Innovate Inc.",
  "jobPosition": "Software Engineer",
  "finalOutcome": "Offered",
  "rounds": [
    {
      "roundNumber": 1,
      "interviewType": "Technical",
      "interviewDate": "2024-01-15T10:00:00.000Z",
      "experience": "Challenging but rewarding.",
      "interviewQuestion": [
        {
          "question": "Explain async/await.",
          "difficulty": "Medium",
          "questionType": "Technical",
          "questionTopic": "JavaScript"
        }
      ],
      "interviewDifficulty": "Medium",
      "interviewFeedback": "Positive feedback.",
      "outcome": "Passed",
      "preparationMaterials": ["MDN Docs"]
    }
  ]
}
```

**Interview Experience Retrieval Response:**
```json
{
  "_id": "63c0d3e4f5a6b7c8d9e0",
  "user": "60f0a0b0c1d2e3f4a5b6c7d8",
  "companyName": "Innovate Inc.",
  "jobPosition": "Software Engineer",
  "finalOutcome": "Offered",
  "rounds": [
    // ... rounds data ...
  ]
}
```

### Article Creation and Content Examples
**Article Creation Request:**
```json
{
  "title": "Understanding Modern JavaScript",
  "description": "An in-depth guide to modern JavaScript features.",
  "author": "John Doe",
  "tags": ["JavaScript", "Modern", "Tutorial"],
  "subtitles": [
    {
      "title": "ES6 Features",
      "subsubtitle": [
        {
          "title": "Arrow Functions",
          "bodySubtitle": [
            {
              "title": "Syntax",
              "description": "Explanation of arrow function syntax.",
              "code": "const add = (a, b) => a + b;"
            }
          ]
        }
      ]
    }
  ],
  "thumbnail": {
    "public_id": "public_id_456",
    "url": "https://example.com/article-thumbnail.jpg"
  }
}
```

### Question and Review Interaction Examples
**Add Question Request:**
```json
{
  "courseId": "61a0b0c1d2e3f4a5b6c7d9e",
  "question": "What is the difference between let and const?"
}
```

**Add Review Request:**
```json
{
  "courseId": "61a0b0c1d2e3f4a5b6c7d9e",
  "rating": 5,
  "comment": "Excellent course!"
}
```

## Environment Variables: Configuration
### Database Connection Strings
- `MONGODB_URI`: Connection string for the MongoDB database.

### JWT Secret Keys
- `ACCESS_TOKEN_SECRET`: Secret key for signing access tokens.
- `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens.

### Cloud Storage Credentials
- `CLOUD_NAME`: Cloudinary cloud name.
- `CLOUD_API_KEY`: Cloudinary API key.
- `CLOUD_API_SECRET`: Cloudinary API secret.

### Detailed Explanation of Each Variable
These variables are crucial for the application's functionality and security. They should be stored securely and not exposed in the code. Use environment-specific configuration files for different environments (development, production).

## Installation and Setup
### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Cloning the Repository
```bash
git clone https://github.com/karankumar12345/LMS-BACKEND
cd LMS-BACKEND
```

### Installing Dependencies
```bash
npm install
# or
yarn install
```

### Configuring Environment Variables
1. Create a `.env` file in the root directory.
2. Add the required environment variables:
    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/your-database
    ACCESS_TOKEN_SECRET=your-access-token-secret
    REFRESH_TOKEN_SECRET=your-refresh-token-secret
    CLOUD_NAME=your-cloud-name
    CLOUD_API_KEY=your-cloud-api-key
    CLOUD_API_SECRET=your-cloud-api-secret
    ```
3. Replace the placeholder values with your actual values.

### Running the Application
```bash
npm run dev # For development
# or
npm start # For production
```
The application will start on the specified port (usually 3000).

### Database Setup and Migration
Ensure MongoDB is running. The application will automatically create the required collections. For migrations, you can use tools like mongoose-migrate.

## Usage and API Interaction
### Making API Requests with cURL or Postman
**Example cURL Request (Login):**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "jane@example.com",
  "password": "securePassword123"
}' http://localhost:3000/login
```

**Example Postman Request:**
1. Set the request type (POST, GET, PUT, DELETE).
2. Enter the URL (e.g., `http://localhost:3000/register`).
3. Set the headers (e.g., `Content-Type: application/json`).
4. Enter the request body (JSON).

### Code Examples (Node.js, Python) for API Interaction
**Node.js Example (using axios):**
```javascript
const axios = require('axios');

async function loginUser(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      email,
      password,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    return null;
  }
}

loginUser('jane@example.com', 'securePassword123');
```

### Best Practices for API Integration
- Handle errors gracefully.
- Use environment variables for configuration.
- Implement retry logic for network requests.
- Use a consistent data format (JSON).
- Securely store authentication tokens.

## Troubleshooting and Debugging
### Common Errors and Solutions
- **Database Connection Errors:** Verify the `MONGODB_URI`.
- **Authentication Errors:** Check the JWT secret keys and token expiration.
- **Validation Errors:** Ensure request data matches the model schema.
- **Cloud Storage Errors:** Verify Cloudinary credentials.

### Logging and Monitoring
- Use a logging library (e.g., winston, morgan).
- Monitor application performance and errors using tools like Prometheus or Grafana.
- Implement error tracking with tools like Sentry.

### Debugging Techniques
- Use `console.log` or a debugger to inspect variables and execution flow.
- Use Postman or cURL to test API endpoints.
- Check server logs for error messages.

## Contributing Guidelines
### Code Style and Conventions
- Follow the project's coding style (e.g., ESLint for JavaScript).
- Write clean and well-documented code.
- Use meaningful variable and function names.

### Pull Request Process
1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with a clear description of your changes.
4. Address any feedback from reviewers.

### Issue Reporting
- Use the GitHub issue tracker to report bugs and feature requests.
- Provide detailed information about the issue.
- Include steps to reproduce the issue.

## Future Enhancements and Roadmap
### Planned Features
- Implement email verification.
- Add support for more social authentication providers.
- Enhance search and filtering capabilities.
- Implement real-time notifications.

### Scalability and Performance Improvements
- Optimize database queries.
- Implement caching.
- Use a load balancer.
- Explore serverless architecture.

### API Versioning Strategy
- Use semantic versioning (e.g., v1, v2).
- Provide clear documentation for each version.
- Deprecate old versions gracefully.

## License
This project is licensed under the MIT License.
