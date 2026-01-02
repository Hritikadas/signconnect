# SignConnect API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "avatar_url"
}
```

---

## User Endpoints

### Get Profile
```http
GET /users/profile
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "avatar_url",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Profile
```http
PUT /users/profile
```

**Body:**
```json
{
  "name": "John Updated",
  "avatar": "new_avatar_url"
}
```

---

## Room Endpoints

### Create Room
```http
POST /rooms/create
```

**Body:**
```json
{
  "roomId": "unique-room-id"
}
```

**Response:**
```json
{
  "roomId": "unique-room-id",
  "createdBy": "user_id",
  "participants": ["user_id"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Room History
```http
GET /rooms/history
```

**Response:**
```json
[
  {
    "roomId": "room-id",
    "createdBy": {
      "id": "user_id",
      "name": "John Doe"
    },
    "participants": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Room Messages
```http
GET /rooms/:roomId/messages
```

**Response:**
```json
[
  {
    "userId": "user_id",
    "text": "Hello",
    "isSign": false,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Socket.IO Events

### Client → Server

#### Join Room
```javascript
socket.emit('join-room', {
  roomId: 'room-id',
  userId: 'user-id',
  userName: 'John Doe'
});
```

#### Send Offer (WebRTC)
```javascript
socket.emit('offer', {
  offer: rtcOffer,
  to: 'peer-user-id',
  roomId: 'room-id'
});
```

#### Send Answer (WebRTC)
```javascript
socket.emit('answer', {
  answer: rtcAnswer,
  to: 'peer-user-id',
  roomId: 'room-id'
});
```

#### Send ICE Candidate
```javascript
socket.emit('ice-candidate', {
  candidate: iceCandidate,
  to: 'peer-user-id',
  roomId: 'room-id'
});
```

#### Send Chat Message
```javascript
socket.emit('chat-message', {
  roomId: 'room-id',
  message: {
    userId: 'user-id',
    userName: 'John Doe',
    text: 'Hello',
    timestamp: new Date()
  }
});
```

#### Sign Detected
```javascript
socket.emit('sign-detected', {
  roomId: 'room-id',
  text: 'Hello',
  userId: 'user-id'
});
```

#### Leave Room
```javascript
socket.emit('leave-room', {
  roomId: 'room-id'
});
```

### Server → Client

#### User Joined
```javascript
socket.on('user-joined', ({ userId, userName }) => {
  // Handle new user
});
```

#### Receive Offer
```javascript
socket.on('offer', ({ offer, userId, userName }) => {
  // Handle WebRTC offer
});
```

#### Receive Answer
```javascript
socket.on('answer', ({ answer, userId }) => {
  // Handle WebRTC answer
});
```

#### Receive ICE Candidate
```javascript
socket.on('ice-candidate', ({ candidate, userId }) => {
  // Handle ICE candidate
});
```

#### Receive Chat Message
```javascript
socket.on('chat-message', (message) => {
  // Display message
});
```

#### Sign Detected
```javascript
socket.on('sign-detected', ({ text, userId, userName }) => {
  // Display detected sign
});
```

#### User Left
```javascript
socket.on('user-left', ({ userId }) => {
  // Handle user disconnect
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message"
}
```
