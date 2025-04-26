# ServiceConnect Backend

This is the backend server for the ServiceConnect platform, built with Node.js and Firebase Authentication.

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Firebase Setup**
- Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com)
- Go to Project Settings > Service Accounts
- Generate a new private key and save it as `firebase-service-account.json` in the root directory
- Enable Authentication in Firebase Console and set up the desired providers (Email/Password, Google, etc.)

3. **Environment Variables**
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
```

4. **Frontend Firebase Configuration**
- Go to Firebase Console > Project Settings
- Under the "Web" section, register a new web application
- Copy the Firebase configuration object
- Paste it in the `firebaseConfig` object in `public/js/firebaseAuth.js`

5. **Start the Server**
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/verify-token` - Verify Firebase ID token
  - Headers: `Authorization: Bearer <firebase-id-token>`

### Protected Routes
- `GET /api/profile` - Get user profile (protected route)
  - Headers: `Authorization: Bearer <firebase-id-token>`

## Security
- Uses Firebase Authentication for secure user management
- Implements token verification middleware
- CORS enabled
- Helmet.js for security headers

## Error Handling
The server implements centralized error handling middleware for consistent error responses. 