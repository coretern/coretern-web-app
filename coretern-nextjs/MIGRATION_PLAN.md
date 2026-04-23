# CoreTern Migration Plan — Next.js (App Router + TypeScript)

## Status: ✅ Phase 1, 2 & 3 Complete

---

## ✅ Phase 1: Foundation (DONE)

| Task | Status |
|------|--------|
| Project init (Next.js 16 + Tailwind v4 + TypeScript) | ✅ |
| Environment variables (`.env.local`) | ✅ |
| MongoDB connection singleton (`lib/db.ts`) | ✅ |
| Auth utilities (`lib/auth.ts`) | ✅ |
| API response helpers (`lib/apiResponse.ts`) | ✅ |
| Cloudinary upload utility (`lib/cloudinary.ts`) | ✅ |
| Email service (`lib/email.ts`) | ✅ |
| QR code generator (`lib/qrGenerator.ts`) | ✅ |
| All Mongoose models migrated (User, Internship, Enrollment, Certificate, Ticket) | ✅ |
| Global CSS design system (`globals.css`) | ✅ |
| Theme context (dark/light mode) | ✅ |
| Root layout with fonts, SEO metadata | ✅ |
| Centralized API client (`lib/api.ts`) | ✅ |
| Type declarations (`types/global.d.ts`) | ✅ |
| TypeScript config (`tsconfig.json`) | ✅ |

## ✅ Phase 2: API Routes + Pages (DONE)

### API Routes (30 endpoints migrated)

| Group | Endpoints | Status |
|-------|-----------|--------|
| Auth | register, login, verify-otp, resend-otp, google, me, forgot-password, reset-password, update-profile | ✅ |
| Internships | GET all, GET by id, POST create, PUT update, DELETE | ✅ |
| Enrollments | GET all (admin), GET my, POST enroll, GET verify payment, POST webhook, POST review, PUT pay | ✅ |
| Certificates | POST issue, POST manual, GET manual, GET verify, GET my | ✅ |
| Tickets | GET all (admin), GET my, POST create, GET by id, PUT reply, PUT status, DELETE | ✅ |
| Users | GET all (admin), POST impersonate, PUT toggle-status, DELETE | ✅ |

### Frontend Pages (17 pages migrated)

| Page | Route | Status |
|------|-------|--------|
| Landing Page | `/` | ✅ |
| Login | `/login` | ✅ |
| Register | `/register` | ✅ |
| Forgot Password | `/forgot-password` | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Internships List | `/internships` | ✅ |
| Internship Detail | `/internships/[id]` | ✅ |
| Services List | `/services` | ✅ |
| Service Detail | `/services/[id]` | ✅ |
| Contact | `/contact` | ✅ |
| Verify Certificate | `/verify` | ✅ |
| About | `/about` | ✅ |
| Terms of Service | `/terms` | ✅ |
| Privacy Policy | `/privacy` | ✅ |
| Refund Policy | `/refund-policy` | ✅ |
| 404 Not Found | `not-found.tsx` | ✅ |

### Admin Panel (7 pages migrated)

| Page | Route | Status |
|------|-------|--------|
| Admin Login | `/admin/login` | ✅ |
| Admin Dashboard | `/admin` | ✅ |
| Admin Internships (CRUD + Modal) | `/admin/internships` | ✅ |
| Admin Enrollments + Cert Issue | `/admin/enrollments` | ✅ |
| Admin Users (Toggle/Delete) | `/admin/users` | ✅ |
| Admin Certificates (Manual Issue) | `/admin/certificates` | ✅ |
| Admin Tickets (Status/Delete) | `/admin/tickets` | ✅ |

### Components (7 components migrated)

| Component | File | Status |
|-----------|------|--------|
| Navbar | `components/layout/Navbar.tsx` | ✅ |
| Footer | `components/layout/Footer.tsx` | ✅ |
| Hero | `components/landing/Hero.tsx` + CSS Module | ✅ |
| Services | `components/landing/Services.tsx` + CSS Module | ✅ |
| InternshipCard | `components/landing/InternshipCard.tsx` + CSS Module | ✅ |
| InternshipSection | `components/landing/InternshipSection.tsx` | ✅ |
| ClientReviews | `components/landing/ClientReviews.tsx` | ✅ |

---

## ✅ Phase 3: Polish & Remaining Tasks (DONE)

| Task | Status |
|------|--------|
| Static pages (Terms, Privacy, Refund Policy, About) | ✅ |
| Custom 404 Not Found page | ✅ |
| Admin: Create/Edit Internship form modal | ✅ |
| Admin: Manual certificate issuance form | ✅ |
| Null safety for all API calls (InternshipSection, Dashboard, Admin) | ✅ |
| Prose typography system for static pages | ✅ |
| Auth form CSS classes (inputs, wrappers, icons) | ✅ |
| Admin table CSS classes | ✅ |
| Badge system (primary, success, warning, danger) | ✅ |
| Button variants (sm, danger, outline) | ✅ |
| Production next.config.mjs (images, CORS, serverless) | ✅ |

---

## ✅ Phase 4: Deployment & Testing

| Task | Priority | Status |
|------|----------|--------|
| SEO per-page metadata for all routes | Medium | ✅ |
| Error boundaries (global-error.tsx) | Medium | ✅ |
| Loading skeletons (loading.tsx) | Medium | ✅ |
| Graceful DB connection failure handling | High | ✅ |
| Google DNS fix for MongoDB Atlas SRV | High | ✅ |
| MongoDB Atlas connection validated | High | ✅ |
| All API endpoints tested (public + auth-protected) | High | ✅ |
| Cashfree SDK end-to-end payment testing | High | 🔲 (requires sandbox test card) |
| Vercel deployment & env variable setup | High | 🔲 |
| Image optimization with `next/image` for all pages | Low | 🔲 |
| Lighthouse performance audit | Low | 🔲 |

---

## Project Structure

```
coretern-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, SEO, providers)
│   │   ├── page.tsx                # Landing page (server → client)
│   │   ├── LandingPageClient.tsx   # Client-side landing with all sections
│   │   ├── providers.tsx           # Theme, Toast, GoogleOAuth providers
│   │   ├── globals.css             # Full design system (~800 lines)
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── login/page.tsx          # Email + Google login
│   │   ├── register/page.tsx       # Registration + OTP verification
│   │   ├── forgot-password/page.tsx
│   │   ├── dashboard/page.tsx      # Student dashboard (4 tabs)
│   │   ├── internships/
│   │   │   ├── page.tsx            # Listing + search + domain filter
│   │   │   └── [id]/page.tsx       # Detail + enrollment + Cashfree pay
│   │   ├── services/
│   │   │   ├── page.tsx            # All services + Why Choose Us
│   │   │   └── [id]/page.tsx       # Service detail + features
│   │   ├── contact/page.tsx        # Contact form → ticket API
│   │   ├── verify/page.tsx         # Certificate verification
│   │   ├── about/page.tsx          # About us
│   │   ├── terms/page.tsx          # Terms of service
│   │   ├── privacy/page.tsx        # Privacy policy
│   │   ├── refund-policy/page.tsx  # Refund policy
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Sidebar + auth check
│   │   │   ├── login/page.tsx      # Admin-only login
│   │   │   ├── page.tsx            # Stats dashboard
│   │   │   ├── internships/page.tsx # CRUD + create/edit modal
│   │   │   ├── enrollments/page.tsx # List + cert issuance
│   │   │   ├── users/page.tsx      # User management
│   │   │   ├── certificates/page.tsx # Manual cert issuance
│   │   │   └── tickets/page.tsx    # Ticket management
│   │   └── api/                    # 30 API route files
│   │       ├── auth/               # 9 auth routes
│   │       ├── internships/        # 2 route files
│   │       ├── enrollments/        # 6 route files
│   │       ├── certificates/       # 4 route files
│   │       ├── tickets/            # 5 route files
│   │       └── users/              # 2 route files
│   ├── components/
│   │   ├── layout/                 # Navbar.tsx, Footer.tsx
│   │   └── landing/                # Hero, Services, InternshipCard, etc.
│   ├── context/ThemeContext.tsx     # Dark/Light mode
│   ├── data/servicesData.ts        # Service definitions + icons
│   ├── lib/
│   │   ├── api.ts                  # Client-side fetch wrapper
│   │   ├── auth.ts                 # JWT verify + protect middleware
│   │   ├── db.ts                   # Mongoose singleton
│   │   ├── email.ts                # Nodemailer SMTP
│   │   ├── cloudinary.ts           # Upload helper
│   │   ├── qrGenerator.ts         # QR code for certificates
│   │   ├── apiResponse.ts         # Response helpers
│   │   └── errorResponse.ts       # Error formatting
│   ├── models/
│   │   ├── User.ts
│   │   ├── Internship.ts
│   │   ├── Enrollment.ts
│   │   ├── Certificate.ts
│   │   └── Ticket.ts
│   └── types/global.d.ts          # Global type declarations
├── public/                         # Static assets (logos, images)
├── .env.local                      # All environment secrets
├── next.config.mjs                 # Production config
├── tsconfig.json                   # TypeScript config
├── MIGRATION_PLAN.md               # This file
└── package.json
```

## Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS Modules + Custom CSS
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs + Google OAuth
- **Payments:** Cashfree (Sandbox)
- **Storage:** Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Animations:** Framer Motion
- **Icons:** Lucide React
