# NEXTOKEN CAPITAL — COMPLETE DEPLOYMENT GUIDE
# From zero to live production in under 2 hours

==================================================
## WHAT YOU HAVE
==================================================

nextoken/
├── pages/
│   ├── _app.js                  ← App wrapper with Auth
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.js      ← POST /api/auth/register
│   │   │   ├── login.js         ← POST /api/auth/login
│   │   │   ├── me.js            ← GET  /api/auth/me
│   │   │   └── logout.js        ← POST /api/auth/logout
│   │   ├── bonds/
│   │   │   └── index.js         ← GET/POST /api/bonds
│   │   ├── orders/
│   │   │   └── index.js         ← GET/POST /api/orders
│   │   ├── assets/
│   │   │   └── index.js         ← GET/POST /api/assets
│   │   ├── equity/
│   │   │   └── index.js         ← GET/POST /api/equity
│   │   ├── kyc/
│   │   │   └── index.js         ← GET/POST /api/kyc
│   │   └── users/
│   │       └── portfolio.js     ← GET /api/users/portfolio
├── components/
│   ├── Navbar.js                ← Top navigation
│   ├── AuthModal.js             ← Login/Register modal
│   └── Toast.js                 ← Notifications
├── lib/
│   ├── supabase.js              ← Database client
│   ├── auth.js                  ← JWT + password utils
│   ├── api.js                   ← API helpers
│   └── AuthContext.js           ← React auth state
├── styles/
│   └── globals.css              ← Global styles + Tailwind
├── supabase/
│   └── schema.sql               ← Full database schema + seed data
├── .env.example                 ← Environment variables template
├── next.config.js
├── tailwind.config.js
└── package.json

==================================================
## STEP 1 — SUPABASE SETUP (10 minutes)
==================================================

1. Go to supabase.com → Sign up free
2. Click "New Project"
   - Name: nextoken-capital
   - Password: (save this — you'll need it)
   - Region: EU (Frankfurt or Stockholm — closest to Lithuania)
3. Wait ~2 minutes for project to initialize
4. Go to SQL Editor (left sidebar)
5. Open the file: supabase/schema.sql
6. Paste the entire contents → Click "Run"
   ✅ This creates all tables and seeds sample data
7. Go to Settings → API
   - Copy: Project URL → this is your SUPABASE_URL
   - Copy: anon/public key → SUPABASE_ANON_KEY
   - Copy: service_role key → SUPABASE_SERVICE_ROLE_KEY
   ⚠️ Keep service_role key SECRET — never expose it client-side


==================================================
## STEP 2 — LOCAL SETUP (5 minutes)
==================================================

Requirements:
- Node.js 18+ (download at nodejs.org)
- npm (comes with Node.js)

Commands to run in Terminal:

  # Clone or create the project folder
  cd nextoken

  # Install all dependencies
  npm install

  # Copy env template
  cp .env.example .env.local

  # Edit .env.local with your Supabase keys:
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  JWT_SECRET=make-this-at-least-32-random-characters-long

  # Start development server
  npm run dev

  # Open in browser
  http://localhost:3000


==================================================
## STEP 3 — DEPLOY TO VERCEL (10 minutes)
==================================================

Option A — GitHub (Recommended)
--------------------------------
1. Create GitHub account at github.com
2. Create new repository: "nextoken-capital"
3. Upload your project files to the repo
4. Go to vercel.com → Sign up with GitHub
5. Click "New Project" → Import your GitHub repo
6. Add environment variables (same as .env.local):
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   JWT_SECRET
7. Click Deploy
✅ Live at: nextoken-capital.vercel.app

Option B — Vercel CLI
----------------------
  npm install -g vercel
  vercel login
  vercel
  # Follow prompts
  # Add env vars when asked


==================================================
## STEP 4 — CUSTOM DOMAIN (10 minutes)
==================================================

1. Buy nextokencapital.com at namecheap.com (~€12/year)
2. In Vercel → Your Project → Settings → Domains
3. Add: nextokencapital.com
4. Vercel shows you DNS records to add
5. In Namecheap → Domain → DNS → Add the records
6. Wait 5–15 minutes for DNS to propagate
✅ Live at: nextokencapital.com


==================================================
## STEP 5 — WHAT WORKS RIGHT NOW
==================================================

✅ User registration with email + password
✅ Secure login with JWT (7-day sessions)
✅ HttpOnly cookies (secure, XSS-proof)
✅ Real database (Supabase PostgreSQL)
✅ All user data persisted
✅ KYC submission stored in database
✅ Bond offerings fetched from real database
✅ Asset listings from real database
✅ Order placement with fee calculation
✅ Portfolio tracking
✅ Transaction history
✅ Full REST API (7 endpoints)
✅ Row-level security on all tables
✅ Password hashing with bcrypt


==================================================
## STEP 6 — NEXT FEATURES TO BUILD (Phase 2)
==================================================

After deploying, hire 1 Nepal developer (€800/month) to add:

Week 1-2: Real-time exchange
  - WebSocket order book (Supabase Realtime)
  - Order matching engine
  - Live price updates

Week 3-4: Payments
  - SEPA bank deposit (Paysera API)
  - EUR wallet top-up
  - Withdrawal to bank account

Week 5-6: KYC
  - Sumsub integration (real ID verification)
  - Document upload to Supabase Storage
  - Admin approval workflow

Week 7-8: Smart Contracts
  - ERC-3643 token on Polygon testnet
  - Token issuance on asset approval
  - On-chain ownership transfer

Month 3: Admin Dashboard
  - Manage users, approve KYC
  - Review bond/asset applications
  - Platform analytics


==================================================
## COSTS BREAKDOWN
==================================================

Infrastructure (monthly):
  Supabase Free tier:     €0/month (up to 500MB)
  Supabase Pro:           €25/month (when you grow)
  Vercel Free tier:       €0/month
  Vercel Pro:             €20/month (custom domain + more)
  Domain (annual):        €12/year
  ─────────────────────────────────────────────
  Total to start:         €0/month (€12 upfront)
  Total at scale:         €45/month

Developer (when ready):
  Nepal full-stack dev:   €800/month
  Nepal blockchain dev:   €600/month
  ─────────────────────────────────────────────
  Phase 2 total:          €1,400/month


==================================================
## API ENDPOINTS REFERENCE
==================================================

POST /api/auth/register    → Create new account
POST /api/auth/login       → Login, get cookie
GET  /api/auth/me          → Get current user
POST /api/auth/logout      → Clear session

GET  /api/assets           → List all tokenized assets
POST /api/assets           → Submit new asset (auth required)

GET  /api/bonds            → List all bonds
POST /api/bonds            → Issue new bond (auth required)

GET  /api/equity           → List equity offerings
POST /api/equity           → Submit IPO application (auth required)

GET  /api/orders           → Get my orders (auth required)
POST /api/orders           → Place buy/sell order (auth required)

GET  /api/kyc              → Get my KYC status (auth required)
POST /api/kyc              → Submit KYC documents (auth required)

GET  /api/users/portfolio  → Get portfolio + investments (auth required)


==================================================
## SUPPORT
==================================================

hello@nextokencapital.com
Nextoken Capital UAB
Vilnius, Lithuania

Built with: Next.js 14 · Supabase · Vercel · Tailwind CSS
