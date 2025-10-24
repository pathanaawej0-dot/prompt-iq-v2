# 🚀 PromptIQ v2 - Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment Checklist

### 1. Environment Variables ✅
- [ ] All Firebase credentials are production values
- [ ] `GEMINI_API_KEY` is valid and has sufficient quota
- [ ] PhonePe credentials are production (not sandbox)
- [ ] `PHONEPE_MODE` is set to `PRODUCTION`
- [ ] `NEXT_PUBLIC_URL` points to production domain
- [ ] All environment variables are set in Vercel/hosting platform

### 2. Firebase Configuration ✅
- [ ] Production Firebase project is created
- [ ] Email/Password authentication is enabled
- [ ] Firestore database is created
- [ ] Firestore security rules are deployed
- [ ] Production domain is added to authorized domains
- [ ] Firebase quotas are sufficient for expected traffic

### 3. Code Quality ✅
- [ ] All TypeScript errors are resolved (`npm run type-check`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in browser
- [ ] All TODO comments are addressed or documented

### 4. Functionality Testing ✅

#### Authentication
- [ ] Signup creates user in Firebase
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Password reset email is sent
- [ ] Logout works correctly
- [ ] Protected routes redirect to login

#### Dashboard
- [ ] Quick Mode generates prompts
- [ ] Pro Mode chat interface works
- [ ] Framework selector works
- [ ] Quality scoring displays correctly
- [ ] Usage stats are accurate
- [ ] Generation limits are enforced

#### History
- [ ] Prompts are saved to database
- [ ] History page displays all prompts
- [ ] Search functionality works
- [ ] Filter by framework works
- [ ] View prompt details works
- [ ] Copy prompt works
- [ ] Delete prompt works

#### Upgrade/Payment
- [ ] Pricing page displays correctly
- [ ] Payment flow initiates
- [ ] PhonePe redirect works
- [ ] Payment success updates plan
- [ ] Payment failure handles gracefully
- [ ] Webhook processes correctly

#### Settings
- [ ] Profile update works
- [ ] Email is displayed (read-only)
- [ ] Payment history shows (if applicable)
- [ ] Sign out works

### 5. UI/UX Testing ✅

#### Responsive Design
- [ ] Mobile (320px - 767px) looks good
- [ ] Tablet (768px - 1023px) looks good
- [ ] Desktop (1024px+) looks good
- [ ] Navigation works on all sizes
- [ ] Forms are usable on mobile

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient
- [ ] Alt text on images
- [ ] ARIA labels where needed

#### Performance
- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] Loading states are shown
- [ ] Error states are handled

### 6. Security ✅
- [ ] No sensitive data in client-side code
- [ ] API routes validate authentication
- [ ] Firestore rules are restrictive
- [ ] Input validation on all forms
- [ ] XSS protection in place
- [ ] CSRF protection (Next.js default)
- [ ] Rate limiting considered

### 7. SEO & Meta Tags ✅
- [ ] Page titles are descriptive
- [ ] Meta descriptions are set
- [ ] Open Graph tags for social sharing
- [ ] Favicon is set
- [ ] robots.txt is configured
- [ ] sitemap.xml is generated

### 8. Monitoring & Analytics ✅
- [ ] Error tracking set up (optional)
- [ ] Analytics configured (optional)
- [ ] Performance monitoring (optional)
- [ ] Uptime monitoring (optional)

### 9. Documentation ✅
- [ ] README.md is complete
- [ ] SETUP_GUIDE.md is accurate
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Known issues documented

### 10. Legal & Compliance ✅
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Cookie policy (if applicable)
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy

## Deployment Steps

### Step 1: Final Testing
```bash
# Run all checks
npm run type-check
npm run lint
npm run build

# Test production build locally
npm run start
```

### Step 2: Commit and Push
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 3: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Import project from GitHub
3. Configure environment variables
4. Deploy

### Step 4: Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test signup flow
- [ ] Test prompt generation
- [ ] Test payment flow (with real payment)
- [ ] Check all pages load
- [ ] Verify no console errors
- [ ] Test on mobile device

### Step 5: DNS & Domain
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] WWW redirect configured

### Step 6: External Services
- [ ] Update Firebase authorized domains
- [ ] Update PhonePe redirect URLs
- [ ] Update PhonePe webhook URL
- [ ] Test webhook with real payment

## Post-Deployment

### Immediate Actions
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Test critical flows
- [ ] Verify email delivery
- [ ] Check payment processing

### Within 24 Hours
- [ ] Review user feedback
- [ ] Check performance metrics
- [ ] Monitor server costs
- [ ] Verify all integrations
- [ ] Update status page

### Within 1 Week
- [ ] Analyze user behavior
- [ ] Identify bottlenecks
- [ ] Plan improvements
- [ ] Address bug reports
- [ ] Optimize performance

## Rollback Plan

If issues occur:

1. **Immediate Rollback**
   ```bash
   # In Vercel, revert to previous deployment
   # Or redeploy from previous commit
   git revert HEAD
   git push origin main
   ```

2. **Database Rollback**
   - Firestore has automatic backups
   - Restore from backup if needed

3. **Communication**
   - Notify users of issues
   - Provide status updates
   - Set expectations for fix

## Emergency Contacts

- **Firebase Support:** [Firebase Console](https://console.firebase.google.com)
- **Vercel Support:** [Vercel Support](https://vercel.com/support)
- **PhonePe Support:** [PhonePe Business](https://business.phonepe.com)
- **Gemini API:** [Google Cloud Support](https://cloud.google.com/support)

## Success Criteria

Deployment is successful when:
- ✅ All features work as expected
- ✅ No critical errors in logs
- ✅ Performance meets targets
- ✅ Users can complete core flows
- ✅ Payments process correctly
- ✅ No security vulnerabilities

---

**Last Updated:** [Date]
**Deployed By:** [Name]
**Deployment Version:** [Version]

---

## Notes

Add any deployment-specific notes here:
- 
- 
- 

---

**Ready to deploy? Let's make it legendary! 🚀**
