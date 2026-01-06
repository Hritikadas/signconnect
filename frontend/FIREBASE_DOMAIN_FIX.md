# Firebase Domain Authorization Fix

## Issue
Google Login is failing with "unauthorized-domain" error because the current domain is not authorized in Firebase Console.

## Solution

### 1. Add Authorized Domains in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `signconnect-56320`
3. Navigate to **Authentication** > **Settings** > **Authorized domains**
4. Add the following domains:

```
localhost
127.0.0.1
192.168.0.106
your-production-domain.com (when deploying)
```

### 2. Current Domains to Add

Based on your current setup, add these domains:
- `localhost` (for localhost:3000)
- `192.168.0.106` (for network access)

### 3. Steps to Fix

1. **Open Firebase Console**: https://console.firebase.google.com/u/0/project/signconnect-56320/authentication/settings
2. **Click "Add domain"**
3. **Add**: `localhost`
4. **Click "Add domain"** again
5. **Add**: `192.168.0.106`
6. **Save changes**

### 4. Alternative: Use localhost only

If you want to avoid network IP issues, always use `http://localhost:3000` instead of `http://192.168.0.106:3000`

## Testing

After adding the domains:
1. Clear browser cache
2. Try Google login again
3. Check browser console for detailed error messages

## Common Firebase Auth Domains

For development, typically add:
- `localhost`
- `127.0.0.1`
- Your local network IP (if needed)

For production, add:
- Your actual domain (e.g., `signconnect.com`)
- Any subdomains (e.g., `app.signconnect.com`)