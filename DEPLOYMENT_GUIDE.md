# PromptIQ - Production Deployment Guide 🚀

## Pre-Deployment Checklist ✅

### 1. Environment Variables Setup

**Local Development:**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

**Required Variables:**
- ✅ Firebase Client SDK (6 variables)
- ✅ Firebase Admin SDK (3 variables)
- ✅ Gemini API Key
- ✅ PhonePe Payment Gateway (4 variables)
- ✅ Application URL

### 2. Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `serviceAccountKey.json` in project root
6. **VERIFY** it's in `.gitignore` (it should be!)

### 3. Test Local Build

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Test development server
npm run dev

# Test production build
npm run build

# Test production server
npm start
```

**Expected Output:**
```
✓ Compiled successfully
✓ Ready in X seconds
```

### 4. Verify .gitignore

Ensure these files are NOT tracked:
```
.env.local
serviceAccountKey.json
node_modules/
.next/
```

Check with:
```bash
git status --ignored
```

---

## GitHub Setup 📦

### Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "PromptIQ v1.0 - Production ready"

# Create main branch (if needed)
git branch -M main
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `promptiq-v2`
3. **DO NOT** initialize with README (we already have files)
4. Keep it private (recommended for production apps)

### Push to GitHub

```bash
# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/promptiq-v2.git

# Push to GitHub
git push -u origin main
```

**Alternative with SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/promptiq-v2.git
git push -u origin main
```

---

## Vercel Deployment 🌐

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Select `promptiq-v2`

### Step 2: Configure Project

**Framework Preset:** Next.js  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`

### Step 3: Add Environment Variables

In Vercel dashboard, go to Settings > Environment Variables.

Add ALL variables from `.env.local`:

#### Firebase Client SDK
```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789012
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789012:web:abcdef
```

#### Firebase Admin SDK
```
FIREBASE_PROJECT_ID = your-project-id
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nYour_Key\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Include the quotes
- Include the `\n` characters
- Paste the entire value as-is from your .env.local

#### Gemini AI
```
GEMINI_API_KEY = your_gemini_api_key
```

#### PhonePe Payment
```
PHONEPE_MERCHANT_ID = your_merchant_id
PHONEPE_SALT_KEY = your_salt_key
PHONEPE_SALT_INDEX = 1
PHONEPE_ENV = production
```

#### Application URL
```
NEXT_PUBLIC_URL = https://your-app.vercel.app
```

**Note:** Update this after first deployment with your actual Vercel URL

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Check deployment logs for errors
4. Visit your deployed URL

### Step 5: Update Application URL

After first deployment:

1. Copy your Vercel URL (e.g., `https://promptiq-v2.vercel.app`)
2. Go to Settings > Environment Variables
3. Update `NEXT_PUBLIC_URL` with your Vercel URL
4. Redeploy (Deployments > ... > Redeploy)

---

## Post-Deployment Configuration 🔧

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel domain to Authorized domains:
   - `your-app.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### 2. Update PhonePe Redirect URLs

1. Go to PhonePe Merchant Dashboard
2. Update redirect URLs:
   - Success: `https://your-app.vercel.app/dashboard?payment=success`
   - Failure: `https://your-app.vercel.app/dashboard?payment=failed`

### 3. Test Production Features

- ✅ User signup/login
- ✅ Prompt generation
- ✅ Share links
- ✅ Payment flow (use test mode first)
- ✅ Waitlist signup
- ✅ Theme switching
- ✅ Mobile responsiveness

---

## Custom Domain Setup (Optional) 🌍

### Add Custom Domain in Vercel

1. Go to Settings > Domains
2. Add your domain (e.g., `promptiq.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Update Environment Variables

```
NEXT_PUBLIC_URL = https://promptiq.com
```

### Update Firebase & PhonePe

- Add custom domain to Firebase Authorized Domains
- Update PhonePe redirect URLs with custom domain

---

## Monitoring & Maintenance 📊

### Vercel Analytics

Enable in Vercel dashboard:
- Settings > Analytics
- View real-time traffic, performance, and errors

### Error Monitoring

Check deployment logs:
- Deployments > Select deployment > View Function Logs
- Look for runtime errors

### Database Monitoring

Firebase Console:
- Firestore > Usage tab
- Check read/write operations
- Monitor costs

### API Quota Monitoring

Google AI Studio:
- Check Gemini API usage
- Monitor rate limits
- Upgrade if needed

---

## Troubleshooting 🔧

### Build Failures

**Error:** "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error:** "TypeScript errors"
```bash
# Solution: Run type check locally
npm run type-check
# Fix errors shown
```

### Runtime Errors

**Error:** "Firebase Admin SDK initialization failed"
- Check `FIREBASE_PRIVATE_KEY` format in Vercel
- Ensure `\n` characters are included
- Verify all 3 Firebase Admin variables are set

**Error:** "Gemini API quota exceeded"
- Check API usage in Google AI Studio
- Implement rate limiting
- Upgrade to paid tier if needed

**Error:** "Share links not working"
- Verify `NEXT_PUBLIC_URL` is set correctly
- Check Firestore security rules
- Test API route: `/api/share/[code]`

### Payment Issues

**Error:** "PhonePe payment failed"
- Verify merchant credentials
- Check `PHONEPE_ENV` setting
- Test in sandbox mode first
- Verify redirect URLs are correct

---

## Security Best Practices 🔒

### Environment Variables
- ✅ Never commit `.env.local` or `serviceAccountKey.json`
- ✅ Use Vercel's encrypted environment variables
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/staging/production

### Firebase Security
- ✅ Review Firestore security rules
- ✅ Enable App Check (recommended)
- ✅ Monitor authentication logs
- ✅ Set up billing alerts

### API Protection
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use CORS properly
- ✅ Monitor for abuse

---

## Scaling Considerations 📈

### When to Scale

**Indicators:**
- Consistent high traffic (>10k users/day)
- Gemini API quota frequently hit
- Firestore costs increasing
- Slow response times

**Solutions:**
1. **Upgrade Gemini API tier** - Higher quota
2. **Implement caching** - Redis/Vercel KV
3. **Add CDN** - Vercel Edge Network
4. **Database optimization** - Firestore indexes
5. **Load balancing** - Multiple regions

---

## Backup & Recovery 💾

### Database Backups

**Firestore:**
1. Go to Firebase Console > Firestore
2. Enable automated backups
3. Export data regularly:
```bash
gcloud firestore export gs://your-bucket/backups
```

### Code Backups

**GitHub:**
- Already backed up in GitHub
- Create tags for releases:
```bash
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

---

## Rollback Procedure 🔄

If deployment fails:

1. **Instant Rollback in Vercel:**
   - Go to Deployments
   - Find last working deployment
   - Click "..." > "Promote to Production"

2. **Revert Code:**
```bash
git revert HEAD
git push origin main
```

3. **Restore Database:**
```bash
gcloud firestore import gs://your-bucket/backups/[timestamp]
```

---

## Support & Resources 📚

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Firebase Community](https://firebase.google.com/community)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Emergency Contacts
- Vercel Support: support@vercel.com
- Firebase Support: Firebase Console > Support
- PhonePe Support: Merchant Dashboard > Support

---

## Production Checklist ✅

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Firebase authorized domains updated
- [ ] PhonePe redirect URLs configured
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Test all user flows
- [ ] Monitor errors for 24 hours
- [ ] Set up billing alerts
- [ ] Enable Vercel Analytics
- [ ] Create backup schedule
- [ ] Document rollback procedure
- [ ] Train support team (if applicable)

---

## Congratulations! 🎉

Your PromptIQ app is now live in production!

**Next Steps:**
1. Monitor initial user feedback
2. Track analytics and errors
3. Iterate based on data
4. Scale as needed

**Need Help?**
- Check troubleshooting section above
- Review Vercel deployment logs
- Contact support if needed

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
