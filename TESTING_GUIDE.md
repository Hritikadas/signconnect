# SignConnect - Testing Guide

## 🧪 Complete Testing Workflow

### Prerequisites
- Both backend and frontend servers running
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 1. Authentication Testing

### Register New Account
1. Open http://localhost:3000
2. Click "Get Started" or navigate to `/register`
3. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Create Account"
5. **Expected:** Redirect to dashboard

### Login
1. Navigate to `/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"
4. **Expected:** Redirect to dashboard

### Logout
1. From dashboard, click "Logout" button in header
2. **Expected:** Redirect to login page

---

## 2. Dashboard Testing

### Access Dashboard
1. Login to the application
2. **Expected:** See dashboard with:
   - Welcome message
   - "Create Room" card
   - "Join Room" card
   - Recent rooms section
   - Features showcase

### Theme Toggle
1. Click the moon/sun icon in header
2. **Expected:** Toggle between dark and light mode
3. **Expected:** Theme persists on page reload

### High Contrast Mode
1. Click the contrast icon in header
2. **Expected:** Toggle high contrast mode
3. **Expected:** Visual changes in contrast

---

## 3. Video Room Testing

### Create New Room
1. From dashboard, click "Create New Room"
2. **Expected:** Navigate to `/room/:roomId` (unique ID)
3. **Expected:** See video call interface with:
   - Your camera feed
   - Room ID in header
   - Participant count
   - Video controls (mute, camera, screen share, leave)
   - Chat panel on right
   - Sign detection toggle

### Camera and Microphone
1. Browser should request camera/microphone permissions
2. Click "Allow"
3. **Expected:** See your video feed
4. **Expected:** Camera indicator shows active

### Video Controls

#### Mute/Unmute Audio
1. Click microphone button
2. **Expected:** Button turns red when muted
3. **Expected:** Microphone icon changes
4. Click again to unmute

#### Turn Camera On/Off
1. Click camera button
2. **Expected:** Video feed stops, shows placeholder
3. **Expected:** Button turns red
4. Click again to turn camera back on

#### Screen Sharing
1. Click screen share button
2. **Expected:** Browser shows screen selection dialog
3. Select a screen/window
4. **Expected:** Screen sharing starts
5. Click again to stop sharing

#### Leave Room
1. Click leave button (red phone icon)
2. **Expected:** Navigate back to dashboard

---

## 4. Sign Language Detection Testing

### Enable Sign Detection
1. In video room, ensure "Sign Detection ON" button is green
2. **Expected:** See hand landmarks overlay on video

### Test Gestures

#### Hello Gesture
1. Show all fingers up (open hand)
2. **Expected:** "Hello" appears in detected text overlay
3. **Expected:** Message sent to chat as sign message

#### OK Gesture
1. Touch thumb and index finger (OK sign)
2. **Expected:** "OK" appears in detected text

#### Number One
1. Show only index finger up
2. **Expected:** "One" appears in detected text

#### Number Two
1. Show index and middle fingers up
2. **Expected:** "Two" appears in detected text

#### Yes Gesture
1. Make a fist
2. **Expected:** "Yes" appears in detected text

### Disable Sign Detection
1. Click "Sign Detection OFF" button
2. **Expected:** Hand landmarks disappear
3. **Expected:** No gesture detection

---

## 5. Chat Testing

### Send Text Message
1. In video room, type message in chat input
2. Press Enter or click "Send"
3. **Expected:** Message appears in chat panel
4. **Expected:** Your messages appear on right (blue)

### Sign Messages
1. Enable sign detection
2. Perform a gesture (e.g., "Hello")
3. **Expected:** Sign message appears in chat (green)
4. **Expected:** Shows 🤟 emoji indicator

### Chat Features
- **Expected:** Messages show sender name
- **Expected:** Messages show timestamp
- **Expected:** Chat auto-scrolls to latest message
- **Expected:** Your messages vs others' messages have different colors

---

## 6. Multi-User Testing

### Join Same Room (Two Browsers)

#### Browser 1:
1. Login as User 1
2. Create a room
3. Copy the room ID from URL

#### Browser 2:
1. Login as User 2 (different account)
2. From dashboard, paste room ID in "Join Room" input
3. Click "Join Room"

#### Expected Results:
- Both users see each other in participant list
- Both users can see participant count increase
- Chat messages sync between users
- Sign detection messages visible to both users
- Video feeds should connect (WebRTC)

---

## 7. Join Room by ID

### From Dashboard
1. Get a room ID (from URL when creating a room)
2. Go to dashboard
3. Enter room ID in "Join Room" input
4. Click "Join Room"
5. **Expected:** Navigate to that specific room

### Direct URL
1. Navigate to `http://localhost:3000/room/YOUR_ROOM_ID`
2. **Expected:** Join the room directly

---

## 8. Recent Rooms Testing

### View Recent Rooms
1. From dashboard, scroll to "Recent Rooms" section
2. **Expected:** See list of previously joined rooms
3. **Expected:** Each room shows:
   - Room name
   - Last joined time
   - Participant count

### Rejoin Room
1. Click on a recent room card
2. **Expected:** Navigate to that room

---

## 9. Session Room Testing (Firebase)

### Create Session
1. Navigate to `/session/test-session-123`
2. **Expected:** See session room interface
3. **Expected:** Video area placeholder
4. **Expected:** Chat panel on right

### Send Messages
1. Type message in chat input
2. Click "Send"
3. **Expected:** Message appears with timestamp

### Simulate Sign Detection
1. Click "🤟 Simulate Sign" button
2. **Expected:** Random sign message appears in chat
3. **Expected:** Sign messages have green background

### Leave Session
1. Click "Leave Session" button
2. **Expected:** Navigate back to dashboard

---

## 10. Protected Routes Testing

### Access Without Login
1. Logout from application
2. Try to access `/dashboard`
3. **Expected:** Redirect to `/login`

4. Try to access `/room/test-room`
5. **Expected:** Redirect to `/login`

### Access After Login
1. Login to application
2. Access `/dashboard`
3. **Expected:** Dashboard loads successfully

4. Access `/room/test-room`
5. **Expected:** Video room loads successfully

---

## 11. Error Handling Testing

### Invalid Room ID
1. Navigate to `/room/invalid-room-id-12345`
2. **Expected:** Room loads (creates new room)

### Network Disconnection
1. Join a room
2. Disconnect internet
3. **Expected:** Graceful error handling
4. Reconnect internet
5. **Expected:** Reconnection attempt

### Camera/Microphone Denied
1. Join a room
2. Deny camera/microphone permissions
3. **Expected:** Error message or placeholder
4. **Expected:** Can still use chat

---

## 12. Responsive Design Testing

### Desktop (1920x1080)
- **Expected:** Full layout with sidebar
- **Expected:** Video controls visible
- **Expected:** Chat panel on right

### Tablet (768x1024)
- **Expected:** Responsive layout
- **Expected:** Controls adapt to screen size

### Mobile (375x667)
- **Expected:** Mobile-optimized layout
- **Expected:** Touch-friendly buttons
- **Expected:** Chat may overlay or stack

---

## 13. Performance Testing

### Video Quality
- **Expected:** Smooth video playback
- **Expected:** No significant lag
- **Expected:** Audio sync with video

### Sign Detection Performance
- **Expected:** Real-time gesture recognition
- **Expected:** Minimal delay (<500ms)
- **Expected:** Accurate detection with buffering

### Chat Performance
- **Expected:** Instant message delivery
- **Expected:** No message loss
- **Expected:** Smooth scrolling

---

## 14. Browser Compatibility

### Test in Multiple Browsers
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (Mac)

### WebRTC Support
- **Expected:** Camera/microphone access works
- **Expected:** Peer connections establish
- **Expected:** Screen sharing available

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Video Streaming:** WebRTC requires both users to be online simultaneously
2. **Sign Detection:** Works best in good lighting conditions
3. **Browser Support:** Best experience in Chrome/Edge
4. **Mobile:** Some features may be limited on mobile browsers

### Minor Warnings
- ESLint warnings in console (non-critical)
- Webpack deprecation warnings (non-critical)
- MediaPipe CDN loading time

---

## ✅ Success Criteria

Your SignConnect application is working correctly if:

1. ✅ Users can register and login
2. ✅ Dashboard displays correctly
3. ✅ Room creation navigates to video call
4. ✅ Join room by ID works
5. ✅ Camera and microphone access granted
6. ✅ Video controls function properly
7. ✅ Sign detection recognizes gestures
8. ✅ Chat messages send and receive
9. ✅ Theme toggle works
10. ✅ Protected routes redirect properly

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

Authentication:
[ ] Register - Pass/Fail
[ ] Login - Pass/Fail
[ ] Logout - Pass/Fail

Dashboard:
[ ] Display - Pass/Fail
[ ] Create Room - Pass/Fail
[ ] Join Room - Pass/Fail
[ ] Theme Toggle - Pass/Fail

Video Room:
[ ] Camera Access - Pass/Fail
[ ] Microphone Access - Pass/Fail
[ ] Video Controls - Pass/Fail
[ ] Screen Sharing - Pass/Fail

Sign Detection:
[ ] Hello Gesture - Pass/Fail
[ ] OK Gesture - Pass/Fail
[ ] Number Gestures - Pass/Fail

Chat:
[ ] Send Message - Pass/Fail
[ ] Receive Message - Pass/Fail
[ ] Sign Messages - Pass/Fail

Multi-User:
[ ] Join Same Room - Pass/Fail
[ ] Video Connection - Pass/Fail
[ ] Chat Sync - Pass/Fail

Overall Status: Pass/Fail
Notes: _______________
```

---

## 🚀 Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/health

# Test API info
curl http://localhost:5000/

# Register user (example)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login user (example)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

**Happy Testing! 🎉**

If you encounter any issues, check:
1. Backend logs in terminal
2. Frontend console in browser (F12)
3. Network tab for API calls
4. DEPLOYMENT_STATUS.md for current status
