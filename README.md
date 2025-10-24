# 🚀 PromptIQ v2 - Transform Ideas Into Legendary Prompts

**The #1 AI-Powered Prompt Engineering Platform for Creators, Founders & Professionals**

PromptIQ is a revolutionary SaaS application that transforms simple ideas into detailed, professional, immediately actionable AI prompts using advanced AI technology.

## ✨ Features

### 🎯 Core Features
- **Lightning Fast Generation** - Transform ideas into detailed prompts in seconds
- **Professional Frameworks** - Chain of Thought, RICE, STAR, Creative Brief, Socratic, and Custom
- **Hybrid Interface** - Quick Mode for instant results, Pro Mode for iterative refinement
- **Quality Scoring** - AI-powered analysis with instant improvement suggestions
- **Version History** - Track every iteration and restore previous versions
- **Export Options** - Copy, PDF, Share Links (coming soon)

### 💎 Premium Features
- **Pro Mode** - Chat-based iterative refinement for complex prompts
- **Unlimited History** - Save and access all your generated prompts
- **Priority Support** - Get help when you need it
- **Higher Limits** - Generate more prompts per month

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes (Serverless)
- **Authentication:** Firebase Authentication
- **Database:** Firestore
- **AI:** Google Gemini 2.5 Flash
- **Payments:** PhonePe Payment Gateway
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd promptiq-v2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `env.template` to `.env.local` and fill in your credentials:

```bash
cp env.template .env.local
```

Required environment variables:
- Firebase credentials (API key, Auth domain, Project ID, etc.)
- Gemini API key
- PhonePe merchant credentials
- Application URL

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

### Gemini API Setup
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `.env.local` as `GEMINI_API_KEY`

### PhonePe Setup
1. Register for PhonePe merchant account
2. Get your Merchant ID and Salt Key
3. Add credentials to `.env.local`
4. Set `PHONEPE_MODE` to `SANDBOX` for testing

## 📁 Project Structure

```
promptiq-v2/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── upgrade/
│   │   └── settings/
│   ├── api/                 # API routes
│   │   ├── generate/
│   │   ├── prompts/
│   │   └── payment/
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── landing/             # Landing page sections
│   ├── dashboard/           # Dashboard components
│   └── shared/              # Shared components
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   ├── gemini.ts            # Gemini AI integration
│   ├── phonepe.ts           # Payment integration
│   ├── utils.ts
│   └── constants.ts
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
└── public/                  # Static assets
```

## 🎨 Key Pages

### Landing Page (`/`)
- Hero section with animated background
- Features showcase
- Testimonials
- Pricing comparison
- Final CTA

### Dashboard (`/dashboard`)
- Quick Mode: Form-based prompt generation
- Pro Mode: Chat-based iterative refinement
- Usage statistics
- Quality scoring with breakdown

### History (`/history`)
- List all generated prompts
- Search and filter functionality
- View, copy, and delete prompts

### Upgrade (`/upgrade`)
- Plan comparison
- Payment integration
- Current plan status

### Settings (`/settings`)
- Profile management
- Billing history
- Account preferences

## 🔐 Authentication Flow

1. User signs up with email/password
2. Firebase creates authentication account
3. User document created in Firestore
4. User redirected to dashboard
5. Protected routes check authentication status

## 💳 Payment Flow

1. User selects plan on upgrade page
2. API creates PhonePe payment order
3. User redirected to PhonePe payment page
4. Payment processed
5. Webhook updates user plan in Firestore
6. User redirected back with success/failure status

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Environment Variables for Production
- Update `NEXT_PUBLIC_URL` to your production domain
- Set `PHONEPE_MODE` to `PRODUCTION`
- Ensure all Firebase and Gemini credentials are production-ready

## 📊 Pricing Plans

### ⚡ Spark (Free)
- 30 prompts/month
- Quick Mode only
- Basic frameworks
- Standard quality

### 🏗️ Architect (₹299/month)
- 500 prompts/month
- Quick + Pro Mode
- All frameworks
- Priority quality
- Version history
- Export to PDF
- Email support

### 🎨 Studio (₹999/month)
- 2,500 prompts/month
- Everything in Architect
- Unlimited version history
- Team collaboration (coming soon)
- Priority support
- Custom frameworks
- API access (coming soon)

## 🧪 Testing

Before deploying, test:
- ✅ Signup/Login flow
- ✅ Prompt generation (Quick & Pro modes)
- ✅ Quality scoring
- ✅ History page
- ✅ Payment flow (sandbox mode)
- ✅ Responsive design
- ✅ Error handling

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all Firebase credentials in `.env.local`
- Check Firebase project settings
- Ensure Firestore rules are configured

### Gemini API Errors
- Verify API key is valid
- Check API quota limits
- Ensure proper error handling

### Payment Integration Issues
- Verify PhonePe credentials
- Check webhook URL is accessible
- Test in sandbox mode first

## 📝 License

© 2025 PromptIQ. All rights reserved.

## 🤝 Support

For support, email support@promptiq.com or visit our documentation.

---

**Built with ❤️ using Next.js, Firebase, and Gemini AI**
# Fixed
# Force rebuild Fri Oct 24 08:18:32 PM IST 2025
