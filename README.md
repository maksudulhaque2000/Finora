# Finora

Finora is a premium financial management platform built with Next.js, TypeScript, Tailwind CSS, Prisma, MongoDB, and NextAuth.

## What this scaffold includes

- A polished landing page with a strong visual identity
- Secure authentication with email/password login and registration
- Protected dashboard routes with a professional shell and offline banner
- Core finance pages for income, expenses, assets, liabilities, categories, reports, and settings
- MongoDB-backed Prisma models for users, organizations, transactions, categories, assets, liabilities, and memberships
- CRUD API routes with validation, rate limiting, and consistent error responses
- Report endpoints for summary, income statement, balance sheet, ledger, and PDF export
- 404 and application-level error handling
- Loading states and skeleton surfaces for faster perceived performance

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- React Hook Form + Zod
- Recharts
- Prisma ORM with MongoDB
- NextAuth v5
- jsPDF for PDF export

## Environment Variables

Copy [.env.example](.env.example) to `.env.local` and fill in the values.
Use plain values by default; quotes are optional and only needed when a value contains spaces or characters that should be preserved exactly. The app's `.env.local` is parsed correctly with or without quotes around simple values such as URLs and names.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Default seed account

- Email: `admin@finora.app`
- Password: `Password123!`

## Notes

- MongoDB is used as the primary database through Prisma.
- The structure is ready for production expansion, but some UI interactions are still scaffold-level and should be wired to the API routes in the next pass.
- Bengali localization support can be layered on later without changing the core architecture.
