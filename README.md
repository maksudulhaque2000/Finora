<div align="center">

# Finora — Personal Finance & Reporting 💼📊

  <img src="./public/preview.png" height="400" width="800" alt="Haque's Portfolio Cover"/>
</div>

Finora is a modern, responsive personal finance application built for individuals, freelancers, and small teams who need a polished, privacy-aware tool to track income, expenses, assets, liabilities, and generate accounting-style reports.

Live demo: https://finora-woad.vercel.app

Repository: https://github.com/maksudulhaque2000/Finora

Author / Portfolio: https://maksudul-haque.vercel.app

---

## 🚀 Project Summary

- Purpose: Provide a lightweight, opinionated finance workspace with clear visualizations and exportable reports.
- Audience: Freelancers, small business owners, and finance-minded individuals.
- Core idea: fast, secure, server-driven UI using Next.js App Router, Prisma, and Tailwind CSS.

---

## ✨ Highlights & Key Features

- ✅ Transaction management (income, expense, transfer)
- ✅ Category breakdowns and charts (monthly trends, net balance)
- ✅ Asset & liability management for balance-sheet tracking
- ✅ PDF report generation (balance sheet, ledger, income statement)
- ✅ Organization and user scoped data (multi-user support via NextAuth)
- ✅ Responsive, accessible UI with Tailwind CSS
- ✅ Global toast notifications and confirmation modals for destructive actions

---

## 🧭 Tech Stack

- Next.js (App Router) + TypeScript
- Prisma ORM with MongoDB provider
- NextAuth for authentication
- Tailwind CSS for styling
- Recharts for charts
- jsPDF + autotable for server-side PDF export
- ESLint & Prettier for code quality

---

## 📁 Architecture & Important Files

- `app/` — Next.js App Router pages, layouts and API routes
  - `app/layout.tsx` — root layout and providers
  - `app/(dashboard)/dashboard/page.tsx` — dashboard UI
  - `app/(dashboard)/reports/page.tsx` — reports and export UI
- `app/api/` — route handlers for transactions, assets, liabilities, and reports
- `components/` — UI components, forms, layout elements
  - `components/transaction-form.tsx`, `components/asset-form.tsx`, `components/liability-form.tsx`
  - `components/ui/toast.tsx` — toast provider and `useToast()` hook
- `lib/` — utilities for reports, finance logic, data aggregation
- `prisma/` — `schema.prisma` and seed script

---

## 🗂 Data Models (overview)

The primary domain models are defined in `prisma/schema.prisma`. Main entities include:

- `User` — application user, linked to sessions and organizations
- `Organization` — workspace grouping for multi-user data
- `Transaction` — financial entries (type: INCOME | EXPENSE | TRANSFER)
- `Category` — categorization for transactions
- `Asset` / `Liability` — balance-sheet items

Refer to `prisma/schema.prisma` for fields and relations.

---

## 🔌 API Endpoints (high-level)

- `POST /api/transactions` — Create transaction
- `GET /api/transactions` — List transactions (supports pagination)
- `POST /api/assets` — Create asset
- `POST /api/liabilities` — Create liability
- `POST /api/reports/export-pdf` — Generate PDF for given date range
- `DELETE /api/settings` — Account deletion (server cleanup)

Note: API routes perform server-side workspace checks to ensure users only access data scoped to their organization.

---

## 🔐 Authentication & Permissions

- Authentication is handled with NextAuth. Users sign in via providers (e.g., Google) and session tokens are used for server-side APIs.
- `getWorkspace()` helper (or equivalent) validates that the current user belongs to an organization and enforces role-based access.

---

## 🛠 Local Development — Setup & Run

Prerequisites

- Node.js 18+ (LTS recommended)
- npm (or pnpm)
- MongoDB (Atlas or local)

Quick start

```bash
git clone https://github.com/maksudulhaque2000/Finora.git
cd Finora
npm install
```

Create your `.env` with the variables below (example included):

`.env`

```env
DATABASE_URL="mongodb+srv://<user>:<pass>@cluster0.mongodb.net/finora?retryWrites=true&w=majority"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Environment guidance

- For local development, keep `NEXTAUTH_URL=http://localhost:3000`.
- For Vercel production, set `NEXTAUTH_URL` to your live domain exactly.
- If you prefer a single canonical app URL, set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the same live domain in Vercel.
- Set `AUTH_SECRET` and `NEXTAUTH_SECRET` to the same value in both local and production environments.
- If you enable Google or Facebook login, add the provider credentials in Vercel as well.
- `AUTH_URL` and `NEXT_PUBLIC_APP_URL` are optional configuration helpers used to keep URLs consistent across environments.
- For Facebook login, add your live domain to the Meta app's `App Domains` and `Valid OAuth Redirect URIs`, for example `https://finora-woad.vercel.app` and `https://finora-woad.vercel.app/api/auth/callback/facebook`.

Run dev server

```bash
npm run dev
```

Build for production

```bash
npm run build
npm run start
```

---

## 🧪 Testing & Quality

- Linting: `npm run lint`
- Tests: None are included by default — recommended to add Jest/Vitest for unit tests and Playwright for end-to-end tests.

---

## 📦 Deployment

- This repository is deployable to Vercel. Ensure all environment variables are configured in the Vercel dashboard. Use the `npm run build` output or connect the repository directly — Vercel will handle the App Router build automatically.

---

## ✅ Best Practices & Recommendations

- Secure secrets: Keep `NEXTAUTH_SECRET` and `DATABASE_URL` private — use platform secrets (Vercel, Netlify, etc.).
- Backups: If using a managed database (Atlas), enable automated backups for production.
- Monitoring: Add error reporting (Sentry) and basic observability for API routes.

---

## 🤝 Contributing

Contributions are welcome. Suggested steps:

1. Fork the repo
2. Create a feature branch
3. Run lint and tests locally
4. Open a PR with a clear description

If you'd like, I can add a `CONTRIBUTING.md` and `.env.example` to help onboard collaborators.

---

## 📝 License

This project does not include an explicit license file. If you plan to publish or share, consider adding an open-source license (MIT, Apache-2.0, etc.). I can add one for you.

---

## ✉️ Contact

- Maintainer: Maksudul Haque — https://maksudul-haque.vercel.app
- GitHub: https://github.com/maksudulhaque2000/Finora
- Live demo: https://finora-woad.vercel.app

---

If you want I can:

- Add screenshots and badges (GitHub Actions, Vercel, coverage)
- Add `CONTRIBUTING.md`, `.env.example`, and `LICENSE`
- Generate a short README summary for GitHub's repository description

Tell me which additions you want and I will add them.
