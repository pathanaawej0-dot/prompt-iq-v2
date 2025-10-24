# 🚀 PromptIQ v2 - Complete Setup Guide

This guide will walk you through setting up PromptIQ v2 from scratch.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- Google Cloud account (for Gemini API)
- PhonePe merchant account (for payments)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd promptiq-v2

# Install dependencies
npm install
```

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `promptiq-v2`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### 2.3 Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

### 2.4 Set Firestore Security Rules

Go to **Firestore Database > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /prompts/{promptId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    match /shared_links/{linkId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

Click "Publish"

### 2.5 Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname: `promptiq-web`
5. Copy the Firebase configuration object

## Step 3: Gemini API Setup

### 3.1 Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select your Google Cloud project or create new one
5. Copy the API key

### 3.2 Enable Gemini API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services > Library**
4. Search for "Generative Language API"
5. Click "Enable"

## Step 4: PhonePe Setup (Optional - for payments)

### 4.1 Register as Merchant

1. Visit [PhonePe Business](https://business.phonepe.com)
2. Sign up for merchant account
3. Complete KYC verification
4. Get approved for payment gateway

### 4.2 Get Credentials

1. Login to PhonePe merchant dashboard
2. Go to **Settings > API Keys**
3. Copy:
   - Merchant ID
   - Salt Key
   - Salt Index

### 4.3 Test Mode

For development, use PhonePe's sandbox environment:
- Merchant ID: `PGTESTPAYUAT`
- Salt Key: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
- Salt Index: `1`

## Step 5: Environment Variables

Create `.env.local` file in the root directory:

```bash
# Copy the template
cp env.template .env.local
```

Edit `.env.local` and fill in your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# PhonePe Payment Gateway (use test credentials for development)
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_MODE=SANDBOX

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000
```

## Step 6: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test the Application

### 7.1 Test Signup

1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create a new account
3. Check Firebase Console > Authentication to see the new user
4. Check Firestore > users collection for user document

### 7.2 Test Prompt Generation

1. Login to your account
2. Go to Dashboard
3. Enter an idea in Quick Mode
4. Select a framework
5. Click "Generate Legendary Prompt"
6. Verify the prompt is generated and saved

### 7.3 Test History

1. Go to History page
2. Verify your generated prompts appear
3. Test search and filter functionality
4. Test view, copy, and delete actions

### 7.4 Test Payment (Optional)

1. Go to Upgrade page
2. Click "Upgrade Now" on Architect plan
3. You'll be redirected to PhonePe sandbox
4. Use test credentials to complete payment
5. Verify plan upgrade in dashboard

## Step 8: Production Deployment

### 8.1 Prepare for Production

1. **Update Environment Variables:**
   - Set `NEXT_PUBLIC_URL` to your production domain
   - Set `PHONEPE_MODE=PRODUCTION`
   - Use production PhonePe credentials

2. **Update Firebase:**
   - Add production domain to authorized domains
   - Update Firestore indexes if needed

3. **Test Everything:**
   - Run through all features
   - Check error handling
   - Verify responsive design

### 8.2 Deploy to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. Add Environment Variables:
   - Copy all variables from `.env.local`
   - Paste in Vercel environment variables section

7. Click "Deploy"

8. Wait for deployment to complete

9. Visit your production URL

### 8.3 Post-Deployment

1. **Update Firebase:**
   - Add production domain to authorized domains
   - Update redirect URLs

2. **Update PhonePe:**
   - Update webhook URL to production domain
   - Update redirect URLs

3. **Test Production:**
   - Test signup/login
   - Test prompt generation
   - Test payment flow
   - Check all pages

## Troubleshooting

### Firebase Connection Error

**Error:** "Firebase: Error (auth/invalid-api-key)"

**Solution:**
- Verify `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Check Firebase project settings
- Ensure API key is not restricted

### Gemini API Error

**Error:** "Failed to generate prompt"

**Solution:**
- Verify `GEMINI_API_KEY` is correct
- Check API is enabled in Google Cloud
- Verify quota limits

### Payment Error

**Error:** "Failed to create payment order"

**Solution:**
- Verify PhonePe credentials
- Check `PHONEPE_MODE` is set correctly
- Ensure webhook URL is accessible

### Build Error

**Error:** "Module not found"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## Additional Configuration

### Custom Domain

1. In Vercel, go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_URL` in environment variables

### Email Configuration

For password reset emails, configure Firebase:
1. Go to Firebase Console > Authentication
2. Click "Templates"
3. Customize email templates
4. Add your domain

### Analytics (Optional)

Add Google Analytics:
1. Create GA4 property
2. Get measurement ID
3. Add to Next.js config

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages in console
3. Check Firebase/Gemini quotas
4. Verify all environment variables

For additional help:
- Email: support@promptiq.com
- Documentation: [your-docs-url]

## Next Steps

After setup:
1. ✅ Customize branding and colors
2. ✅ Add more frameworks
3. ✅ Implement PDF export
4. ✅ Add share link functionality
5. ✅ Set up monitoring and analytics
6. ✅ Create user documentation
7. ✅ Plan marketing strategy

---

**Congratulations! Your PromptIQ v2 application is now ready! 🎉**
