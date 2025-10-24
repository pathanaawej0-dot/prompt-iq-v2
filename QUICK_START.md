# ⚡ PromptIQ v2 - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Firebase account
- Gemini API key

## 🚀 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
cd promptiq-v2
npm install
```

### 2. Configure Environment (2 min)

```bash
# Copy template
cp env.template .env.local

# Edit .env.local with your credentials
```

**Minimum required:**
```env
# Firebase (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI (get from Google AI Studio)
GEMINI_API_KEY=your_gemini_key

# App URL
NEXT_PUBLIC_URL=http://localhost:3000

# PhonePe (optional for testing - use sandbox values)
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_MODE=SANDBOX
```

### 3. Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Test the App (1 min)

1. Click "Start Free Trial"
2. Create account
3. Generate a prompt
4. Check history

**Done! 🎉**

---

## 📖 Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Maintenance
npm run clean           # Clean build files
```

---

## 🔑 Getting API Keys

### Firebase (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication > Email/Password
4. Create Firestore database
5. Go to Project Settings
6. Copy config values to `.env.local`

### Gemini API (1 minute)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key to `.env.local`

---

## 🎯 Quick Test Checklist

- [ ] App loads at localhost:3000
- [ ] Can create account
- [ ] Can log in
- [ ] Can generate prompt
- [ ] Prompt appears in history
- [ ] Can log out

---

## 🐛 Common Issues

### "Firebase: Error (auth/invalid-api-key)"
**Fix:** Check `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`

### "Failed to generate prompt"
**Fix:** Check `GEMINI_API_KEY` in `.env.local`

### "Module not found"
**Fix:** Run `npm install` again

### Build errors
**Fix:** Run `npm run clean && npm install && npm run dev`

---

## 📚 Documentation

- **Full Setup:** `SETUP_GUIDE.md`
- **API Docs:** `API_DOCUMENTATION.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`
- **Deployment:** `DEPLOYMENT_CHECKLIST.md`

---

## 🚀 Deploy to Production

### Vercel (Easiest)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables
# 5. Deploy!
```

---

## 💡 Pro Tips

1. **Use keyboard shortcuts:**
   - `Cmd/Ctrl + Enter` to generate

2. **Test with sandbox:**
   - PhonePe sandbox for payment testing

3. **Check console:**
   - Browser console for errors
   - Terminal for server logs

4. **Read docs:**
   - Comprehensive guides available
   - API documentation included

---

## 🎓 Learn More

- **Project Structure:** `PROJECT_SUMMARY.md`
- **Contributing:** `CONTRIBUTING.md`
- **Roadmap:** `ROADMAP.md`
- **Full README:** `README.md`

---

## 📞 Need Help?

- **Email:** support@promptiq.com
- **Docs:** All `.md` files in root
- **Issues:** Check `TROUBLESHOOTING.md`

---

## ✅ Success Criteria

You're ready when:
- ✅ App runs locally
- ✅ Can create account
- ✅ Can generate prompts
- ✅ No console errors

---

**Time to build something LEGENDARY! 🚀**

---

**Quick Links:**
- [Firebase Console](https://console.firebase.google.com)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Vercel Dashboard](https://vercel.com)
- [PhonePe Business](https://business.phonepe.com)
