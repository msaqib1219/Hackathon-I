# 🚀 Phase A: Local Backend + ngrok Setup Guide

**Goal:** Get a working, demo-able chatbot in 15 minutes  
**Timeline:** This week  
**Effort:** Minimal ops overhead  

---

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Python
python3 --version        # Should be 3.8+

# Check pip
python3 -m pip --version

# Check git
git status              # Should show clean working directory
```

---

## Step 1: Start Backend Locally (5 min)

### 1.1 Install dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 1.2 Verify .env is configured
```bash
# backend/.env should have:
# - DATABASE_URL (Supabase connection)
# - GEMINI_API_KEY
# - QDRANT_URL and QDRANT_API_KEY
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# - JWT_SECRET_KEY

cat .env | grep -E "DATABASE_URL|GEMINI_API_KEY|QDRANT"
```

### 1.3 Start the server
```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 1.4 Quick health check (in another terminal)
```bash
curl http://localhost:8000/api/health
# Should return: {"status": "ok"} or similar
```

✅ **Backend is running locally!**

---

## Step 2: Expose with ngrok (3 min)

### 2.1 Install ngrok (if not already installed)
```bash
# Option A: Download directly
curl https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip -o ngrok.zip
unzip ngrok.zip
sudo mv ngrok /usr/local/bin/

# Option B: Via package manager (if available)
# apt-get install ngrok (Ubuntu/Debian)
# brew install ngrok (macOS)
```

### 2.2 Start ngrok tunnel
```bash
ngrok http 8000
```

**Expected output:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       [your-email]
Version                        X.XX.X
Region                        us (United States)
Latency                        XX ms
Web Interface                  http://127.0.0.1:4040

Forwarding                     https://abc123-456.ngrok.io -> http://localhost:8000
```

**Copy the HTTPS URL:** `https://abc123-456.ngrok.io` ← **This is your backend URL**

✅ **Backend is now publicly accessible!**

---

## Step 3: Update Netlify Frontend (2 min)

### 3.1 Go to Netlify
1. Open [app.netlify.com](https://app.netlify.com)
2. Select your site
3. Click **Site Settings**
4. Go to **Build & deploy** → **Environment**

### 3.2 Set environment variable
Click **Add environment variable** and set:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://abc123-456.ngrok.io` |

(Replace `abc123-456` with your actual ngrok URL)

### 3.3 Trigger deploy
Click **Trigger deploy** (green button)

Wait 1-2 minutes for deployment to complete.

✅ **Frontend is updated!**

---

## Step 4: Test Full Stack (3 min)

### 4.1 Open your Netlify site
Go to your Netlify site URL (e.g., `https://your-site.netlify.app`)

### 4.2 Test features
- [ ] Page loads without errors
- [ ] Sign in with Google works
- [ ] Can send a chat message
- [ ] Bot responds with Gemini answer
- [ ] No CORS errors in browser console (F12)

### 4.3 Monitor logs (optional)
```bash
# In the ngrok web interface: http://localhost:4040
# You can see all requests in real-time
```

✅ **Demo is working!**

---

## Step 5: Keep Running (Important!)

For the backend to stay accessible, you need to keep both running:

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2: ngrok
```bash
ngrok http 8000
```

**Keep these terminals open as long as you want the demo accessible.**

### Option A: Foreground (Simplest)
- Keep both terminals open
- When you close them, backend goes offline
- **Best for:** Testing and development

### Option B: Background (24/7 when laptop is on)
```bash
# Run ngrok in background
nohup ngrok http 8000 > ngrok.log 2>&1 &

# Run backend in background
cd backend && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
```

### Option C: tmux or screen (Persistent sessions)
```bash
# Create named tmux session
tmux new-session -d -s backend
tmux send-keys -t backend 'cd backend && source venv/bin/activate && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000' Enter

tmux new-session -d -s ngrok
tmux send-keys -t ngrok 'ngrok http 8000' Enter

# Check status
tmux list-sessions
```

---

## 🎯 Success Checklist

- [ ] Backend runs on `localhost:8000`
- [ ] ngrok tunnel is active
- [ ] Netlify env var is set to ngrok URL
- [ ] Netlify deployment triggered
- [ ] Frontend loads without errors
- [ ] OAuth sign-in works
- [ ] Chat message gets response
- [ ] No CORS errors in console

---

## ⚠️ Common Issues

### "Connection refused" or "Can't reach localhost:8000"
- Check backend is actually running (see Terminal 1 output)
- Try `curl http://localhost:8000/api/health` to verify

### "ngrok URL changed, frontend broke"
- ngrok URL changes each time you restart
- Update Netlify env var with new URL
- Then trigger deploy again

### "CORS error in browser console"
- Verify `ALLOWED_ORIGINS` in backend/.env includes `https://your-netlify-site.netlify.app`
- Make sure `FRONTEND_URL` is set correctly
- Restart backend after env changes

### "Chat not responding"
- Check GEMINI_API_KEY is correct in backend/.env
- Check QDRANT_URL and QDRANT_API_KEY are correct
- Try `curl http://localhost:8000/api/health` to verify backend health

### "Database connection failed"
- Verify DATABASE_URL is correct (Supabase connection string)
- Check Supabase project is "Active" (not paused)
- Try: `psql $DATABASE_URL` from command line to test connection

---

## 📋 Next Steps (When Ready)

Once Phase A is working reliably:

1. **Use it for demos** - Show it to friends, colleagues, instructors
2. **Test thoroughly** - Identify any bugs or issues
3. **Document learnings** - What did you learn from this setup?
4. **Plan Phase B** - When you're ready for permanent hosting:
   - See `.claude/DEPLOYMENT_PLAN.md` for Phase B options
   - Consider Render, Railway, or small VPS

---

## 📞 Getting Help

If you get stuck:
1. Check this guide's "Common Issues" section
2. Look at browser console (F12) for error messages
3. Check ngrok dashboard (http://localhost:4040) for requests
4. Check backend logs in Terminal 1 for errors
5. Ask for help with specific error message

---

**Version:** 1.0  
**Last Updated:** 2026-04-19  
**Related:** See `.claude/DEPLOYMENT_PLAN.md` for long-term strategy
