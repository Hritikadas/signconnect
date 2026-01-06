# Google Login Error Fix

## Current Issue
Google Login is failing because the domain is not authorized in Firebase Console.

## Quick Fix Steps

### 1. Add Authorized Domains in Firebase Console

1. **Open Firebase Console**: https://console.firebase.google.com/u/0/project/signconnect-56320/authentication/settings

2. **Navigate to Authentication > Settings > Authorized domains**

3. **Add these domains**:
   - `localhost`
   - `127.0.0.1`
   - `192.168.0.106` (your current network IP)

4. **Click "Add domain" for each one**

### 2. Alternative: Use localhost only

Instead of using `http://192.168.0.106:3000`, always use:
```
http://localhost:3000
```

### 3. Clear Browser Cache

After adding domains:
1. Clear browser cache and cookies
2. Refresh the page
3. Try Google login again

## Expected Error Codes

- `auth/unauthorized-domain` → Domain not in Firebase Console
- `auth/popup-blocked` → Browser blocking popup
- `auth/popup-closed-by-user` → User closed login popup

## Test Steps

1. Go to `http://localhost:3000/login`
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to dashboard

## If Still Not Working

Check browser console (F12) for detailed error messages and contact support with the specific error code.

## Firebase Console Direct Link

https://console.firebase.google.com/u/0/project/signconnect-56320/authentication/settings