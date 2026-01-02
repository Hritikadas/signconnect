# Firebase Setup Guide for SignConnect

This guide will help you set up Firebase Authentication and Realtime Database for the SignConnect application.

## 🔥 Firebase Project Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `signconnect` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### Step 3: Set up Realtime Database

1. In your Firebase project console, click "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location (select the one closest to your users)
4. Start in "Test mode" for development (you can secure it later)
5. Click "Done"

### Step 4: Get Firebase Configuration

1. In your Firebase project console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter app nickname: `signconnect-web`
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the Firebase configuration object

## 🔧 Environment Configuration

### Step 1: Create Environment File

Create a `.env` file in your `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

### Step 2: Add Firebase Configuration

Edit the `.env` file and add your Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Example with real values:**
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBdVl-cTICSwYKrjn-cKZ6u8xVbvlFhE2M
REACT_APP_FIREBASE_AUTH_DOMAIN=signconnect-demo.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://signconnect-demo-default-rtdb.firebaseio.com/
REACT_APP_FIREBASE_PROJECT_ID=signconnect-demo
REACT_APP_FIREBASE_STORAGE_BUCKET=signconnect-demo.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

## 🔒 Database Security Rules

### Development Rules (Permissive)

For development, you can use these permissive rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Production Rules (Secure)

For production, use these more secure rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "sessions": {
      "$sessionId": {
        ".read": "auth != null && (root.child('sessions').child($sessionId).child('participants').child(auth.uid).exists() || root.child('sessions').child($sessionId).child('createdBy').val() == auth.uid)",
        ".write": "auth != null && (root.child('sessions').child($sessionId).child('participants').child(auth.uid).exists() || root.child('sessions').child($sessionId).child('createdBy').val() == auth.uid)",
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    },
    "invitations": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null"
      }
    }
  }
}
```

### How to Apply Rules

1. Go to Firebase Console → Realtime Database
2. Click on the "Rules" tab
3. Replace the existing rules with the ones above
4. Click "Publish"

## 🧪 Testing the Setup

### Step 1: Start the Application

```bash
# Make sure you're in the frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

### Step 2: Test Registration

1. Go to http://localhost:3000
2. You should be redirected to the login page
3. Click "Sign up here" to go to registration
4. Create a test account:
   - Display Name: `Test User 1`
   - Email: `user1@test.com`
   - Password: `password123`
5. Click "Create Account"

### Step 3: Test Login

1. You should be automatically logged in and redirected to the dashboard
2. Try logging out and logging back in
3. Create another test account (`user2@test.com`) in a different browser/incognito window

### Step 4: Test User Connection

1. With both users logged in (in different browsers), you should see each other in the "Available Users" section
2. Click "Start Session" on one of the users
3. The other user should receive an invitation popup
4. Accept the invitation to join the session

## 📊 Database Structure

The Firebase Realtime Database will have this structure:

```
signconnect-database/
├── users/
│   ├── {userId}/
│   │   ├── uid: string
│   │   ├── displayName: string
│   │   ├── email: string
│   │   ├── isOnline: boolean
│   │   ├── lastSeen: timestamp
│   │   └── status: "available" | "busy" | "in-session"
│   └── ...
├── sessions/
│   ├── {sessionId}/
│   │   ├── id: string
│   │   ├── participants: [userId1, userId2]
│   │   ├── createdBy: userId
│   │   ├── createdAt: timestamp
│   │   ├── status: "waiting" | "active" | "ended"
│   │   └── messages/
│   │       ├── {messageId}/
│   │       │   ├── text: string
│   │       │   ├── senderId: string
│   │       │   ├── senderName: string
│   │       │   ├── timestamp: number
│   │       │   └── type: "text" | "sign" | "system"
│   │       └── ...
│   └── ...
└── invitations/
    ├── {userId}/
    │   ├── {sessionId}/
    │   │   ├── sessionId: string
    │   │   ├── from: userId
    │   │   ├── fromName: string
    │   │   ├── createdAt: timestamp
    │   │   └── status: "pending" | "accepted" | "declined"
    │   └── ...
    └── ...
```

## 🚀 Features Enabled

With Firebase integration, you now have:

### ✅ Authentication Features
- User registration with email/password
- User login/logout
- Automatic authentication state management
- Protected routes

### ✅ Real-time Features
- Online user status tracking
- User availability status (available, busy, in-session)
- Real-time user list updates
- Session invitations
- Live chat messaging

### ✅ Session Management
- Create sessions between two users
- Real-time session status updates
- Session-based chat rooms
- Automatic cleanup on disconnect

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase configuration not found"**
   - Make sure your `.env` file is in the `frontend` directory
   - Check that all Firebase environment variables are set
   - Restart the development server after adding environment variables

2. **"Permission denied" errors**
   - Check your Firebase Database Rules
   - Make sure authentication is working
   - Verify the user is logged in

3. **Users not appearing online**
   - Check the browser console for errors
   - Verify the Firebase Database URL is correct
   - Make sure the user is authenticated

4. **Session invitations not working**
   - Check that both users are online and available
   - Verify Firebase Database Rules allow writing to invitations
   - Check browser console for JavaScript errors

### Debug Mode

To enable debug mode, add this to your `.env` file:

```env
REACT_APP_DEBUG=true
```

This will show additional console logs for Firebase operations.

## 📚 Next Steps

1. **Customize the UI** - Modify the components to match your design
2. **Add more features** - Implement video calling, screen sharing, etc.
3. **Secure the database** - Apply production security rules
4. **Deploy** - Deploy to Firebase Hosting or your preferred platform
5. **Monitor** - Set up Firebase Analytics and Performance Monitoring

## 🆘 Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the browser console for error messages
3. Check the Firebase Console for authentication and database activity
4. Refer to the SignConnect documentation in the `/docs` folder

---

**🎉 Congratulations!** You now have a fully functional Firebase-powered SignConnect application with real-time user connections and session management!