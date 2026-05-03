# Gozolt Ride Admin Panel

Admin dashboard for the Gozolt ride-hailing platform (Malta). Built with Next.js 15, TypeScript, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, dark theme
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React
- **Toasts:** Sonner

## Features

### Authentication
- Email/password login with 2FA (TOTP) support
- JWT-based auth with HTTP-only cookie storage
- Token refresh middleware
- Dev bypass mode for local development

### Dashboard Pages (19 pages)

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Dashboard | `/` | Overview KPIs, charts, recent activity |
| 2 | Supplier Management | `/supplier-management` | CRUD for fleet suppliers |
| 3 | Driver Management | `/driver-management` | Driver profiles, status, documents |
| 4 | Vehicle Management | `/vehicle-management` | Vehicle fleet management |
| 5 | User Management | `/user-management` | Rider/user accounts |
| 6 | Document Review | `/document-review` | Document approval workflow |
| 7 | Ride Management | `/ride-management` | Live rides, ride history |
| 8 | Payments | `/payments` | Transaction history, payouts |
| 9 | Surge Config | `/surge-config` | Dynamic pricing configuration |
| 10 | Zones & Areas | `/zones-areas` | Geofence zone management |
| 11 | Disputes | `/disputes` | Ticket/dispute resolution system |
| 12 | Analytics | `/analytics` | Revenue, ride, and user analytics |
| 13 | Audit Logs | `/audit-logs` | System audit trail |
| 14 | Pricing Rules | `/pricing-rules` | Fare rules and cancellation policies |
| 15 | Penalties | `/penalties` | Driver/supplier penalty tracking |
| 16 | Rewards | `/rewards` | Loyalty points and tier config |
| 17 | Promo Codes | `/promo-codes` | Promo code CRUD and management |
| 18 | Notifications | `/notifications` | Push/email/SMS campaign management |
| 19 | Settings | `/settings` | 6-tab settings (Fare, Fees, Admin Users, System, Language, Integrations) |

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, 2FA)
│   ├── (dashboard)/         # All dashboard pages
│   ├── api/auth/            # Next.js API routes for auth proxy
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── layout/              # Sidebar, header, layout shells
│   ├── auth/                # Login form, 2FA form
│   ├── dashboard/           # Dashboard widgets
│   ├── disputes/            # Dispute card components
│   ├── notifications/       # Campaign card components
│   ├── penalties/            # Penalty table components
│   ├── pricing/             # Pricing rule cards
│   ├── promo-codes/         # Promo code table/modal
│   ├── rewards/             # Reward config cards
│   └── settings/            # Settings tab components
├── hooks/                   # Custom React hooks per domain
├── services/admin/          # API service layer with types, mocks, services
├── stores/                  # Zustand stores (auth, sidebar)
├── lib/                     # Utilities (api-client, constants, utils)
├── types/                   # Shared TypeScript types and enums
└── middleware.ts             # Auth middleware for route protection
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/primooo-global-ltd/gozolt-ride-admin-frontend.git
cd gozolt-ride-admin-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_DEV_BYPASS=true          # Enable mock data (no backend needed)
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API URL
AUTH_SECRET=your-secret-key          # JWT signing secret
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

With `NEXT_PUBLIC_DEV_BYPASS=true`, all API calls return mock data with simulated delays — no backend required.

### Build

```bash
npm run build
npm start
```

## Design System

- **Background:** `#0A0A0A`
- **Cards:** `#141414`
- **Borders:** `#2A2A2A`
- **Primary CTA:** `#FACC15` (yellow)
- **Success:** `#22C55E`
- **Error:** `#EF4444`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#9CA3AF`
- **Text Muted:** `#6B7280`

## Architecture Patterns

- **Service Layer:** Each domain has `*.types.ts`, `*.mock.ts`, `*.service.ts` files
- **Dev Bypass:** `NEXT_PUBLIC_DEV_BYPASS=true` returns mock data from services
- **Custom Hooks:** One hook per domain handles data fetching, state, and mutations
- **Route Groups:** `(auth)` for login/2FA, `(dashboard)` for protected pages
- **Middleware:** Protects dashboard routes, redirects unauthenticated users to login
