# Share Link Fix - PERMISSION_DENIED Error

## Problem
The share link generation was failing with "7 PERMISSION_DENIED" error because:
1. API routes were using the **client-side Firebase SDK** instead of **Firebase Admin SDK**
2. Client SDK respects Firestore security rules which block server-side writes
3. The share URL might not have been generated correctly

## Solution Applied

### 1. Updated API Routes to Use Firebase Admin SDK

**Files Modified:**
- `/app/api/share/create/route.ts` - Share link creation
- `/app/api/share/[code]/route.ts` - Share link retrieval

**Changes:**
- Replaced `firebase/firestore` imports with `firebase-admin/firestore`
- Changed from `db` (client) to `getAdminDb()` (admin)
- Updated methods:
  - `addDoc()` → `collection().add()`
  - `getDocs()` → `.get()`
  - `getDoc()` → `.doc().get()`
  - `updateDoc()` → `.update()`
  - `serverTimestamp()` → `FieldValue.serverTimestamp()`
  - `increment()` → `FieldValue.increment()`

### 2. Environment Variables Required

Add these to your `.env.local` file:

```env
# Firebase Admin SDK (for server-side operations)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@prompt-iq-d8bc0.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Application URL (for share link generation)
NEXT_PUBLIC_URL=http://localhost:3000  # or your production URL
```

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` should be the full private key from `serviceAccountKey.json`
- Make sure to wrap it in quotes and keep the `\n` characters
- For production, use your actual domain (e.g., `https://promptiq.com`)

### 3. How Share Links Work Now

1. **Create Share Link** (`POST /api/share/create`):
   - Takes `promptId` and `userId`
   - Generates a 6-character code
   - Stores in `shared_links` collection using Admin SDK
   - Returns URL: `${NEXT_PUBLIC_URL}/p/{code}`

2. **Access Share Link** (`GET /api/share/[code]`):
   - Fetches link by code
   - Checks if expired (7 days)
   - Retrieves prompt data
   - Increments view count
   - Returns prompt data

3. **View Shared Prompt** (`/p/[code]`):
   - Client-side page that fetches from API
   - Displays the shared prompt
   - Shows "Link Not Found" if invalid/expired

## Testing

1. Ensure environment variables are set correctly
2. Restart your development server: `npm run dev`
3. Try creating a share link from the dashboard
4. The link should be copied to clipboard
5. Open the link in a new tab to verify it works

## Troubleshooting

If you still see errors:

1. **Check Firebase Admin SDK initialization:**
   ```bash
   # Look for this in console when server starts:
   ✅ Firebase Admin SDK initialized successfully
   ```

2. **Verify environment variables:**
   - `FIREBASE_CLIENT_EMAIL` matches serviceAccountKey.json
   - `FIREBASE_PRIVATE_KEY` includes the full key with newlines
   - `NEXT_PUBLIC_URL` is correct for your environment

3. **Check Firestore collections:**
   - Ensure `shared_links` collection exists (it will be created automatically)
   - Verify `prompts` collection has the prompt you're trying to share

4. **Browser Console:**
   - Check for any network errors
   - Verify the share URL format is correct

## Security Notes

- Firebase Admin SDK bypasses Firestore security rules (runs with admin privileges)
- Only use Admin SDK in API routes (server-side), never in client components
- The service account key should never be exposed to the client
- Keep `serviceAccountKey.json` in `.gitignore`
