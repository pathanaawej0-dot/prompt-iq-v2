# Quick Environment Setup for Share Links

## Add These to Your `.env.local` File

Based on your `serviceAccountKey.json`, add these exact values:

```env
# Firebase Admin SDK (Server-side)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@prompt-iq-d8bc0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRSoEPx8UWRznG\nMLeuljYy4ieS1XJfq0iHSns13UeITk/xJtEF7OSvRJJEkK7qp7xZySC2f9o8xCot\ns7T7WT2wV3VBgcLJmPxejKUpAarMKq/mhVzrzuPZvEcs7gQ0Cg7r0K4A+bSciP99\nePDoZgYoYJzR/otrqRocvI4T48yj2Nq+PYiMsmRRJ0lEhFQTjmnhrY6CEAMJZLUw\nJFsPttahyKGFUpFPIIQ5nmXF2S7pJseoyOYcRL7BV+Jp3qn0RLKBsrkHgqMGbV4D\npO8Y6m5p5iHigpYg2nQ7Y2OVxEtpFrHcj/dlxSn72TRvLN60cU8frFC+7UF426SW\nUKJx2VcpAgMBAAECggEAISYapLFgpdjYguvIHrwbpS830w8Wrft29zgUpXaWXrWp\n/h6b9cMh13bWGfZhQLkaNo202OMNjG605Yc0pP5ArJO1oToDFvjcZBdaY3vS8xfX\nGNJ1DMO4nWMvp3ii1svkYB+t0mllMh6Vej3zyO4ROfJPdF1Ln4eUTgqOuwIWMWRy\nb9q9CVBGar3KK9EOm73ZjxzuaiowzL/nK8SjKjqs9VTRMsmgf3JzPMFhCnLpGeUS\n/+VXiXLxFt6i6YXaxKQBOGm+WLrZERGmrG3N0YnY2ug6dHErl1h7tK6bdLMUVO0m\nUoieRVQoOg2W9ngWrX9gSuBgyOBTOLCTFyyDCyiCPwKBgQD7uhEvZBx17G0WOU1n\nLAXYz7zBNfDeknvIHFRq1cZwKOxdb8EoGN7NCfWWmMzmC22F9gJoQuvoaC7iiDcD\nNvb1PvZKPpxD4uwmCu6xOSd2zI3LgfrfaG+hkvULaFXb5KWusjmZNNIj25aZM0WQ\nkqhkJTF5mliPGMxTAWmG6Gh2jwKBgQDU2AXvZYbsLXQqFaljv9YSwAZPnYRxtnfX\ntywwlx4bgaRD3SLw4/FsKo9EpbXGntagyPebw/xcSlhFO3w65iiQaxBqCbQtIjJG\nx4LLPSM8SgEs9NnWukovXS6xAxwcmAxst0wAkNWe7/i5waNqBvNncYRbKrgVvm1p\nRaGRB07yxwKBgQDu2hG+XwamWiz0HnE0iVAO9qaKyk0AVAwBx+fN64Q8HoiQ7B5i\nlp6p/V47hEc/rO5CYzjLh1xjDKAYMNnKQhg4goKd1iTeQW6DdnIgVTP+BIAy7uWF\noInzzQaYyWpWmPEg/1mp5rXScmTGfyDt2krPo377fJm1RflydW+VI+cjPwKBgHn/\n3N8MxdqIb0ZUJkTLx+v1b2ihNDJt0aGvF8A+Tn6bv8k6bvW+4joK5xYFGf1gPEvr\nBaqeGv/XiWMdpqaoGGY3SDBPoZwhNspFP545TAIZtTTMoDSpkS427jV+P9XP/Ycv\nRXwpiJjSmjH3YTC8DTak5aXQBbZI8bPeuq5DjygvAoGAERWlDA8wFb5RI8oxc7pf\n7sVg7Lf59Z0HeieonUqu3kHlwH44MGI6fhJlPHQsjfMdnYO0konaQdGZGwV9Cl/y\nSFBCYlRlHKo5vuPtqIZZ+0VymXiFTYAGKB0/QwDwvtEYlK5dyjCt880tN5h4WqNq\nq5qcSrLubuOXkLplQpEJVeA=\n-----END PRIVATE KEY-----\n"

# Application URL (update for production)
NEXT_PUBLIC_URL=http://localhost:3000
```

## Steps to Apply

1. **Open or create `.env.local`** in the project root
2. **Copy the above environment variables** and paste them into `.env.local`
3. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```
4. **Test the share functionality**:
   - Generate a prompt
   - Click the "Share" button
   - The link should be copied to clipboard
   - Open the link to verify it works

## Important Notes

⚠️ **Security Warning**: The private key is sensitive. Never commit `.env.local` to git (it's already in `.gitignore`).

✅ **For Production**: Update `NEXT_PUBLIC_URL` to your actual domain (e.g., `https://promptiq.com`)

## Verification

After restarting, you should see in the console:
```
✅ Firebase Admin SDK initialized successfully
```

If you see this, the share links should work without permission errors!
