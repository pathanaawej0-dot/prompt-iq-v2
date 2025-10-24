# 📚 PromptIQ v2 - API Documentation

Complete API reference for PromptIQ v2 backend routes.

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-domain.com/api`

## Authentication

All protected routes require Firebase Authentication. Include the user's Firebase ID token in requests.

```javascript
// Get current user token
const token = await auth.currentUser.getIdToken();

// Include in requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## Prompt Generation API

### Generate Prompt

Generate a new prompt or refine an existing one.

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "input": "string (required) - User's idea or refinement request",
  "framework": "string (required) - Framework to use",
  "userId": "string (required) - Firebase user ID",
  "mode": "string (optional) - 'generate' or 'refine'",
  "originalPrompt": "string (optional) - Required if mode is 'refine'",
  "parentId": "string (optional) - Parent prompt ID for versioning"
}
```

**Framework Options:**
- `chain-of-thought`
- `rice`
- `creative-brief`
- `star`
- `socratic`
- `custom`

**Response:**
```json
{
  "success": true,
  "output": "string - Generated prompt",
  "qualityScore": {
    "structure": 2.5,
    "clarity": 2.5,
    "examples": 2.5,
    "specificity": 2.5,
    "total": 10,
    "suggestions": ["string array"]
  },
  "promptId": "string - Saved prompt ID"
}
```

**Error Response:**
```json
{
  "error": "string - Error message"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `403` - Generation limit reached
- `500` - Server error

**Example:**
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    input: 'Design a mobile app for meal planning',
    framework: 'chain-of-thought',
    userId: 'user123',
    mode: 'generate'
  })
});

const data = await response.json();
console.log(data.output);
```

---

## Prompts Management API

### Save Prompt

Save a generated prompt to the database.

**Endpoint:** `POST /api/prompts/save`

**Request Body:**
```json
{
  "userId": "string (required)",
  "inputText": "string (required)",
  "outputText": "string (required)",
  "framework": "string (required)",
  "qualityScore": "number (optional)",
  "version": "number (optional)",
  "parentId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "promptId": "string"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `500` - Server error

---

### List Prompts

Get all prompts for a user.

**Endpoint:** `GET /api/prompts/list`

**Query Parameters:**
- `userId` (required) - Firebase user ID
- `limit` (optional) - Number of prompts to return (default: 20)

**Response:**
```json
{
  "success": true,
  "prompts": [
    {
      "id": "string",
      "user_id": "string",
      "input_text": "string",
      "output_text": "string",
      "framework": "string",
      "quality_score": 8.5,
      "version": 1,
      "parent_id": null,
      "tokens_used": 500,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing userId
- `500` - Server error

**Example:**
```javascript
const response = await fetch('/api/prompts/list?userId=user123&limit=10');
const data = await response.json();
console.log(data.prompts);
```

---

### Delete Prompt

Delete a prompt by ID.

**Endpoint:** `DELETE /api/prompts/delete`

**Request Body:**
```json
{
  "promptId": "string (required)",
  "userId": "string (required)"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields
- `403` - Unauthorized (not prompt owner)
- `404` - Prompt not found
- `500` - Server error

---

## Payment API

### Create Payment Order

Create a PhonePe payment order.

**Endpoint:** `POST /api/payment/create-order`

**Request Body:**
```json
{
  "plan": "string (required) - 'architect' or 'studio'",
  "userId": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "string - PhonePe payment page URL",
  "orderId": "string - Order ID for tracking"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid plan or missing fields
- `500` - Server error

**Example:**
```javascript
const response = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    plan: 'architect',
    userId: 'user123'
  })
});

const data = await response.json();
if (data.success) {
  window.location.href = data.paymentUrl;
}
```

---

### Verify Payment

Verify payment status after redirect from PhonePe.

**Endpoint:** `POST /api/payment/verify`

**Request Body:** Form data from PhonePe redirect
- `transactionId` - PhonePe transaction ID

**Response:** Redirects to dashboard with status
- Success: `/dashboard?payment=success`
- Failure: `/dashboard?payment=failed`

**Note:** This endpoint is called automatically by PhonePe after payment.

---

### Payment Webhook

Receive payment status updates from PhonePe.

**Endpoint:** `POST /api/payment/webhook`

**Request Body:** PhonePe webhook payload (verified with signature)

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid signature
- `500` - Server error

**Note:** This endpoint is called by PhonePe servers. Ensure it's publicly accessible.

---

## Error Handling

All API routes follow consistent error handling:

### Error Response Format
```json
{
  "error": "string - Human-readable error message"
}
```

### Common Error Codes

| Status Code | Meaning |
|------------|---------|
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Insufficient permissions or quota exceeded |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

### Error Examples

**Generation Limit Reached:**
```json
{
  "error": "Generation limit reached. Please upgrade your plan."
}
```

**Invalid Framework:**
```json
{
  "error": "Invalid framework specified"
}
```

**Authentication Required:**
```json
{
  "error": "Authentication required"
}
```

---

## Rate Limiting

Currently, rate limiting is enforced through:
- User plan limits (30/500/2500 prompts per month)
- Firebase Firestore quotas
- Gemini API quotas

Future implementation may include:
- Per-minute rate limits
- IP-based throttling
- Burst protection

---

## Webhooks

### PhonePe Payment Webhook

**URL:** `https://your-domain.com/api/payment/webhook`

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `X-VERIFY: checksum###saltIndex`

**Payload:**
```json
{
  "code": "PAYMENT_SUCCESS",
  "data": {
    "merchantTransactionId": "ORDER_123456_user123",
    "amount": 29900,
    "state": "COMPLETED"
  },
  "checksum": "signature_string"
}
```

**Security:**
- Webhook signature is verified using PhonePe salt key
- Invalid signatures are rejected with 400 status

---

## Data Models

### User Document (Firestore)
```typescript
{
  uid: string;
  email: string;
  name: string;
  plan: 'spark' | 'architect' | 'studio';
  generations_used: number;
  generations_limit: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  payment_history?: Array<{
    order_id: string;
    amount: number;
    plan: string;
    date: Timestamp;
    status: string;
  }>;
}
```

### Prompt Document (Firestore)
```typescript
{
  id: string;
  user_id: string;
  input_text: string;
  output_text: string;
  framework: Framework;
  quality_score: number;
  version: number;
  parent_id: string | null;
  tokens_used: number;
  created_at: Timestamp;
}
```

---

## Testing

### Test with cURL

**Generate Prompt:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Design a mobile app",
    "framework": "chain-of-thought",
    "userId": "test-user-123"
  }'
```

**List Prompts:**
```bash
curl "http://localhost:3000/api/prompts/list?userId=test-user-123&limit=5"
```

### Test with JavaScript

```javascript
// Generate prompt
async function generatePrompt() {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: 'Create a marketing campaign',
      framework: 'creative-brief',
      userId: 'user123'
    })
  });
  
  const data = await response.json();
  console.log(data);
}
```

---

## Best Practices

### 1. Error Handling
Always handle errors gracefully:
```javascript
try {
  const response = await fetch('/api/generate', { /* ... */ });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error message
}
```

### 2. Loading States
Show loading indicators during API calls:
```javascript
const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);
  try {
    // API call
  } finally {
    setLoading(false);
  }
};
```

### 3. Retry Logic
Implement retry for transient failures:
```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

---

## Support

For API support:
- Email: api-support@promptiq.com
- Documentation: https://docs.promptiq.com
- Status Page: https://status.promptiq.com

---

**Last Updated:** January 2025
**API Version:** v2.0.0
