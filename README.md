# CreatorAI 🚀
### AI Co-Pilot for Content Creators

A full-stack AI-powered SaaS platform for content creators — built with **Next.js 15**, **Groq API** (llama-3.3-70b), **MongoDB**, and **NextAuth.js**.

Generate viral content ideas, hooks, scripts, captions, content calendars, SEO titles, and trend insights for YouTube, Instagram, TikTok, LinkedIn, and Twitter/X.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💡 **Idea Generator** | Viral content ideas with hooks & hashtags |
| 🎣 **Hook Writer** | Scroll-stopping openers with viral strength score |
| 📝 **Script Writer** | Full video scripts with hook, body & CTA |
| 🔥 **Trend Analyzer** | Trending hashtags & keywords by platform |
| 📅 **Content Calendar** | AI-generated weekly posting schedule |
| 🎯 **SEO Titles** | A/B-tested, high-CTR title suggestions |
| ♻️ **Repurpose** | Convert content across platforms |
| 📚 **Saved Library** | Save, organize, and export your content |
| 🔐 **Auth** | Email/password + Google OAuth |
| 💳 **Billing** | Free / Pro / Enterprise plans (Stripe-ready) |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **AI**: [Groq API](https://console.groq.com) — `llama-3.3-70b-versatile` (blazing fast inference)
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js (JWT + Google OAuth)
- **Styling**: Custom CSS variables, DM Sans + Syne fonts
- **Payments**: Stripe (plug-in ready)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/creatorai.git
cd creatorai
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here        # openssl rand -base64 32
MONGODB_URI=mongodb+srv://...                   # MongoDB Atlas connection string
GROQ_API_KEY=gsk_...                           # Get from console.groq.com

# Optional (Google OAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Optional (Stripe)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Create an API key
4. Add it as `GROQ_API_KEY` in `.env.local`

Groq provides **free tier** with generous rate limits using Meta's Llama models.

### 4. Set Up MongoDB

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Get the connection string
4. Add it as `MONGODB_URI` in `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── dashboard/                  # Main dashboard
│   ├── ideas/                      # Idea generator
│   ├── hooks/                      # Hook writer
│   ├── scripts/                    # Script writer
│   ├── trends/                     # Trend analyzer
│   ├── calendar/                   # Content calendar
│   ├── saved/                      # Saved library
│   ├── settings/                   # User settings
│   ├── billing/                    # Plans & billing
│   ├── login/                      # Login page
│   ├── signup/                     # Signup page
│   └── api/
│       ├── auth/                   # NextAuth + signup
│       ├── generate/               # AI generation routes
│       │   ├── ideas/              # POST /api/generate/ideas
│       │   ├── hooks/              # POST /api/generate/hooks
│       │   ├── scripts/            # POST /api/generate/scripts
│       │   ├── titles/             # POST /api/generate/titles
│       │   ├── captions/           # POST /api/generate/captions
│       │   ├── calendar/           # POST /api/generate/calendar
│       │   └── repurpose/          # POST /api/generate/repurpose
│       ├── saved/                  # CRUD saved content
│       └── user/                   # User profile
├── components/
│   ├── landing/                    # Landing page sections
│   └── dashboard/                  # Dashboard UI components
├── lib/
│   ├── groq.ts                     # Groq AI service (all generation functions)
│   ├── db.ts                       # MongoDB connection
│   └── auth.ts                     # NextAuth config
├── models/
│   ├── User.ts                     # User schema
│   ├── Content.ts                  # SavedContent + GeneratedContent schemas
│   └── Subscription.ts             # Subscription schema
├── types/
│   └── index.ts                    # All TypeScript types
├── utils/
│   └── index.ts                    # Utility functions
└── styles/
    └── globals.css                 # Global styles + design tokens
```

---

## 🤖 Groq AI Models Used

| Model | Use Case | Speed |
|---|---|---|
| `llama-3.3-70b-versatile` | Ideas, hooks, scripts, calendar | Fast |
| `llama-3.1-8b-instant` | Titles, captions, quick tasks | Ultra-fast |

---

## 💳 AI Credit System

| Action | Credits Used |
|---|---|
| Generate Ideas | 2 credits |
| Generate Hooks | 1 credit |
| Write Script | 5 credits |
| SEO Titles | 1 credit |
| Caption | 1 credit |
| Content Calendar | 3 credits |
| Repurpose | 3 credits |

**Free plan**: 50 credits/month  
**Pro plan**: 1,000 credits/month  
**Enterprise**: Unlimited

---

## 🔐 Authentication

- **Email/Password**: bcrypt hashed, JWT session
- **Google OAuth**: One-click sign in
- **Protected Routes**: Middleware-based route protection
- **Session**: 30-day JWT with auto-refresh

### Setting Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:3000/api/auth/callback/google` as redirect URI
5. Add Client ID and Secret to `.env.local`

---

## 💰 Stripe Integration (Optional)

To enable payments:

1. Create a [Stripe](https://stripe.com) account
2. Get your API keys
3. Add to `.env.local`
4. Create products/prices in Stripe dashboard
5. Add price IDs to billing page

---

## 🚀 Deployment (Vercel)

```bash
npm run build   # Test production build

# Deploy to Vercel
npx vercel --prod
```

Add all environment variables in Vercel dashboard:  
Settings → Environment Variables

**Important**: Set `NEXTAUTH_URL` to your production URL.

---

## 📝 API Reference

### Generate Ideas
```
POST /api/generate/ideas
Body: { niche, platform, audience, tone, contentType, count }
Returns: { ideas: ContentIdea[], creditsUsed: number }
```

### Generate Hooks
```
POST /api/generate/hooks
Body: { topic, platform, style, emotion, count }
Returns: { hooks: ViralHook[], creditsUsed: number }
```

### Generate Script
```
POST /api/generate/scripts
Body: { topic, type, niche, audience, platform, includeSections }
Returns: { script: GeneratedScript, creditsUsed: number }
```

### Saved Content
```
GET  /api/saved?type=idea&page=1     # List saved content
POST /api/saved                       # Save new content
DELETE /api/saved/:id                 # Delete saved item
PATCH /api/saved/:id                  # Update (favorite, edit)
```

---

## 🎨 Customization

### Colors
Edit CSS variables in `src/styles/globals.css`:
```css
--accent-purple: #7c5cfc;   /* Primary brand color */
--accent-pink: #f472b6;     /* Secondary accent */
--accent-teal: #2dd4bf;     /* Success / TikTok */
```

### Adding New AI Tools
1. Add generator function in `src/lib/groq.ts`
2. Create API route in `src/app/api/generate/[tool]/route.ts`
3. Build client component in `src/components/dashboard/`
4. Add page in `src/app/[tool]/page.tsx`

---

## 🐛 Troubleshooting

**"Check your GROQ_API_KEY" error**
→ Ensure `GROQ_API_KEY=gsk_...` is in `.env.local`

**MongoDB connection error**
→ Check your IP is whitelisted in MongoDB Atlas Network Access

**Google OAuth not working**
→ Ensure redirect URI exactly matches in Google Cloud Console

**Build errors**
→ Run `npm install` then `npm run build` to see TypeScript errors

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

Built with ❤️ using Next.js 15 + Groq AI
