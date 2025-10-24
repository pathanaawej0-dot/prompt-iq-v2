# 🔧 PromptIQ v2 - Troubleshooting Guide

Common issues and their solutions.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Firebase Issues](#firebase-issues)
- [Gemini API Issues](#gemini-api-issues)
- [Payment Issues](#payment-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Use legacy peer deps:
```bash
npm install --legacy-peer-deps
```

### Issue: Node version mismatch

**Symptoms:**
```
npm WARN EBADENGINE Unsupported engine
```

**Solution:**
Update Node.js to version 20+:
```bash
# Using nvm
nvm install 20
nvm use 20

# Or download from nodejs.org
```

---

## Firebase Issues

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Symptoms:**
- Cannot sign up or log in
- Console shows Firebase authentication error

**Solutions:**
1. Verify `.env.local` has correct Firebase API key:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_key_here
```

2. Check Firebase Console > Project Settings > General
3. Ensure API key is not restricted in Google Cloud Console

### Issue: "Permission denied" in Firestore

**Symptoms:**
- Cannot save or read data
- Console shows Firestore permission error

**Solutions:**
1. Check Firestore Rules in Firebase Console
2. Ensure rules match the template in SETUP_GUIDE.md
3. Verify user is authenticated before accessing data

**Correct Rules:**
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
  }
}
```

### Issue: User document not created on signup

**Symptoms:**
- User can sign up but dashboard shows errors
- User data missing in Firestore

**Solutions:**
1. Check browser console for errors
2. Verify `signUp` function in `lib/firebase.ts`
3. Check Firestore permissions
4. Ensure network connection is stable

**Debug:**
```javascript
// Add logging in lib/firebase.ts
console.log('Creating user document for:', user.uid);
await setDoc(doc(db, 'users', user.uid), userDoc);
console.log('User document created successfully');
```

---

## Gemini API Issues

### Issue: "Failed to generate prompt"

**Symptoms:**
- Prompt generation fails
- Error message in console

**Solutions:**
1. Verify Gemini API key in `.env.local`:
```bash
GEMINI_API_KEY=your_actual_gemini_key
```

2. Check API is enabled in Google Cloud Console:
   - Go to APIs & Services > Library
   - Search "Generative Language API"
   - Ensure it's enabled

3. Check API quota:
   - Go to Google Cloud Console
   - APIs & Services > Quotas
   - Verify you haven't exceeded limits

### Issue: "API key not configured"

**Symptoms:**
- Error immediately when trying to generate

**Solution:**
Ensure `GEMINI_API_KEY` is set (without `NEXT_PUBLIC_` prefix):
```bash
# Correct
GEMINI_API_KEY=your_key

# Incorrect
NEXT_PUBLIC_GEMINI_API_KEY=your_key
```

### Issue: Slow prompt generation

**Symptoms:**
- Takes more than 10 seconds to generate
- Timeout errors

**Solutions:**
1. Check internet connection
2. Verify Gemini API status
3. Try different model if available
4. Implement timeout handling:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
  const result = await model.generateContent({
    signal: controller.signal,
    // ... other options
  });
} finally {
  clearTimeout(timeoutId);
}
```

---

## Payment Issues

### Issue: Payment redirect fails

**Symptoms:**
- Clicking "Upgrade Now" does nothing
- Console shows payment error

**Solutions:**
1. Verify PhonePe credentials in `.env.local`
2. Check `PHONEPE_MODE` is set correctly:
```bash
# For testing
PHONEPE_MODE=SANDBOX

# For production
PHONEPE_MODE=PRODUCTION
```

3. Ensure `NEXT_PUBLIC_URL` is correct
4. Check network tab for API errors

### Issue: Payment succeeds but plan not updated

**Symptoms:**
- Payment completed on PhonePe
- User still on free plan

**Solutions:**
1. Check webhook is accessible:
```bash
curl -X POST https://your-domain.com/api/payment/webhook
```

2. Verify webhook URL in PhonePe dashboard
3. Check webhook logs in Vercel/hosting platform
4. Manually update user plan in Firestore (temporary fix)

### Issue: "Invalid signature" webhook error

**Symptoms:**
- Webhook returns 400 error
- Payment not processed

**Solutions:**
1. Verify `PHONEPE_SALT_KEY` matches PhonePe dashboard
2. Check `PHONEPE_SALT_INDEX` is correct (usually "1")
3. Ensure webhook payload is not modified

---

## Build Issues

### Issue: Build fails with TypeScript errors

**Symptoms:**
```
Type error: Property 'x' does not exist on type 'Y'
```

**Solutions:**
1. Run type check to see all errors:
```bash
npm run type-check
```

2. Fix type errors one by one
3. Ensure all imports are correct
4. Check `tsconfig.json` is properly configured

### Issue: Build fails with module not found

**Symptoms:**
```
Module not found: Can't resolve '@/components/...'
```

**Solutions:**
1. Verify file exists at specified path
2. Check import path is correct
3. Ensure `tsconfig.json` has correct paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Out of memory during build

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solutions:**
1. Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

2. Update `package.json`:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## Runtime Issues

### Issue: "Hydration failed" error

**Symptoms:**
- Console shows hydration mismatch
- UI flickers or shows incorrect content

**Solutions:**
1. Ensure server and client render same content
2. Don't use `Date.now()` or random values in render
3. Use `useEffect` for client-only code:
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

### Issue: Infinite re-renders

**Symptoms:**
- Browser becomes unresponsive
- Console shows "Maximum update depth exceeded"

**Solutions:**
1. Check `useEffect` dependencies
2. Avoid setting state in render
3. Use `useCallback` for functions:
```typescript
const handleClick = useCallback(() => {
  // handler code
}, [dependencies]);
```

### Issue: Authentication state not persisting

**Symptoms:**
- User logged out on page refresh
- Auth state resets

**Solutions:**
1. Check Firebase persistence is enabled
2. Verify `onAuthStateChanged` listener is set up
3. Don't clear localStorage/cookies

---

## Performance Issues

### Issue: Slow page loads

**Symptoms:**
- Pages take >5 seconds to load
- Poor Lighthouse scores

**Solutions:**
1. Optimize images:
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
  loading="lazy"
/>
```

2. Lazy load components:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});
```

3. Use React.memo for expensive components:
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // component code
});
```

### Issue: Large bundle size

**Symptoms:**
- Build output shows large chunks
- Slow initial page load

**Solutions:**
1. Analyze bundle:
```bash
npm install @next/bundle-analyzer
```

2. Add to `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});
```

3. Run analysis:
```bash
ANALYZE=true npm run build
```

4. Remove unused dependencies
5. Use dynamic imports for large libraries

---

## Common Error Messages

### "Cannot read property 'uid' of null"

**Cause:** Trying to access user data before authentication loads

**Solution:**
```typescript
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <Redirect to="/login" />;

// Now safe to use user.uid
```

### "Network request failed"

**Cause:** No internet connection or API endpoint unreachable

**Solution:**
1. Check internet connection
2. Verify API endpoint is correct
3. Check CORS settings
4. Implement retry logic

### "Quota exceeded"

**Cause:** Exceeded Firebase or Gemini API quotas

**Solution:**
1. Check Firebase Console > Usage
2. Check Google Cloud Console > Quotas
3. Upgrade plan if needed
4. Implement rate limiting

---

## Debug Mode

Enable debug logging:

```typescript
// In lib/firebase.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized:', app.name);
}

// In lib/gemini.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Generating prompt with:', { input, framework });
}
```

---

## Getting Help

If you can't resolve the issue:

1. **Check Documentation:**
   - README.md
   - SETUP_GUIDE.md
   - API_DOCUMENTATION.md

2. **Search Issues:**
   - GitHub Issues
   - Stack Overflow
   - Firebase Community

3. **Create Issue:**
   - Provide error message
   - Include steps to reproduce
   - Share relevant code
   - Mention environment details

4. **Contact Support:**
   - Email: support@promptiq.com
   - Include error logs
   - Describe what you've tried

---

## Preventive Measures

### Regular Maintenance
- Keep dependencies updated
- Monitor error logs
- Check API quotas
- Review security rules
- Backup database regularly

### Best Practices
- Use TypeScript strictly
- Write tests for critical flows
- Implement error boundaries
- Log errors properly
- Monitor performance

---

**Last Updated:** January 2025

**Need more help?** Email support@promptiq.com
