# ServiceConnect Backend

Backend server for the ServiceConnect platform, built with Node.js, Express, Firebase Authentication, and MongoDB.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a Firebase project and get your service account credentials:
   - Go to Firebase Console
   - Create a new project
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Save the JSON file

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- GET `/api/users/profile` - Get user profile (requires authentication)
- PUT `/api/users/profile` - Update user profile (requires authentication)

### Workers
- GET `/api/users/workers` - Get all workers
- GET `/api/users/workers/:id` - Get worker by ID

## Authentication

The API uses Firebase Authentication. Include the Firebase ID token in the Authorization header:
```
Authorization: Bearer your_firebase_id_token
```

## Models

### User
- firebaseUid (String, required)
- email (String, required)
- fullName (String, required)
- phoneNumber (String)
- role (String: 'client' or 'worker')
- address (Object)
  - street
  - city
  - state
  - zipCode
  - country
- workerProfile (Object, for workers only)
  - services (Array of Strings)
  - skills (Array of Strings)
  - experience (Number)
  - hourlyRate (Number)
  - availability (Boolean)
  - rating (Number)
  - totalReviews (Number)

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Resource not found
- 500: Server error 