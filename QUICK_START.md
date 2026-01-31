# Quick Start Guide

## Important: Start Both Servers!

This application requires **TWO servers** to run simultaneously:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Backend Server (Terminal 1)
```bash
npm run server
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Keep this terminal open!**

### Step 3: Start Frontend Server (Terminal 2)
Open a **NEW terminal window** and run:
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 4: Test the Application
1. Open http://localhost:3000 in your browser
2. Try registering a new user
3. If you see "Failed to fetch" error, make sure:
   - Backend server is running (Terminal 1)
   - Backend shows "Server running on port 5000"
   - No errors in the backend terminal

## Troubleshooting "Failed to fetch" Error

### Problem: "Failed to fetch" when registering/logging in

**Solution 1: Check if backend is running**
- Look at Terminal 1 - you should see "🚀 Server running on port 5000"
- If not, start it with `npm run server`

**Solution 2: Check MongoDB connection**
- Backend should show "✅ Connected to MongoDB"
- If you see "❌ MongoDB connection error", check your internet connection

**Solution 3: Check ports**
- Backend should be on port 5000
- Frontend should be on port 3000
- Make sure no other application is using these ports

**Solution 4: Check browser console**
- Open browser DevTools (F12)
- Go to Console tab
- Look for any error messages
- Check Network tab to see if API calls are failing

**Solution 5: Verify API URL**
- The frontend should connect to `http://localhost:5000/api`
- Check `src/utils/api.js` - it should use this URL by default

## Common Issues

### Issue: "Cannot connect to server"
- **Fix**: Make sure `npm run server` is running in Terminal 1

### Issue: MongoDB connection error
- **Fix**: Check your internet connection and MongoDB Atlas access

### Issue: Port already in use
- **Fix**: Kill the process using port 5000 or change PORT in `.env` file

### Issue: CORS errors
- **Fix**: Backend has CORS enabled, but make sure backend is running

## Testing the Connection

1. Open browser and go to: http://localhost:5000/api/health
2. You should see: `{"status":"OK","message":"Server is running"}`
3. If this works, the backend is running correctly

## Need Help?

1. Check both terminal windows for error messages
2. Check browser console (F12) for errors
3. Verify MongoDB connection in backend terminal
4. Make sure both servers are running simultaneously

