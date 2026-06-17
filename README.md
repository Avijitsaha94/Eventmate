# 🎪 EventMate

**Find Your Next Adventure** — A full-stack social event platform that connects people through shared experiences, local events, and activities.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 📖 Overview

EventMate solves a simple but common problem: people often skip concerts, hikes, food festivals, or meetups simply because they have no one to go with. EventMate removes that barrier by letting anyone host an event — free or ticketed — and letting anyone discover and join experiences that match their interests.

The platform supports three roles (User, Host, Admin), secure payments via SSLCommerz, Google OAuth login, real-time dashboards with charts, and a fully responsive light/dark UI.

**Live Demo:** [https://eventmate.vercel.app](https://eventmate.vercel.app)
**API Base URL:** [https://eventmate-backend.onrender.com](https://eventmate-backend.onrender.com)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Design System](#-design-system)
- [Folder Structure](#-folder-structure)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Accounts](#-demo-accounts)
- [Deployment](#-deployment)
- [Testing with Postman](#-testing-with-postman)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Features

### Authentication & Access
- JWT-based authentication with bcrypt password hashing
- Google OAuth login (Passport.js)
- Instant demo login (User / Host / Admin) for quick evaluation
- Role-based access control across three roles

### Discovery & Browsing
- Full-text search across event titles and descriptions
- Multi-field filtering (category, location, price)
- Sort by newest, price, or popularity
- URL-synced filters (shareable links, working browser back button)
- Related/similar events on the event details page
- Skeleton loaders for smooth perceived performance

### Events & Bookings
- Full event lifecycle: open → full → completed → cancelled
- Real-time participant tracking
- Free event instant-join and paid event checkout flows
- Cloudinary-powered image uploads for events and avatars

### Payments
- SSLCommerz integration supporting bKash, Nagad, Rocket, and cards
- Server-side transaction validation to prevent payment spoofing
- Host revenue tracking with per-event breakdowns

### Reviews
- Five-star rating system with written reviews
- Business rules enforced: only completed events, only attendees, one review per event, hosts cannot review themselves

### Dashboards
- Separate dashboards for User, Host, and Admin
- Recharts-powered analytics (revenue trends, role distribution, event status, monthly activity)
- Paginated, filterable data tables for user and event management
- Editable profile settings with avatar upload

### Platform Pages
- 8-section homepage (hero with rotating highlights, how-it-works, categories, featured events, top hosts, FAQ, newsletter signup, why-us)
- About, Contact (with working email-backed form), Privacy Policy, and Terms of Service pages

### Engineering Quality
- Light/dark mode with persisted preference
- API rate limiting (auth, payments, general traffic)
- Centralized, environment-aware logging (silent in production)
- Modular backend architecture (model / service / controller / routes per domain)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, `next-themes` (dark mode) |
| UI Components | shadcn/ui, Lucide Icons |
| Charts | Recharts |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Backend Framework | Node.js, Express |
| Database | MongoDB Atlas with Mongoose ODM |
| Authentication | JWT, bcrypt, Passport.js (Google OAuth) |
| File Storage | Cloudinary, Multer |
| Payments | SSLCommerz |
| Email | Nodemailer (Gmail SMTP) |
| Security | express-rate-limit, CORS |
| Hosting | Vercel (frontend), Render (backend) |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | Blue (`blue-600` light / `blue-400` dark) |
| Accent | Amber (`amber-500`) |
| Neutral | Gray scale for text, surfaces, and borders |
| Status (semantic) | Green = success/open, Red = error/full/cancelled |
| Theme switching | Class-based via `next-themes`, persisted in `localStorage` |

---

## 🗂️ Folder Structure

```
eventmate/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/              # Login, Register
│       │   ├── (main)/              # Home, Events, Profile, About,
│       │   │                        # Contact, Privacy, Terms, Become-Host
│       │   ├── auth/callback/       # Google OAuth redirect handler
│       │   ├── dashboard/
│       │   │   ├── user/
│       │   │   ├── host/
│       │   │   └── admin/
│       │   │       ├── users/
│       │   │       ├── events/
│       │   │       ├── reviews/
│       │   │       ├── analytics/
│       │   │       └── categories/
│       │   └── payment/             # Success / Fail / Cancel
│       ├── components/
│       │   ├── shared/              # Navbar, Footer, ThemeToggle
│       │   ├── events/              # EventCard, EventCardSkeleton, FilterDrawer
│       │   └── reviews/             # StarRating, ReviewForm, ReviewCard, ReviewsSection
│       ├── lib/                     # Axios instance
│       ├── utils/                   # Auth helpers
│       └── types/                   # Shared TypeScript interfaces
│
└── backend/
    └── src/
        ├── modules/
        │   ├── auth/                # Register, login, Google OAuth
        │   ├── users/                # Profiles, roles, admin analytics
        │   ├── events/                # CRUD, search, sort, related events
        │   ├── bookings/              # Join / leave logic
        │   ├── reviews/                # Rating system
        │   ├── payments/                # SSLCommerz integration
        │   └── contact/                  # Contact form → email
        ├── middleware/                 # Auth, role, error, rate limiting
        ├── config/                     # DB, Cloudinary, Passport, email
        ├── utils/logger.ts              # Environment-aware logger
        └── seed.ts                       # Seeds demo accounts
```

---

## 🌐 API Reference

Base URL (local): `http://localhost:5000`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/me` | Protected | Get the current authenticated user |
| GET | `/api/auth/google` | Public | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | Public | Google OAuth redirect target |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/top-hosts` | Public | Top-rated hosts for the homepage |
| GET | `/api/users/admin/chart-data` | Admin | Role/status/monthly analytics data |
| GET | `/api/users/:id` | Public | Public profile |
| PATCH | `/api/users/profile` | Protected | Update own profile |
| POST | `/api/users/become-host` | Protected | Self-upgrade to Host role |
| POST | `/api/users/upload-avatar` | Protected | Upload a profile photo |
| PATCH | `/api/users/:id/status` | Admin | Block / unblock a user |
| PATCH | `/api/users/:id/role` | Admin | Change a user's role |

### Events
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List events (filter, sort, paginate) |
| GET | `/api/events/featured` | Public | Featured events for the homepage |
| GET | `/api/events/host/:hostId` | Public | Events created by a host |
| GET | `/api/events/:id` | Public | Single event detail |
| GET | `/api/events/:id/related` | Public | Similar events |
| POST | `/api/events` | Host | Create an event |
| POST | `/api/events/upload-image` | Host | Upload an event banner |
| PATCH | `/api/events/:id` | Host | Update an event |
| PATCH | `/api/events/:id/status` | Host | Change event status |
| DELETE | `/api/events/:id` | Host / Admin | Delete an event |

`GET /api/events` query parameters: `type`, `location`, `fee` (`free`/`paid`), `status`, `search`, `page`, `limit`, `sort` (`newest`/`price-low`/`price-high`/`popular`).

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/bookings/my` | Protected | Current user's bookings |
| GET | `/api/bookings/:eventId/participants` | Host | Participant list for an event |
| POST | `/api/bookings/:id/join` | User | Join a free event |
| POST | `/api/bookings/:id/leave` | Protected | Leave an event |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reviews/host/:hostId` | Public | Reviews and average rating for a host |
| GET | `/api/reviews/check/:eventId` | Protected | Whether the user already reviewed |
| POST | `/api/reviews` | User | Submit a review |
| DELETE | `/api/reviews/:id` | Admin | Remove a review |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create-intent` | User | Begin an SSLCommerz transaction |
| POST | `/api/payments/success` | Public (gateway callback) | Confirms a successful payment |
| POST | `/api/payments/fail` | Public (gateway callback) | Cleans up after a failed payment |
| POST | `/api/payments/cancel` | Public (gateway callback) | Cleans up after a cancelled payment |
| GET | `/api/payments/my` | Protected | Payment history |
| GET | `/api/payments/host/revenue` | Host | Revenue summary |
| GET | `/api/payments/host/revenue-chart` | Host | Revenue chart data |

### Contact
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Send a message via the contact form |

---

## 🗄️ Database Schema

| Collection | Key Fields |
|---|---|
| `users` | name, email, password (hashed), role, avatar, bio, interests, location, isActive |
| `events` | title, type, hostId, date, location, fee, status, minParticipants, maxParticipants, currentParticipants |
| `bookings` | userId, eventId, status, paymentStatus, paymentId |
| `reviews` | reviewerId, hostId, eventId, rating, comment |
| `payments` | userId, eventId, amount, transactionId, status |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or later
- A MongoDB Atlas cluster
- A Cloudinary account
- An SSLCommerz sandbox account
- A Google Cloud OAuth client
- A Gmail account with an App Password enabled

### Clone the repository

```bash
git clone https://github.com/yourusername/eventmate.git
cd eventmate
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Populate .env with your credentials (see below)
npm run dev
```

The API will be available at `http://localhost:5000`.

Optionally, seed demo accounts for quick testing:

```bash
npm run seed
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

### `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/eventmate
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=false

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=replace_with_a_long_random_string

EMAIL_USER=
EMAIL_PASS=

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> **Security note:** Never commit `.env` files. They are excluded via `.gitignore`. Use `.env.example` as a reference for required keys without real values.

---

## 🎮 Demo Accounts

Run `npm run seed` in the `backend` folder, then use the **Quick demo access** buttons on the login page, or log in manually:

| Role | Email | Password |
|---|---|---|
| User | `demo.user@eventmate.com` | `demo1234` |
| Host | `demo.host@eventmate.com` | `demo1234` |
| Admin | `demo.admin@eventmate.com` | `demo1234` |

---

## ☁️ Deployment

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory: `frontend` |
| Backend | Render | Root directory: `backend` |
| Database | MongoDB Atlas | Free M0 tier is sufficient |
| Images | Cloudinary | Free tier is sufficient |

See the full step-by-step deployment guide in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

Key production considerations:
- Set `NODE_ENV=production` on the backend so the logger suppresses debug/info noise.
- Update the Google OAuth authorized redirect URI to the deployed backend URL.
- Update SSLCommerz callback URLs once the backend is live.
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (or your hosting provider's static IPs).

---

## 🧪 Testing with Postman

A complete Postman collection is included: `EventMate_Postman_Collection.json`.

1. Import the collection into Postman.
2. Set the `baseUrl` collection variable to your API URL.
3. Run requests in this order for a full happy-path test: Register User → Register Host → Get Current User → Create Event → Get All Events → Join Free Event → Get My Bookings → Update Event Status (to `completed`) → Create Review → Create Payment Intent.
4. Auth tokens are captured automatically into collection variables via each request's test script.

---

## 🗺️ Roadmap

- Real-time chat between event participants (Socket.io)
- Map-based event discovery
- Push notifications and event reminders
- Facebook OAuth as an additional social login option
- Native mobile app sharing the same backend

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built as a full-stack portfolio project demonstrating production-grade patterns: authentication, payments, role-based access, and real-time dashboards.
